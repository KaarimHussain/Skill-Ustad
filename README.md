# Skillistan 🎓✨

**AI-powered skill learning platform** built with **ASP.NET Core**, **FastAPI (Python)**, and **a modern frontend stack**, enhanced with **AI models like Gemini and Ollama**.

Skillistan is designed to help learners **discover, practice, and master skills** with **personalized AI guidance**. It’s more than just an LMS — it’s a smart, interactive platform that adapts to each learner’s journey.

---

## 🚀 Features

* 🔐 **Secure Authentication** – User registration, login, and profile management.
* 🤖 **AI-Powered Learning** – Gemini API + Ollama LLM integration for tutoring, Q\&A, and skill assessments.
* 📚 **Courses & Modules** – Structured skill-based learning paths with progress tracking.
* 📝 **Practice & Assignments** – Interactive tasks with AI-driven feedback.
* 💾 **File & Media Support** – Upload, store, and manage course files and images.
* 👥 **Team Collaboration** – Built-in support for group learning, discussions, and projects.
* 📊 **Analytics Dashboard** – User progress, skill mastery levels, and AI-powered recommendations.
* 🌐 **Multi-Service Backend** – ASP.NET Core for core APIs + FastAPI for LLM/AI tasks.

---

## 🛠️ Tech Stack

### Server (`/server`)

*   **Framework**: ASP.NET Core 9.0
*   **Language**: C#
*   **Database**: PostgreSQL with Entity Framework Core
*   **Authentication**: JWT Bearer Tokens
*   **File Storage**: Cloudinary for cloud-based media management
*   **Email**: MailKit for sending emails

### Brain (`/brain`)

*   **Framework**: FastAPI
*   **Language**: Python
*   **AI Models**:
    *   Google Generative AI (Gemini)
    *   Ollama for local LLMs
*   **Web Search**: DuckDuckGo Search
*   **Text-to-Speech**: edge-tts, piper-tts

### Client (`/client`)

*   **Framework**: React 19 with Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS with shadcn/ui components
*   **Animations**: Framer Motion and GSAP
*   **State Management**: React Hooks and Context API
*   **Routing**: React Router
*   **Data Fetching**: Axios

---

## 📂 Project Structure

```
.
├── brain/         # FastAPI microservice for AI tasks
├── client/        # React frontend application
├── server/        # ASP.NET Core backend
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

*   [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
*   [Python 3.10+](https://www.python.org/downloads/)
*   [Node.js](https://nodejs.org/) (v18+)
*   [PostgreSQL](https://www.postgresql.org/download/)
*   [Ollama](https://ollama.ai/) installed locally (for LLM inference)

---

### Setup

1.  **Clone the repo**

    ```bash
    git clone https://github.com/yourusername/skillistan.git
    cd skillistan
    ```

2.  **Server (.NET Core)**

    ```bash
    cd server
    dotnet restore
    # Update appsettings.Development.json with your database connection string
    dotnet ef database update
    dotnet run
    ```

    The server runs on `https://localhost:5001`.

3.  **Brain (Python FastAPI)**

    ```bash
    cd brain
    python -m venv venv
    source venv/bin/activate  # (Linux/macOS)
    venv\Scripts\activate     # (Windows)

    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
    ```

    The AI service runs on `http://localhost:8000`.

4.  **Client (React)**

    ```bash
    cd client
    npm install
    npm run dev
    ```

    The frontend runs on `http://localhost:3000`.

---

## 🛣️ Roadmap

*   ✅ Authentication & User Profiles
*   ✅ Gemini API & Ollama LLM Integration
*   ✅ FastAPI Microservice Setup
*   ⬜ AI-Powered Course Recommendations
*   ⬜ Team Collaboration Features
*   ⬜ Docker Compose for .NET + Python services
*   ⬜ CI/CD Pipeline & Cloud Deployment

---

## 🧑‍💻 Contributing

We welcome contributions from the community!

1.  Fork the repo
2.  Create a new branch (`feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add new feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Create a Pull Request
