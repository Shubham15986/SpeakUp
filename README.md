<div align="center">
  <img src="https://raw.githubusercontent.com/Shubham15986/SpeakUp/main/frontend/public/vite.svg" alt="SpeakUp Logo" width="120" />

  # 🗣️ SpeakUp

  **Your Personal AI-Powered Language Coach & Professional Vocabulary Builder**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
  [![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

  *Speak with confidence. Write with precision. Expand your vocabulary instantly.*
</div>

---

## 🌟 Overview

**SpeakUp** is a full-stack, AI-driven web application designed to dramatically improve your English communication skills. Whether you are preparing for a professional interview, writing academic papers, or simply trying to expand your daily vocabulary, SpeakUp acts as your personal linguistic coach.

By leveraging **Google Gemini AI** for deep linguistic analysis and the **Free Dictionary API** for on-demand phonetics and audio pronunciations, SpeakUp provides a seamless, immersive learning experience.

## ✨ Key Features

- **🧠 Deep AI Analysis**: Paste your text and receive instant, AI-generated insights on tone, grammar, and vocabulary gaps using Google Gemini.
- **📚 Massive Global Dictionary**: Pre-loaded with the Top 5,000 most common English words (COCA), the complete Academic Word List (AWL), and highly curated professional idioms and transition phrases.
- **⚡ On-Demand Enrichment**: Discover a word you don't know? SpeakUp dynamically fetches definitions, example sentences, phonetic spellings, and native audio pronunciations in real-time.
- **🔖 Personal Word Bank**: Save your favorite idioms, power words, and custom vocabulary to your personal dashboard for future review.
- **📅 Word of the Day**: A dynamic, daily cron-job that serves up a new, curated word every morning to keep you learning.

## 🏗️ Architecture & Tech Stack

SpeakUp is built for speed, scalability, and zero-cost cloud deployment.

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS (Modern, glassmorphic design system)
- **Hosting**: AWS Amplify (Global CDN, Auto-deploying)

### Backend
- **Environment**: Node.js & Express
- **Language**: TypeScript
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma
- **Hosting**: AWS EC2 (`t2.micro` running Ubuntu & PM2)

## 🚀 Getting Started Locally

Want to run SpeakUp on your own machine? Follow these simple steps:

### 1. Clone the Repository
```bash
git clone https://github.com/Shubham15986/SpeakUp.git
cd SpeakUp
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with your API keys:
```env
PORT=5001
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.your-supabase-url.co:5432/postgres"
SUPABASE_JWT_SECRET="your-supabase-jwt-secret"
GEMINI_API_KEY="your-google-gemini-key"
```
Run the server:
```bash
npx prisma generate
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_SUPABASE_URL="https://your-supabase-url.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```
Start the Vite dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

## ☁️ AWS Cloud Deployment

SpeakUp is engineered to run entirely on the **AWS Free Tier**:
1. **Frontend**: Pushed to **AWS Amplify** for automatic CI/CD from GitHub.
2. **Backend**: Hosted on an **AWS EC2 Ubuntu Instance**, managed by `pm2` for 24/7 uptime, and securely proxied via an AWS API Gateway.

---

<div align="center">
  <i>Built with ❤️ for better communication.</i>
</div>
