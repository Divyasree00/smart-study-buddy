// API service for communicating with the Flask backend
// Replace BASE_URL with your Flask backend URL when deploying

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface StudyPlanRequest {
  subject: string;
  topic: string;
  complexity: number;
}

export interface StudyPlanResponse {
  study_hours: number;
  days_needed: number;
  youtube_resources: Array<{
    title: string;
    url: string;
  }>;
  google_resources: Array<{
    title: string;
    url: string;
  }>;
  study_schedule: Array<{
    day: number;
    hours: number;
    focus: string;
  }>;
}

export interface FeedbackRequest {
  rating: number;
  comment?: string;
}

export const studyPlannerApi = {
  // Create a study plan
  createStudyPlan: async (data: StudyPlanRequest): Promise<StudyPlanResponse> => {
    // For demo purposes, return mock data
    // Replace with actual API call when connecting to Flask backend
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    const mockResponse: StudyPlanResponse = {
      study_hours: Math.ceil(data.complexity * 2.5),
      days_needed: Math.ceil(data.complexity * 1.5),
      youtube_resources: [
        { title: `${data.topic} - Complete Tutorial`, url: 'https://youtube.com' },
        { title: `${data.topic} for Beginners`, url: 'https://youtube.com' },
        { title: `Advanced ${data.topic} Concepts`, url: 'https://youtube.com' },
      ],
      google_resources: [
        { title: `${data.topic} Documentation`, url: 'https://google.com' },
        { title: `${data.topic} Best Practices`, url: 'https://google.com' },
        { title: `${data.topic} Cheat Sheet`, url: 'https://google.com' },
      ],
      study_schedule: Array.from({ length: Math.ceil(data.complexity * 1.5) }, (_, i) => ({
        day: i + 1,
        hours: Math.ceil(data.complexity * 2.5 / Math.ceil(data.complexity * 1.5)),
        focus: i === 0 ? 'Fundamentals' : i === Math.ceil(data.complexity * 1.5) - 1 ? 'Practice & Review' : 'Deep Dive',
      })),
    };
    
    return mockResponse;
    
    // Uncomment for actual API call:
    // const response = await fetch(`${BASE_URL}/api/study-plan`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Failed to create study plan');
    // return response.json();
  },

  // Submit feedback
  submitFeedback: async (data: FeedbackRequest): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
    
    // Uncomment for actual API call:
    // const response = await fetch(`${BASE_URL}/api/feedback`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Failed to submit feedback');
    // return response.json();
  },
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatApi = {
  // Send message to AI chatbot
  sendMessage: async (messages: ChatMessage[]): Promise<string> => {
    // Mock AI response for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
