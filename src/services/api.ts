// API service for communicating with the RL-based study planner backend
import { supabase } from '@/integrations/supabase/client';

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
  };
  q_learning_action?: number;
  complexity_level?: string;
}

export interface FeedbackRequest {
  rating: number;
  comment?: string;
  planData?: StudyPlanResponse & { complexity: number };
}

export const studyPlannerApi = {
  // Create a study plan using RL-based edge function
  createStudyPlan: async (data: StudyPlanRequest): Promise<StudyPlanResponse> => {
    console.log('Creating study plan with RL:', data);
    
    const { data: response, error } = await supabase.functions.invoke('study-plan', {
      body: {
        action: 'create_plan',
        subject: data.subject,
        topic: data.topic,
        complexity: data.complexity
      }
    });
    
    if (error) {
      console.error('Study plan API error:', error);
      throw new Error('Failed to create study plan');
    }
    
    console.log('Study plan response:', response);
    return response as StudyPlanResponse;
  },

  // Submit feedback to update Q-table (explicit RL feedback)
  submitFeedback: async (data: FeedbackRequest): Promise<{ success: boolean }> => {
    console.log('Submitting feedback:', data);
    
    const { data: response, error } = await supabase.functions.invoke('study-plan', {
      body: {
        action: 'submit_feedback',
        feedback: data.rating,
        planData: data.planData
      }
    });
    
    if (error) {
      console.error('Feedback API error:', error);
      throw new Error('Failed to submit feedback');
    }
    
    return { success: true };
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
