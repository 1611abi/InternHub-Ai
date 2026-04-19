from app.core.config import MONGODB_URI
from app.core.models import ModelRegistry
from app.core.embeddings import encode
from app.core.skill_engine import extract_skills
from pymongo import MongoClient

def load_jobs_into_faiss():
    print(f"Connecting to MongoDB ({MONGODB_URI}) to load jobs...")
    client = MongoClient(MONGODB_URI)
    db = client.get_database() # Defaults to db from URI
    jobs_collection = db["jobs"]
    
    jobs = list(jobs_collection.find({}))
    if not jobs:
        print("No jobs found in database.")
        ModelRegistry.jobs = []
        return
        
    print(f"Loaded {len(jobs)} jobs from MongoDB. Extracting embeddings...")
    texts = []
    
    for job in jobs:
        title = job.get('title', '')
        desc = job.get('description', '')
        skills = " ".join(job.get('skillsRequired', []))
        texts.append(f"{title}. {desc}. Required Skills: {skills}")
        
    embeddings = encode(texts)
    
    # Ensure index is empty before dynamic updates in case of cron syncing
    ModelRegistry.index.reset()
    ModelRegistry.index.add(embeddings)
    ModelRegistry.jobs = jobs
    print(f"Loaded {len(jobs)} jobs into FAISS index dynamically.")

def retrieve_and_rerank_jobs(resume_text, top_k=6):
    if not ModelRegistry.jobs or ModelRegistry.index.ntotal == 0:
        return []
        
    resume_emb = encode(resume_text)
    
    similarities, indices = ModelRegistry.index.search(resume_emb, min(top_k, len(ModelRegistry.jobs)))
    
    resume_skills = set(extract_skills(resume_text))
    
    results = []
    for match_score, idx in zip(similarities[0], indices[0]):
        job = ModelRegistry.jobs[idx]
        
        job_skills = set(job.get('skillsRequired', []))
        extracted_job_skills = set(extract_skills(job.get('description', '')))
        job_skills = job_skills.union(extracted_job_skills)
        
        if job_skills:
            overlap = len(resume_skills.intersection(job_skills)) / len(job_skills)
        else:
            overlap = 0.5
            
        final_score = (float(match_score) * 0.6) + (overlap * 0.4)
        
        results.append({
            "id": str(job['_id']),
            "title": job.get('title', ''),
            "company": job.get('companyName', 'Partner'),
            "domain": job.get('domain', 'Tech'),
            "match": round(final_score * 100, 2),
            "explanation": f"Recommended due to {round(float(match_score)*100)}% semantic profile and {round(overlap*100)}% explicit skill match."
        })
        
    # Re-rank based on the hybrid score
    results = sorted(results, key=lambda x: x['match'], reverse=True)
    return results
