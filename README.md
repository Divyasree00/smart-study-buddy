# 🎓 AI Study Planner

An intelligent, adaptive study planning system powered by Reinforcement Learning that creates personalized learning paths based on your progress, performance, and feedback.

## ✨ Features

- **RL-Powered Study Plans** - Q-Learning algorithm adapts recommendations based on your performance
- **Difficulty-Aware Resources** - Curated YouTube videos and articles matched to your skill level
- **Smart Scheduling** - Daily study schedules with specific activities and focus areas
- **AI Chatbot** - Get instant help with study questions and explanations
- **Feedback Loop** - Your feedback directly improves future recommendations

## 🧠 How It Works

### Reinforcement Learning Engine

The system uses Q-Learning with the following parameters:
- **Alpha (α)**: 0.1 - Learning rate
- **Gamma (γ)**: 0.9 - Discount factor for future rewards
- **Epsilon (ε)**: 0.1 - Exploration rate

### State-Action Model

| Complexity Level | Recommended Study Hours |
|------------------|------------------------|
| Beginner (1)     | 1-2 hours/day         |
| Intermediate (2) | 2-3 hours/day         |
| Advanced (3)     | 3-4 hours/day         |

### Reward System

| Action                    | Reward |
|---------------------------|--------|
| Topic completed           | +10    |
| Quiz score > 80%          | +8     |
| High confidence reported  | +5     |
| Topic abandoned           | -5     |
| Repeated failure          | -10    |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase Edge Functions (Deno)
- **AI**: Lovable AI API
- **APIs**: YouTube Data API, Google Custom Search API

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx       # AI chat assistant
│   │   ├── Navbar.tsx        # Navigation component
│   │   └── StudyCard.tsx     # Study plan display card
│   ├── pages/
│   │   ├── Home.tsx          # Landing page
│   │   ├── StudyPlan.tsx     # Plan generation page
│   │   └── Feedback.tsx      # User feedback page
│   └── services/
│       └── api.ts            # API service layer
├── supabase/
│   └── functions/
│       ├── chat/             # AI chatbot endpoint
│       └── study-plan/       # RL study planner endpoint
└── public/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd ai-study-planner

# Install dependencies
npm install

# Start development server
npm run dev
```


## 📖 Usage

1. **Create a Study Plan**
   - Enter your subject and topic
   - Select your complexity level (Beginner/Intermediate/Advanced)
   - Click "Generate Study Plan"

2. **Review Your Plan**
   - View recommended study hours
   - Access curated YouTube videos and articles
   - Follow the daily study schedule

3. **Provide Feedback**
   - Rate your satisfaction (1-5)
   - Share what went well
   - Report any challenges
   - Your feedback trains the RL model

4. **Chat with AI**
   - Ask study-related questions
   - Get explanations on topics
   - Request custom study advice



## 🎨 Design System

The app uses a custom design system with:
- Semantic color tokens (HSL-based)
- Responsive layouts
- Smooth animations
- Dark/light mode support

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ 
