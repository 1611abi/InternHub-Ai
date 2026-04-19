from sentence_transformers import SentenceTransformer
import faiss
import spacy
import spacy.cli
import language_tool_python
import asyncio

class ModelRegistry:
    sbert = None
    nlp = None
    grammar_tool = None
    index = None
    jobs = []

def load_all_models():
    print("Loading Sentence Transformer...")
    ModelRegistry.sbert = SentenceTransformer("all-MiniLM-L6-v2")
    
    print("Loading spaCy NLP pipeline...")
    try:
        ModelRegistry.nlp = spacy.load("en_core_web_sm")
    except OSError:
        spacy.cli.download("en_core_web_sm")
        ModelRegistry.nlp = spacy.load("en_core_web_sm")
    
    print("Loading LanguageTool grammar engine...")
    ModelRegistry.grammar_tool = language_tool_python.LanguageTool('en-US')
    
    # Initialize FAISS Index with Inner Product (Cosine Similarity if normalized)
    # all-MiniLM-L6-v2 outputs 384-dimensional embeddings
    ModelRegistry.index = faiss.IndexFlatIP(384)
