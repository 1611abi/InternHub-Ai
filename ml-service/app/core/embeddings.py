from app.core.models import ModelRegistry
import faiss
import numpy as np

def encode(texts):
    if not texts:
        return np.array([])
        
    if isinstance(texts, str):
        texts = [texts]
        
    embeddings = ModelRegistry.sbert.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    faiss.normalize_L2(embeddings)
    return embeddings
