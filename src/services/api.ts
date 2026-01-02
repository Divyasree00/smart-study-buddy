// Client-side study plan generator with in-browser RL
// No backend, no APIs, no persistence - runs entirely in the browser

import {
  chooseAction,
  updateQTable,
  getActionLabel,
  getStudyHoursByAction,
  getDaysByAction,
} from '@/hooks/useRLEngine';

export interface StudyPlanRequest {
  subject: string;
  topic: string;
  complexity: number; // 1=Beginner, 2=Intermediate, 3=Advanced
}

export interface StudyPlanResponse {
  study_hours: number;
  days_needed: number;
  youtube_resources: Array<{
    title: string;
    url: string;
    thumbnail?: string;
  }>;
  google_resources: Array<{
    title: string;
    url: string;
    snippet?: string;
  }>;
  study_schedule: Array<{
    day: number;
    hours: number;
    focus: string;
    activities?: string[];
  }>;
  difficulty_info?: {
    resourceTypes: string[];
    estimatedTime: string;
    learningOutcome: string;
    intensity: string;
  };
  rl_action: number;
  complexity_level: string;
}

// Generate YouTube-style resource links based on topic
const generateYoutubeResources = (subject: string, topic: string) => {
  const searchQuery = encodeURIComponent(`${subject} ${topic} tutorial`);
  return [
    {
      title: `${topic} - Complete Beginner Tutorial`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+beginner`,
    },
    {
      title: `${topic} Crash Course`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+crash+course`,
    },
    {
      title: `Advanced ${topic} Concepts`,
      url: `https://www.youtube.com/results?search_query=${searchQuery}+advanced`,
    },
  ];
};

// Generate Google search links based on topic
const generateGoogleResources = (subject: string, topic: string) => {
  const searchQuery = encodeURIComponent(`${subject} ${topic}`);
  return [
    {
      title: `${topic} Documentation & Guides`,
      url: `https://www.google.com/search?q=${searchQuery}+documentation`,
    },
    {
      title: `${topic} Practice Exercises`,
      url: `https://www.google.com/search?q=${searchQuery}+practice+exercises`,
    },
    {
      title: `${topic} Cheat Sheet`,
      url: `https://www.google.com/search?q=${searchQuery}+cheat+sheet`,
    },
  ];
};

// Get difficulty-based info
const getDifficultyInfo = (complexity: number, action: number) => {
  const intensityLabel = getActionLabel(action);
  
  const resourceTypes: Record<number, string[]> = {
    1: ['Video tutorials', 'Interactive exercises', 'Beginner guides'],
    2: ['Documentation', 'Practice problems', 'Code examples'],
    3: ['Research papers', 'Advanced tutorials', 'Real-world projects'],
  };

  const estimatedTimes: Record<number, string> = {
    0: '30-45 minutes per session',
    1: '45-60 minutes per session',
    2: '60-90 minutes per session',
  };

  const learningOutcomes: Record<number, string> = {
    1: 'Solid foundational understanding',
    2: 'Practical application skills',
    3: 'Expert-level mastery',
  };

  return {
    resourceTypes: resourceTypes[complexity] || resourceTypes[2],
    estimatedTime: estimatedTimes[action] || estimatedTimes[1],
    learningOutcome: learningOutcomes[complexity] || learningOutcomes[2],
    intensity: intensityLabel,
  };
};

// Generate study schedule based on RL action
const generateStudySchedule = (
  studyHours: number,
  daysNeeded: number,
  topic: string,
  action: number
) => {
  const schedule = [];
  const hoursPerDay = Math.ceil(studyHours / daysNeeded);
  
  const focusAreas = [
    'Introduction & Fundamentals',
    'Core Concepts Deep Dive',
    'Practical Applications',
    'Advanced Topics',
    'Review & Practice',
    'Project Work',
    'Final Review & Assessment',
  ];

  const activitiesByAction: Record<number, string[][]> = {
    0: [ // Easy
      ['Watch introductory videos', 'Take notes'],
      ['Read documentation', 'Simple exercises'],
      ['Practice examples', 'Review notes'],
      ['Light coding practice', 'Concept review'],
      ['Quiz yourself', 'Summarize learnings'],
      ['Mini project', 'Explore resources'],
      ['Final review', 'Celebrate progress'],
    ],
    1: [ // Balanced
      ['Video tutorials', 'Note-taking', 'Initial exercises'],
      ['Deep dive reading', 'Hands-on practice'],
      ['Build small projects', 'Debug exercises'],
      ['Advanced tutorials', 'Code challenges'],
      ['Practice problems', 'Peer discussion'],
      ['Project implementation', 'Documentation'],
      ['Comprehensive review', 'Self-assessment'],
    ],
    2: [ // Intensive
      ['Immersive video study', 'Active coding', 'Documentation dive'],
      ['Complex problem solving', 'Algorithm practice'],
      ['Real-world project work', 'Code review'],
      ['Advanced concepts', 'Performance optimization'],
      ['Timed challenges', 'Mock assessments'],
      ['Full project development', 'Testing & debugging'],
      ['Final project polish', 'Knowledge consolidation'],
    ],
  };

  for (let day = 1; day <= daysNeeded; day++) {
    const focusIndex = Math.min(day - 1, focusAreas.length - 1);
    const activities = activitiesByAction[action]?.[focusIndex] || activitiesByAction[1][focusIndex];
    
    schedule.push({
      day,
      hours: day === daysNeeded ? studyHours - hoursPerDay * (daysNeeded - 1) : hoursPerDay,
      focus: `${focusAreas[focusIndex]} - ${topic}`,
      activities: Array.isArray(activities) ? activities : [activities],
    });
  }

  return schedule;
};

// Complexity labels
const getComplexityLabel = (complexity: number): string => {
  const labels: Record<number, string> = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
  };
  return labels[complexity] || 'Intermediate';
};

export const studyPlannerApi = {
  // Create a study plan using in-browser RL
  createStudyPlan: async (data: StudyPlanRequest): Promise<StudyPlanResponse> => {
    console.log('Creating study plan with in-browser RL:', data);
    
    // Small delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Use RL to choose action (intensity)
    const action = chooseAction({ complexity: data.complexity });
    console.log(`RL chose action: ${action} (${getActionLabel(action)})`);

    // Calculate hours and days based on RL action
    const studyHours = getStudyHoursByAction(action, data.complexity);
    const daysNeeded = getDaysByAction(action, data.complexity);

    // Generate resources
    const youtubeResources = generateYoutubeResources(data.subject, data.topic);
    const googleResources = generateGoogleResources(data.subject, data.topic);

    // Generate schedule
    const studySchedule = generateStudySchedule(
      studyHours,
      daysNeeded,
      data.topic,
      action
    );

    // Get difficulty info
    const difficultyInfo = getDifficultyInfo(data.complexity, action);

    return {
      study_hours: studyHours,
      days_needed: daysNeeded,
      youtube_resources: youtubeResources,
      google_resources: googleResources,
      study_schedule: studySchedule,
      difficulty_info: difficultyInfo,
      rl_action: action,
      complexity_level: getComplexityLabel(data.complexity),
    };
  },

  // Submit feedback to update Q-table
  submitFeedback: (
    complexity: number,
    action: number,
    approved: boolean
  ): void => {
    const reward = approved ? 1 : -1;
    updateQTable({ complexity }, action, reward);
    console.log(`Feedback submitted: ${approved ? 'Approved (+1)' : 'Rejected (-1)'}`);
  },
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatApi = {
  // Send message to AI chatbot (client-side mock)
  sendMessage: async (messages: ChatMessage[]): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    if (lastMessage.includes('study plan') || lastMessage.includes('schedule')) {
      return `Here's a personalized study plan based on your request:

**📚 Recommended Study Approach:**

1. **Day 1-2: Foundation Building**
   - Start with basic concepts and terminology
   - Watch introductory videos (30-45 mins)
   - Take notes and create mind maps

2. **Day 3-4: Deep Dive**
   - Explore advanced concepts
   - Practice with examples
   - Complete exercises

3. **Day 5: Review & Practice**
   - Solve practice problems
   - Review weak areas
   - Create summary notes

**💡 Pro Tips:**
- Study in 25-minute focused sessions (Pomodoro)
- Take breaks every hour
- Practice active recall

Would you like me to elaborate on any specific part?`;
    }

    if (lastMessage.includes('python') || lastMessage.includes('list')) {
      return `Great question about Python! Here's what you need to know:

**🐍 Python Lists Explained:**

Lists are ordered, mutable collections that can hold items of different types.

\`\`\`python
# Creating a list
my_list = [1, 2, 3, "hello", True]

# Common operations
my_list.append(4)      # Add item
my_list.remove(2)      # Remove item
my_list[0]             # Access by index
len(my_list)           # Get length
\`\`\`

**Key Methods:**
- \`append()\` - Add to end
- \`insert()\` - Add at position
- \`pop()\` - Remove and return
- \`sort()\` - Sort in place

Need me to explain any of these in more detail?`;
    }

    return `I'd be happy to help you with your studies! 📚

Here are some things I can assist with:
- **Study Plans**: Ask me to create a detailed study plan for any topic
- **Concept Explanations**: I can break down complex topics into simple terms
- **Learning Tips**: Get personalized advice for effective studying
- **Resource Suggestions**: I can recommend learning materials

What would you like to learn about today?`;
  },
};
