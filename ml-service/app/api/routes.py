from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume_service import parse_resume
from app.services.job_service import retrieve_and_rerank_jobs
from app.core.scorer import evaluate_resume
from app.core.skill_engine import identify_skill_gap

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), job: str = Form(...)):
    file_bytes = await file.read()
    try:
        resume_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    ats_evaluation = evaluate_resume(resume_text, job)
    return ats_evaluation

@router.post("/recommend")
async def recommend(file: UploadFile = File(...)):
    file_bytes = await file.read()
    try:
        resume_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    jobs = retrieve_and_rerank_jobs(resume_text)
    return {"jobs": jobs}

@router.post("/skill-gap")
async def skill_gap(file: UploadFile = File(...), job: str = Form(...)):
    file_bytes = await file.read()
    try:
        resume_text = parse_resume(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    matched, missing = identify_skill_gap(resume_text, job)
    
    total = len(matched) + len(missing)
    match_percentage = (len(matched) / total * 100) if total > 0 else 0
    
    return {
        "match_percentage": round(match_percentage, 2),
        "matching_skills": matched,
        "missing_skills": missing,
        "skill_gap_summary": f"Your resume matches {round(match_percentage, 1)}% based on standard skills.",
        "learning_roadmap": "Focus on developing: " + ", ".join(missing[:5]) if missing else "Your skills align perfectly.",
        "ai_analysis": "Based on enterprise analysis, bridging your missing skills will vastly improve your ATS index."
    }
