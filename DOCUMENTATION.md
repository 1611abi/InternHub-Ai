# Project Documentation: InternHub AI

## 1. Project Abstract
InternHub AI is a unified platform designed to bridge the gap between internship discovery and career preparation. It leverages real-time web scraping to aggregate job listings from multiple sources and uses local AI (Ollama) to provide personalized career guidance, ATS-friendly resume optimization, and skill gap analysis.

## 2. Problem Statement
Students often struggle to find relevant internships across fragmented platforms and fail to pass ATS filters due to unoptimized resumes. Additionally, identifying missing skills and finding structured learning paths remains a significant hurdle.

## 3. Proposed System
The proposed system provides:
- **Unified Search:** Real-time aggregation of internships.
- **AI Resume Builder:** Local AI-driven ATS optimization without privacy concerns.
- **Skill Gap Analyzer:** Intelligent mapping of student skills to job requirements.
- **Career Chatbot:** Domain-aware assistant for career queries.

## 4. Architecture Explanation
The system follows a MERN stack architecture with a focus on local AI integration:
- **Frontend:** React.js for a dynamic, responsive UI.
- **Backend:** Node.js/Express.js for API management and scraping logic.
- **AI Layer:** Ollama running Mistral/Llama3 for privacy-first NLP tasks.
- **Database:** MongoDB for persistence of user preferences and saved listings.
- **Scraping Layer:** Axios and Cheerio for high-performance data extraction.

## 5. Technologies Used
- **Frontend:** React, Tailwind CSS, Lucide React, Framer Motion.
- **Backend:** Node.js, Express, Puppeteer/Cheerio (Scraping), PDFKit (Reporting).
- **AI:** Ollama (Mistral).
- **Database:** MongoDB.

## 6. Advantages
- **Privacy-First:** Local AI processing ensures student data stays on their machine.
- **Cost-Effective:** Zero reliance on paid APIs (e.g., OpenAI/Indeed API).
- **Consolidated:** One-stop solution for searching and preparing.

## 7. Future Scope
- **Email Alerts:** Automated notifications for new internships.
- **Community Forum:** Peer-to-peer discussion and reviews.
- **Mock Interviews:** AI-powered interview simulation.

## 8. Frontend Technologies in Detail
**What we use and why:**
- **React.js:** Used as the core JavaScript library for building the user interface. It allows us to create reusable UI components, manage state efficiently across complex interacting elements (like search forms, job listings, and the AI chat interface), and build a dynamic single-page application (SPA) experience.
- **Tailwind CSS:** A utility-first CSS framework used for rapid UI development and styling. We use it to style components directly within our JSX/HTML without writing custom CSS files, ensuring highly responsive and modern designs.
- **Lucide React:** A comprehensive open-source icon library. We use it to provide scalable, customizable, and consistent vector icons throughout the interface easily via React components.
- **Framer Motion:** A production-ready animation library for React. Used to add smooth, intuitive micro-interactions and transitions (like modals sliding in or list animations) to make the user experience feel premium and highly responsive.
- **React Router:** Used for client-side routing, enabling seamless navigation between different views (e.g., Dashboard, Resume Builder, Job Search).
- **Zustand / Context API:** Used for robust global state management across the application (e.g., managing user sessions, theme preferences, and saved jobs).

## 9. Backend Technologies in Detail
**What we use and why:**
- **Node.js & Express.js:** The core runtime and web framework used to build our RESTful API. We use it for its non-blocking, event-driven architecture, which is excellent for handling numerous simultaneous requests like web scraping or querying local AI models.
- **Cheerio & Puppeteer (Web Scraping):** Used for the foundational real-time job scraping mechanism. 
  - **Cheerio:** We use it to quickly parse static HTML and extract job titles, descriptions, and links.
  - **Puppeteer:** A Headless Chrome API used when target career portals rely heavily on Client-Side Rendering (JavaScript) to load job data. It allows us to wait for the DOM to populate before extracting data.
- **MongoDB & Mongoose:** A NoSQL database used to store unstructured or semi-structured data like user profiles, saved jobs, parsed resumes, and chat histories. Mongoose provides a schema-based solution to model our application data.
- **JWT (JSON Web Tokens):** Used for stateless, secure user authentication and authorization between the frontend and backend.
- **pdf-parse / PDFKit:** Used to handle resume documents. `pdf-parse` extracts text from uploaded student resumes for the AI analyzer, while `PDFKit` dynamically generates optimized, ATS-friendly PDF resumes for download.

## 10. Machine Learning (AI) Technologies in Detail
**What we use and why:**
- **Ollama:** Used as the local execution engine for Large Language Models (LLMs). We use Ollama because it is incredibly lightweight, allows us to run powerful models locally on the host machine without expensive cloud AI costs, and ensures 100% data privacy for users since no data is sent to external, third-party APIs.
- **Mistral / Llama 3 (via Ollama):** The actual underlying open-source generative AI models. We use these specifically for:
  - **Resume Optimization:** Scanning parsed text from a student's resume, comparing it against detailed job descriptions, and generating ATS-friendly keywords and bullet points.
  - **Skill Gap Analysis:** Analyzing the user's current tech stack against the most frequent requirements found in aggregated internship postings to recommend continuous learning paths.
  - **Domain-Aware Chatbot:** Powering the NLP interface where students can ask career-specific queries to get instantaneous feedback based on loaded context.
- **LangChain:** Used as the orchestration framework between our Node.js backend and the Ollama service, enabling complex multi-step AI workflows (e.g., extracting text, chunking it, defining specific prompt templates, and structuring the output to return to the frontend).
