# Setup & Run Instructions

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or Atlas URI)
- Ollama installed and running (`ollama serve`)
- Ollama Mistral model downloaded (`ollama pull mistral`)

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
# Update .env if needed
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## How to Use
1. **Search:** Enter a domain like "React Developer" in the Search page to see live results.
2. **Resume:** Paste your skills and a job description to get an ATS-optimized summary and download the PDF.
3. **Skill Gap:** Input your skills vs job requirements to see what you need to learn.
4. **Chat:** Talk to the AI Career Guide for project ideas and advice.
