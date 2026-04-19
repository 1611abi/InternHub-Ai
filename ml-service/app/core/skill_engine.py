from app.core.models import ModelRegistry

def extract_skills(text):
    if not text:
        return []
        
    doc = ModelRegistry.nlp(text.lower())
    
    skills = set()
    
    # Extract nouns and proper nouns
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop and len(token.text) > 2:
            skills.add(token.text)
            
    # Extract named entities
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART", "PERSON"]:
            skills.add(ent.text.lower())
            
    return list(skills)

def identify_skill_gap(resume_text, job_description):
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_description))
    
    matched_skills = resume_skills.intersection(job_skills)
    missing_skills = job_skills.difference(resume_skills)
    
    return list(matched_skills), list(missing_skills)
