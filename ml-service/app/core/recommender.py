from app.core.models import ModelRegistry
from app.core.embeddings import encode

def recommend_jobs(resume):

    if not getattr(ModelRegistry, "index", None) or not getattr(ModelRegistry, "jobs", None):
        return []

    q = encode([resume])

    D, I = ModelRegistry.index.search(q, 5)

    results = []

    for idx, score in zip(I[0], D[0]):
        job = ModelRegistry.jobs[idx].copy()
        job["match"] = round(score * 100, 2)
        results.append(job)

    return results
