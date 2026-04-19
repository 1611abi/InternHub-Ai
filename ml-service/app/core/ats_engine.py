import re

SECTIONS = ["experience", "education", "skills", "projects"]

ACTION_WORDS = [
    "developed","built","designed","implemented",
    "led","optimized","created","improved"
]

def structure_score(text):
    t = text.lower()
    score = 0
    for sec in SECTIONS:
        if sec in t:
            score += 2.5
    return score

def experience_score(text):
    words = set(text.lower().split())
    matches = set(ACTION_WORDS).intersection(words)
    return min(20, len(matches) * 3)
