from app.core.semantic_engine import semantic_match
from app.core.skill_engine import identify_skill_gap
from app.core.grammar import compute_grammar_score, analyze_structure, compute_experience_impact

def evaluate_resume(resume_text, job_description):
    # 1. Semantic Match (30%)
    semantic_score = semantic_match(resume_text, job_description) * 100
    
    # 2. Skill Overlap (40%)
    matched_skills, missing_skills = identify_skill_gap(resume_text, job_description)
    total_skills = len(matched_skills) + len(missing_skills)
    skill_score = (len(matched_skills) / total_skills * 100) if total_skills > 0 else 50
    
    # 3. Grammar (10%)
    grammar_score, grammar_errors = compute_grammar_score(resume_text)
    
    # 4. Structure (10%)
    structure_score = analyze_structure(resume_text)
    
    # 5. Experience Impact (10%)
    experience_score = compute_experience_impact(resume_text)
    
    final_score = (
        (semantic_score * 0.30) +
        (skill_score * 0.40) +
        (grammar_score * 0.10) +
        (structure_score * 0.10) +
        (experience_score * 0.10)
    )
    
    suggestions = []
    if skill_score < 60:
        suggestions.append("Consider adding more strongly required skills based on the job description.")
    if grammar_score < 90:
        suggestions.append("Check grammar and spelling. Minor errors detected.")
    if structure_score < 70:
        suggestions.append("Ensure your resume contains recognizable headings like 'Experience', 'Education', 'Skills'.")
    if experience_score < 70:
        suggestions.append("Use more strong action verbs (e.g., Developed, Managed, Optimized).")
        
    if not suggestions:
        suggestions.append("Great resume! Ensure format matches ATS limits.")
    
    return {
        "score": round(max(0, min(100, final_score)), 2),
        "breakdown": {
            "semantic": round(semantic_score, 2),
            "skills": round(skill_score, 2),
            "grammar": round(grammar_score, 2),
            "structure": round(structure_score, 2),
            "experience": round(experience_score, 2)
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "grammar_errors": grammar_errors
    }
