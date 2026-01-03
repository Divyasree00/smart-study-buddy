# 🎓 AI Study Planner

A smart study planning app that creates personalized learning paths based on your goals and skill level.

## ✨ What It Does

- **Personalized Study Plans** - Get custom study schedules based on your topic and skill level
- **Smart Recommendations** - Curated YouTube videos and articles matched to your level
- **AI Chatbot** - Ask questions and get instant help with your studies
- **Adaptive Learning** - The app learns from your feedback to improve recommendations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 How to Use

1. **Go to Study Plan** - Click "Get Started" on the home page
2. **Enter Your Topic** - Type what you want to learn (e.g., "JavaScript basics")
3. **Select Difficulty** - Choose Beginner, Intermediate, or Advanced
4. **Generate Plan** - Click the button to create your personalized plan
5. **Use the Chatbot** - Click the chat icon (bottom-right) to ask questions

## 🛠️ Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Lovable Cloud (backend + AI)

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Main app pages
├── hooks/          # Custom React hooks
└── services/       # API and business logic

supabase/
└── functions/      # Backend edge functions
```

## ⚠️ Important Notes

- **Chatbot requires Lovable Cloud** - The AI chatbot only works when deployed on Lovable or with proper environment variables configured
- **No account needed** - The app works without login (data resets on refresh)

## 📄 License

MIT License
