# Skillistan 🎓✨

**AI-powered skill learning platform** built with **ASP.NET Core**, **FastAPI (Python)**, and **modern frontend frameworks**, enhanced with **AI models like Gemini and Ollama**.

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

### Backend (Core APIs & Logic)

* **ASP.NET Core 8.0** – Authentication, course management, REST APIs
* **C#** – Core backend language
* **Entity Framework Core** – ORM for database interactions
* **SQL Server** (preferred) or MySQL – Relational database

### AI & Python Services

* **FastAPI** – Python microservice for AI/LLM workflows
* **Ollama LLM** – Local/hosted large language models for custom AI use cases
* **Google Gemini API** – Cloud-based AI assistant integration
* **LangChain (optional)** – For chaining AI tasks and workflows

### Frontend

* **React.js** (recommended) – Modern UI with hooks & state management
* **Tailwind CSS** – Utility-first CSS framework for styling
* **TypeScript** – For type safety and scalability

### DevOps & Tools

* **GitHub / Git** – Version control
* **Docker** (future scope) – Containerization of .NET + FastAPI services
* **Azure / AWS** (optional) – Deployment and scaling

---

## 📂 Project Structure (Proposed)

```
Skillistan/
│── backend-dotnet/             # ASP.NET Core solution
│   ├── Skillistan.API/          # Controllers, models, services
│   ├── Skillistan.Data/         # EF Core & migrations
│   ├── Skillistan.Tests/        # Unit & integration tests
│
│── backend-python/              # Python services
│   ├── app/                     # FastAPI routes & services
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── ai/                  # Ollama & Gemini integration
│   │   ├── models/              # Pydantic models
│   ├── requirements.txt
│
│── frontend/                    # React/Tailwind app
│   ├── public/                  # Static assets
│   ├── src/                     # Components, pages, hooks
│   ├── package.json
│
│── docs/                        # Documentation (API specs, guides)
│── .gitignore
│── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js](https://nodejs.org/) (v18+)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
* [Ollama](https://ollama.ai/) installed locally (for LLM inference)

---

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/skillistan.git
   cd skillistan
   ```

2. **Backend (.NET Core)**

   ```bash
   cd backend-dotnet/Skillistan.API
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

   Runs on `https://localhost:5001`.

3. **Backend (Python FastAPI)**

   ```bash
   cd backend-python
   python -m venv venv
   source venv/bin/activate  # (Linux/macOS)
   venv\Scripts\activate     # (Windows)

   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

   Runs on `http://localhost:8000`.

4. **Frontend (React)**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Runs on `http://localhost:3000`.

---

## 🔗 API Examples

### Call Gemini API (Python FastAPI)

```python
from fastapi import APIRouter
from app.ai.gemini import ask_gemini

router = APIRouter()

@router.post("/ask-gemini")
async def ask_gemini_route(question: str):
    response = await ask_gemini(question)
    return {"answer": response}
```

### Call Ollama LLM

```python
import requests

def query_ollama(prompt: str):
    response = requests.post("http://localhost:11434/api/generate", json={"model": "llama2", "prompt": prompt})
    return response.json()["response"]
```

---

## 🛣️ Roadmap

* ✅ Authentication & User Profiles
* ✅ Gemini API & Ollama LLM Integration
* ✅ FastAPI Microservice Setup
* ⬜ AI-Powered Course Recommendations
* ⬜ Team Collaboration Features
* ⬜ Docker Compose for .NET + Python services
* ⬜ CI/CD Pipeline & Cloud Deployment

---

## 🧑‍💻 Contributing

We welcome contributions from the community!

1. Fork the repo
2. Create a new branch (`feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙌 Acknowledgements

* [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet)
* [FastAPI](https://fastapi.tiangolo.com/)
* [Ollama](https://ollama.ai/)
* [React](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Google Gemini API](https://ai.google/)

---

⚡ This makes it clear that Skillistan runs on **.NET + Python hybrid backend**, with **AI (Gemini + Ollama)** powering the learning experience.

Want me to also add a **high-level architecture diagram (mermaid.js inside README)** so contributors can instantly “see” how .NET, FastAPI, Ollama, and frontend connect?
