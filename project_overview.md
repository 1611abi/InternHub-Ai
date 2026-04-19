# 🚀 Project Overview: InternHub AI

## 📖 1. Project Abstract
InternHub AI is a unified, intelligent platform designed to bridge the gap between internship discovery and career preparation. It leverages real-time web scraping to aggregate job listings and utilizes AI (Ollama/Mistral) combined with a custom Python Machine Learning service to provide personalized career guidance, ATS-friendly resume optimization, skill gap analysis, and intelligent job recommendations. The platform also includes a comprehensive role-based system (Job Seekers, Recruiters, and Admins) and a community resource sharing module (CareerVault).

## 🏗️ 2. System Architecture
The application follows a modern microservices-oriented **MERN Stack + Python ML + Local AI** architecture:

- **Frontend (Client-Side):** A responsive, dynamic React.js Single Page Application (SPA) built with Vite and styled with Tailwind CSS. It communicates with the backend via RESTful APIs.
- **Backend (Server-Side Node.js):** The core Node.js/Express.js backend handles user authentication, business logic, web scraping, and database interactions.
- **ML Service (FastAPI):** A dedicated Python microservice running FastAPI, responsible for heavy-lifting ML tasks like ATS scoring, skill gap analysis, and job recommendations using `scikit-learn`, `spacy`, and `sentence-transformers`.
- **Local AI Layer:** Integration with local LLM APIs (Ollama running Mistral) for privacy-first Natural Language Processing tasks, such as generating career advice and optimizing resume text without external API costs.
- **Database:** MongoDB acts as the primary NoSQL data store for users, jobs, applications, and resources.

## 🛠️ 3. Technologies Used
### Frontend (React / Vite)
- **Framework:** React.js 18 with Vite
- **Styling & UI:** Tailwind CSS, Framer Motion (animations), Lucide React & React Icons
- **Routing & HTTP:** React Router DOM, Axios
- **Markdown & PDF:** React-Markdown, Remark-GFM, HTML2PDF.js

### Backend (Node.js / Express)
- **Server:** Node.js, Express.js
- **Database:** Mongoose (MongoDB ODM)
- **Authentication:** JSON Web Tokens (JWT), BcryptJS
- **Data Collection:** Puppeteer, Cheerio (Web Scraping)
- **AI Integration:** Official `ollama` SDK
- **Utilities:** Multer (file uploads), PDF-Parse, PDFKit

### ML Service (Python / FastAPI)
- **Framework:** FastAPI, Uvicorn
- **Machine Learning & NLP:** Scikit-learn, SpaCy, Sentence-Transformers, NumPy
- **Utilities:** PyPDF2, Python-Multipart

## 🌊 4. Project Flow
1. **Authentication & Authorization:** Users register/login with specific roles (Seeker, Recruiter, Admin). Valid JWT tokens dictate access rights via middleware.
2. **Job Discovery & Scraping:** Recruiters can post jobs natively, while backend services (using Puppeteer/Cheerio) scrape external listings. Seekers browse these aggregated roles.
3. **Application & ATS Processing:** Seekers upload Resumes (PDF). The application parses the PDF and offloads textual data to the Python ML Service and Ollama for ATS compatibility evaluation, scoring, and feedback generation.
4. **Skill Gap Analysis:** The system compares a user's extracted skills against job description requirements, generating a visual gap report and learning recommendations.
5. **CareerVault Moderation Flow:** Users can upload helpful resources. These are flagged as 'Pending' in MongoDB. Admins review them via a dedicated Admin Dashboard to either 'Approve' or 'Reject' them before public visibility.

## ✨ 5. Main Features
- **Role-Based Access Control:** Distinct, protected dashboards for Job Seekers, Recruiters, and Admins.
- **Real-Time Job Aggregation:** Automated scraping of external internship/job boards.
- **AI Resume Builder & ATS Scorer:** Privacy-first, local AI-driven tool to test resumes against job descriptions and generate optimized summaries.
- **Skill Gap Analyzer:** Intelligent mapping of existing skills against market requirements outlining learning paths.
- **CareerVault (Resource Moderation):** A community-driven resource hub overseen by Admins to ensure high-quality material sharing.
- **Career Chatbot:** An AI-powered, domain-aware assistant running locally for immediate career queries.
- **Recruitment Management:** Tools for recruiters to post jobs, manage applications, and track candidates.
