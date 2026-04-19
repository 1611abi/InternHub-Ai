import os
from dotenv import load_dotenv

# Try loading from backend if ml-service doesn't have an independent one
if os.path.exists("../../backend/.env"):
    load_dotenv("../../backend/.env")
else:
    load_dotenv()

DB_MODE = os.getenv("DB_MODE", "cloud")
if DB_MODE == "local":
    MONGODB_URI = os.getenv("MONGODB_LOCAL_URI", "mongodb://localhost:27017/internhub")
else:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/internhub")
