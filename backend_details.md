# Deep Dive: Backend Architecture (Node.js & Express)

The backend is built using the **MVC (Model-View-Controller)** pattern (though the "View" is replaced by the React Frontend). This structure ensures that database logic (Models), request handling (Controllers), and URL paths (Routes) are kept separate and organized.

---

### 🚀 Core Files
- **[server.js](file:///d:/Desktop/my-frist-app/backend/server.js)**: The heart of the backend. It acts as the switchboard:
  - Initializes the **Express** app.
  - Connects to the **MongoDB** database.
  - Sets up **CORS** (to allow the Frontend to talk to it).
  - Links all the different Route files together.
- **[.env](file:///d:/Desktop/my-frist-app/backend/.env)**: Stores sensitive information like your Database URL and JWT Secret keys (should never be shared).
- **[package.json](file:///d:/Desktop/my-frist-app/package.json)**: Lists all backend dependencies (Express, Mongoose, JWT, Axios, Multer).

---

### 📁 1. The Controllers (`/backend/controllers`)
The "Logic" folder. These files contain the functions that run when a specific API is called.

- **`authController.js`**: Manages User Security. Handles `register` (hashing passwords) and `login` (checking passwords and issuing JWT tokens).
- **`atsController.js`**: The bridge to the AI. It takes a resume, sends it to the Python service, and processes the score.
- **`careervaultController.js`**: The largest controller. It manages the content library (creating folders, uploading resources, and approving/rejecting user uploads).
- **`jobController.js`** & **`internshipController.js`**: Handle the logic for searching, filtering, and fetching job/internship listings.
- **`adminController.js`**: Provides site-wide statistics (e.g., total users, pending reviews) for the Admin Dashboard.
- **`recruiterController.js`**: Handles features specific to recruiters, like posting new jobs and viewing who applied.
- **`resumeController.js`**: Manages the storage and retrieval of user resumes.

---

### 📁 2. The Models (`/backend/models`)
The "Data Schema" folder. These files tell MongoDB exactly how much information to store for each item.

- **`User.js`**: Defines fields like `username`, `email`, `password`, and `role` (Admin, Recruiter, or Seeker).
- **`Job.js`** & **`Internship.js`**: Store details like `title`, `company`, `salary`, and `requirements`.
- **`Resume.js`**: Links a user's ID to their uploaded PDF file path.
- **`ATSReport.js`**: Stores the AI evaluation of a resume (score, missing keywords, etc.).
- **`careervault/`**:
  - `Folder.js`: Represents categories like "Notes" or "Previous Papers".
  - `Resource.js`: Stores the actual links or files shared by the community.
  - `ResourceReport.js`: Stores reports from users if they find a resource inappropriate.

---

### 📁 3. The Routes (`/backend/routes`)
The "URL Map" folder. These files define the text people type in (the endpoints).

- **`authRoutes.js`**: Defines paths like `/api/auth/register` and `/api/auth/login`.
- **`atsRoutes.js`**: Defines paths like `/api/ats/analyze` and `/api/ats/history`.
- **`careervault.js`**: Defines the routes for browsing and managing the resource library.
- **`recruiterRoutes.js`**: Defines endpoints for recruiters to manage their job postings.
- **`profileRoutes.js`**: Handles updating user profile details.

---

### 📁 4. The Middleware (`/backend/middleware`)
The "Security Checkpoint" folder. These functions run *before* the controller to verify things.

- **`authMiddleware.js`**: The most important one. It checks the JWT (token) in the request header to make sure the user is logged in.
- **`uploadMiddleware.js`**: Uses a library called **Multer** to handle file uploads, checking if the file is a PDF and assigning it a unique filename.
- **`careervaultAuth.js`**: Checks if a user has special permissions (like Admin status) before allowing them to delete or approve resources.

---

### 📁 5. The Services (`/backend/services`)
The "Worker" folder. These are utility files that perform specific background tasks.

- **`aiService.js`** / **`atsService.js`**: Contain the `axios` code that physically connects to the Python ML server.
- **`scraperService.js`**: Contains logic to "scrape" or fetch jobs from other external websites.
- **`resumeBuilderService.js`**: Contains logic for formatting and generating resume data.

---

### 📁 6. Scripts & Utilities
- **`seedAdmin.js`**: A script to manually create a "Super Admin" user in the database.
- **`fixAdmin.js`**: A troubleshooting script to fix permissions if an admin gets locked out.
- **`testFlow.js`**: Used by developers to test if the API is working without using the frontend.

---

### 💡 Why is it structured this way?
1. **Separation of Concerns**: If there's a bug in how jobs are fetched, you look in `jobController.js`. If there's a bug in the database connection, you look in `server.js`.
2. **Scalability**: Want to add a "Video Interview" feature? You just add `videoRoutes.js`, `videoController.js`, and `Video.js` model without breaking anything else.
3. **Security**: By putting `authMiddleware` in the routes, you ensure that hackers cannot access private data just by knowing the URL.
