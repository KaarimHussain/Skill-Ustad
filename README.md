# Skill-Ustad

---

## 🚀 Overview

Skill Ustad is an AI-powered skill-learning platform built using **ASP.NET Core (API)** and **React (Frontend)**. It targets **students aged 12–25**, aiming to bridge skill gaps through personalized, interactive, and community-driven learning experiences.

---

## 🎯 Core Project Goals

- Teach in-demand skills (coding, design, soft skills, etc.)
- Use AI to personalize the experience and assist in learning
- Allow content creation, feedback, and progress tracking
- Provide smooth file and image handling
- Ensure modern UI/UX with real-time capabilities

---

## 🔑 Phase 1 MVP Features (Already Discussed)

### 1. Skill-Based Course Modules

- Categorized courses by skill type
- Step-by-step lessons with quizzes and content

### 2. AI Tutor (via Gemini API)

- AI chatbot for Q&A, explanations, and learning tips
- Real-time problem-solving support

### 3. File & Image Uploads

- Submit assignments, notes, and documents
- Upload images and voice messages (audio feature added)

### 4. Admin Dashboard

- View platform stats
- Manage users, content, reports, and feedback

### 5. Voice Support

- Upload/playback voice messages
- Optional voice-to-text transcription (future)

### 6. User Roles & Auth

- JWT or Identity-based authentication
- Roles for students, mentors, and admins

### 7. Resume Builder

- Auto-generate skill-based resumes
- Downloadable PDF with templates

### 8. Progress Tracking (Charts)

- Visual feedback of course progress
- Use of Chart.js or D3.js for analytics

### 9. Help Center

- User FAQs
- AI-integrated help assistant

### 10. Mentor Marketplace (Optional)

- Mentors can register and offer premium/private sessions

---

## 🔥 Recent Innovative Feature Ideas

These features were designed to be **AI-focused**, **UX/UI-enhanced**, and **market-relevant** while still blending into the current stack.

### 1. **AI-Powered Personalized Learning Paths**

- Dynamically adapt course roadmap based on user behavior & quiz scores
- Recommend next topics using AI logic
- Built using machine learning + React dashboards

### 3. **Social Gamification & Collaboration**

- Leaderboards, team quests, and live coding challenges
- Social chat rooms and peer learning features
- Built with SignalR + React for real-time sync

### 4. **AI Instant Feedback & Tutor Chatbot**

- Chat interface for every lesson or quiz
- Real-time explanations, corrections, and feedback
- Gemini API-powered backend with React chat UI

### 5. **Peer-Created Content System**

- Let users build quizzes, mini-lessons, or tutorials
- AI support to help generate content or provide feedback
- Upvote, comment, and reuse community content

---

## ✨ Additional Add-ons That Fit Seamlessly

### ✅ Smart Notifications & Reminders

- Alert users about due assignments or live sessions
- Real-time or scheduled push notifications

### ✅ Third-Party Integration Support

- Zoom, GitHub, and payment processors like Stripe or PayPal

### ✅ PWA & Mobile-first Responsive Design

- Offline mode support for lessons
- Seamless mobile UX with installable PWA

### ✅ Dark Mode & Accessibility Options

- Toggle between light/dark UI
- Screen reader labels & font resizing

### ✅ Scheduling System

- Book slots with mentors
- Calendar view of sessions & events

---

## 🧠 Tech Stack Overview

- **Frontend:** React (with Tailwind CSS)
- **Backend:** ASP.NET Core Web API
- **Libraries:** shadcn/ui, Chart.js, WebGL
- **AI:** Gemini API, ML model integrations (if needed)
- **Database:** PostgreSQL
- **Auth:** JWT or Identity, Google Auth
- **Real-time:** SignalR

# ============================================================
## Dev Guide Overview
# ============================================================


Folder Structure:

Skill-Ustad
├───README.md
├──Brain
│   ├───venv
│   ├───main.py - Entry Point
├──Server - ASP .NET Core API
├──Client - Frontend React + Vite

so there are actually 2 servers as part of backend

1) .NET Web API - Primary Database - For Data processing
2) Python FastAPI - For TTS

**How to run the backend & frontend servers**

1) Python - Redirects to brain folder
   1) cd ./brain && python main.py
2) .NET - Redirects to server folder
   1) cd ./server && dotnet watch run
3) React - Redirects to client folder
   1) cd ./client && npm run dev