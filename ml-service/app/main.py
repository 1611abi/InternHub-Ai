from fastapi import FastAPI
from app.api.routes import router
from app.core.models import load_all_models
from app.services.job_service import load_jobs_into_faiss

app = FastAPI(title="InternHub AI ML Engine")

@app.on_event("startup")
def startup():
    load_all_models()
    load_jobs_into_faiss()

app.include_router(router)
