from app.core.embeddings import encode
import numpy as np

def semantic_match(text1, text2):
    if not text1 or not text2:
        return 0.0
        
    emb1 = encode(text1)
    emb2 = encode(text2)
    
    # Compute dot product between normalized vectors
    similarity = np.dot(emb1[0], emb2[0])
    
    # Bound between 0 and 1
    return float(max(0.0, min(1.0, similarity)))
