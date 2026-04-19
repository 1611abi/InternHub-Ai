from app.core.models import ModelRegistry

def compute_grammar_score(text):
    if not text:
        return 0, []
        
    tool = ModelRegistry.grammar_tool
    try:
        matches = tool.check(text)
    except Exception as e:
        print(f"LanguageTool error: {e}")
        return 100, [] # Graceful degradation
    
    penalty = min(50, len(matches) * 2)
    score = 100 - penalty
    
    errors = [match.message for match in matches[:5]]
    return score, errors

def analyze_structure(text):
    score = 50
    text_lower = text.lower()
    
    sections = ['experience', 'education', 'skills', 'projects', 'summary', 'objective']
    found = sum(1 for sec in sections if sec in text_lower)
    
    score += (found * 10)
    score = min(100, score)
    
    return score

def compute_experience_impact(text):
    action_verbs = ['developed', 'managed', 'led', 'designed', 'created', 'implemented', 'orchestrated', 'built', 'improved', 'increased', 'optimized']
    
    text_lower = text.lower()
    found = sum(1 for verb in action_verbs if verb in text_lower)
    
    score = 50 + (found * 5)
    return min(100, score)
