# 🎓 AI Study Planner

A smart study planning web application that creates personalized learning paths using reinforcement learning algorithms.

🔗 **Live Demo:** https://divyasree00.github.io/smart-study-buddy/

---

## ✨ Features

### 📚 Personalized Study Plans
- Enter any topic you want to learn (e.g., "JavaScript", "Machine Learning", "Photography")
- Select your skill level: Beginner, Intermediate, or Advanced
- Get a structured day-by-day study schedule

### 🎯 Smart Resource Recommendations
- **YouTube Videos** - Curated video links matched to your difficulty level
- **Articles & Documentation** - Google search links for reading materials
- **Level-Appropriate Content** - Resources adjust based on your selected complexity

### 🤖 Reinforcement Learning Engine
The app uses a Q-learning algorithm to improve recommendations:
- **State**: Your selected topic + difficulty level
- **Actions**: Different teaching approaches (visual, practical, theoretical, mixed)
- **Rewards**: Based on your feedback (approve/reject plans)
- **Learning**: The Q-table updates over time to prefer better strategies

### 🔄 Iterative Refinement
- Generate a study plan
- Don't like it? Click "Generate New" to get a different approach
- Approve plans you like - this trains the algorithm
- The more you use it, the better it gets at matching your preferences

### 💬 AI Chatbot (Optional)
- Floating chat interface for study questions
- Context-aware responses about learning and study techniques

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| React Router | Navigation |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Chatbot.tsx     # AI chat interface
│   ├── Navbar.tsx      # Navigation bar
│   └── StudyCard.tsx   # Study plan display cards
├── pages/
│   ├── Home.tsx        # Landing page
│   ├── StudyPlan.tsx   # Main study planner page
│   └── Feedback.tsx    # User feedback page
├── hooks/
│   └── useRLEngine.ts  # Reinforcement learning logic
├── services/
│   └── api.ts          # Study plan generation logic
└── index.css           # Global styles & design tokens
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-study-planner.git

# Navigate to project folder
cd ai-study-planner

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📖 How It Works

### 1. User Input
User enters a subject, topic, and selects difficulty (Beginner/Intermediate/Advanced).

### 2. RL Action Selection
The reinforcement learning engine selects an action based on the current Q-table:
- `visual_focus` - Emphasizes video content
- `practice_heavy` - Focuses on hands-on exercises
- `theory_first` - Starts with conceptual understanding
- `mixed_approach` - Balanced combination

### 3. Plan Generation
Based on the selected action, the system generates:
- A 5-7 day study schedule
- YouTube search links for videos
- Google search links for articles
- Daily goals and activities

### 4. User Feedback Loop
- **Approve**: Positive reward (+1) updates Q-table
- **Generate New**: Negative reward (-1) updates Q-table
- This epsilon-greedy learning improves future recommendations

---

## 🎨 Design System

The app uses a consistent design system with:
- HSL-based color tokens for theming
- Dark/light mode support via CSS variables
- Responsive layouts for mobile and desktop
- Accessible UI components from shadcn/ui

---

## 📄 License

MIT License - feel free to use this project for learning or building your own study tools!
