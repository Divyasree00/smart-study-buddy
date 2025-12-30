import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Q-learning parameters (same as Flask backend)
const alpha = 0.1;  // learning rate
const gamma = 0.9;  // discount factor
const epsilon = 0.1; // exploration rate

// In-memory Q-table (3 complexities x 3 study hours)
// In production, this should be persisted in a database
let qTable = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

// API Keys from the Flask backend
const YOUTUBE_API_KEY = 'AIzaSyBo0PClq0SYsBtVgeMi0D00EWhZDtGQ044';
const GOOGLE_API_KEY = 'AIzaSyCR_PZ1TCIS7mew_ch5EdT1DINRHc_pVHI';
const GOOGLE_CX = '60580f6883479465b';

// Q-learning: Choose action using epsilon-greedy policy
function chooseAction(state: number): number {
  if (Math.random() < epsilon) {
    // Exploration: random action (1, 2, or 3)
    return Math.floor(Math.random() * 3) + 1;
  } else {
    // Exploitation: best action from Q-table
    const stateActions = qTable[state];
    const maxIndex = stateActions.indexOf(Math.max(...stateActions));
    return maxIndex + 1;
  }
}

// Q-learning: Update Q-table
function updateQTable(state: number, action: number, reward: number, nextState: number): void {
  const predict = qTable[state][action - 1];
  const target = reward + gamma * Math.max(...qTable[nextState]);
  qTable[state][action - 1] = predict + alpha * (target - predict);
  console.log(`Q-table updated: state=${state}, action=${action}, reward=${reward}, new value=${qTable[state][action - 1]}`);
}

// Fetch YouTube resources using YouTube Data API v3
async function fetchYoutubeResources(subject: string, topic: string): Promise<Array<{title: string, url: string, thumbnail?: string}>> {
  try {
    const query = encodeURIComponent(`${subject} ${topic} tutorial`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=5&type=video&key=${YOUTUBE_API_KEY}`;
    
    console.log(`Fetching YouTube resources for: ${subject} ${topic}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`YouTube API error: ${response.status}`);
      return generateFallbackYoutubeResources(subject, topic);
    }
    
    const data = await response.json();
    const videos = data.items?.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.medium?.url
    })) || [];
    
    console.log(`Found ${videos.length} YouTube videos`);
    return videos.length > 0 ? videos : generateFallbackYoutubeResources(subject, topic);
  } catch (error) {
    console.error('YouTube API fetch error:', error);
    return generateFallbackYoutubeResources(subject, topic);
  }
}

// Fetch Google Custom Search resources
async function fetchGoogleResources(subject: string, topic: string): Promise<Array<{title: string, url: string, snippet?: string}>> {
  try {
    const query = encodeURIComponent(`${subject} ${topic} tutorial guide`);
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${GOOGLE_CX}&num=5&key=${GOOGLE_API_KEY}`;
    
    console.log(`Fetching Google resources for: ${subject} ${topic}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Google API error: ${response.status}`);
      return generateFallbackGoogleResources(subject, topic);
    }
    
    const data = await response.json();
    const resources = data.items?.map((item: any) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet
    })) || [];
    
    console.log(`Found ${resources.length} Google resources`);
    return resources.length > 0 ? resources : generateFallbackGoogleResources(subject, topic);
  } catch (error) {
    console.error('Google API fetch error:', error);
    return generateFallbackGoogleResources(subject, topic);
  }
}

// Fallback resources if API fails
function generateFallbackYoutubeResources(subject: string, topic: string) {
  return [
    { title: `${topic} - Complete Tutorial for Beginners`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' ' + topic + ' tutorial')}` },
    { title: `${topic} Crash Course`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' crash course')}` },
    { title: `Learn ${topic} Step by Step`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent('learn ' + topic + ' step by step')}` },
  ];
}

function generateFallbackGoogleResources(subject: string, topic: string) {
  return [
    { title: `${topic} - Official Documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' official documentation')}` },
    { title: `${topic} Tutorial - GeeksforGeeks`, url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' tutorial geeksforgeeks')}` },
    { title: `${topic} Best Practices`, url: `https://www.google.com/search?q=${encodeURIComponent(topic + ' best practices guide')}` },
  ];
}

// Generate difficulty-aware resource recommendations
function getDifficultyResources(complexity: number, topic: string): {
  resourceTypes: string[];
  estimatedTime: string;
  learningOutcome: string;
} {
  if (complexity === 1) {
    // Beginner
    return {
      resourceTypes: ['Short videos', 'Visual explanations', 'Simple examples', 'Intro articles'],
      estimatedTime: '15-30 mins per session',
      learningOutcome: 'Understand basic concepts and terminology'
    };
  } else if (complexity === 2) {
    // Intermediate
    return {
      resourceTypes: ['Structured tutorials', 'Medium-level problems', 'Guided projects', 'Case studies'],
      estimatedTime: '45-60 mins per session',
      learningOutcome: 'Apply concepts to solve practical problems'
    };
  } else {
    // Advanced
    return {
      resourceTypes: ['Research papers', 'Real-world projects', 'Competitive problems', 'System design'],
      estimatedTime: '60-90 mins per session',
      learningOutcome: 'Master complex implementations and optimization'
    };
  }
}

// Generate study schedule
function generateStudySchedule(studyHours: number, daysNeeded: number, topic: string, complexity: number): Array<{day: number, hours: number, focus: string, activities: string[]}> {
  const schedule = [];
  const hoursPerDay = Math.ceil(studyHours / daysNeeded);
  
  const focusAreas = complexity === 1 
    ? ['Fundamentals & Concepts', 'Basic Examples', 'Simple Practice', 'Review & Quiz']
    : complexity === 2
    ? ['Core Concepts Deep Dive', 'Practical Implementation', 'Problem Solving', 'Project Work', 'Review & Optimization']
    : ['Advanced Theory', 'Complex Problem Solving', 'System Design', 'Real-world Application', 'Optimization & Best Practices'];
  
  for (let i = 0; i < daysNeeded; i++) {
    const focusIndex = i % focusAreas.length;
    schedule.push({
      day: i + 1,
      hours: hoursPerDay,
      focus: focusAreas[focusIndex],
      activities: getActivitiesForDay(i, daysNeeded, complexity, topic)
    });
  }
  
  return schedule;
}

function getActivitiesForDay(dayIndex: number, totalDays: number, complexity: number, topic: string): string[] {
  if (dayIndex === 0) {
    return ['Introduction & Overview', 'Setup environment', 'Watch foundational videos'];
  } else if (dayIndex === totalDays - 1) {
    return ['Final practice problems', 'Review weak areas', 'Self-assessment quiz'];
  } else if (complexity === 1) {
    return ['Watch tutorial videos', 'Practice basic examples', 'Take notes'];
  } else if (complexity === 2) {
    return ['Hands-on coding exercises', 'Build mini projects', 'Solve medium problems'];
  } else {
    return ['Study advanced concepts', 'Solve challenging problems', 'Work on real project'];
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, subject, topic, complexity, feedback, planData } = await req.json();
    
    console.log(`Received request: action=${action}, subject=${subject}, topic=${topic}, complexity=${complexity}`);
    
    if (action === 'create_plan') {
      // Validate inputs
      if (!subject || !topic || !complexity) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: subject, topic, complexity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const complexityNum = parseInt(complexity);
      const state = complexityNum - 1; // Map complexity to state (0-indexed)
      
      // Q-learning: Choose optimal action (study hours)
      const studyHoursAction = chooseAction(state);
      
      // Calculate study hours based on complexity and RL decision
      // Base hours + RL action modifier
      const baseHours = complexityNum * 2;
      const studyHours = baseHours + studyHoursAction;
      
      // Simulate reward for Q-table update (will be refined by feedback)
      const reward = Math.random() > 0.5 ? 1 : -1;
      const nextState = Math.floor(Math.random() * 3);
      updateQTable(state, studyHoursAction, reward, nextState);
      
      // Fetch real resources from APIs
      const [youtubeResources, googleResources] = await Promise.all([
        fetchYoutubeResources(subject, topic),
        fetchGoogleResources(subject, topic)
      ]);
      
      // Calculate days needed (2 hours per day as in Flask backend)
      const hoursPerDay = 2;
      const daysNeeded = Math.ceil(studyHours / hoursPerDay);
      
      // Get difficulty-aware recommendations
      const difficultyInfo = getDifficultyResources(complexityNum, topic);
      
      // Generate study schedule
      const studySchedule = generateStudySchedule(studyHours, daysNeeded, topic, complexityNum);
      
      const response = {
        study_hours: studyHours,
        days_needed: daysNeeded,
        youtube_resources: youtubeResources,
        google_resources: googleResources,
        study_schedule: studySchedule,
        difficulty_info: difficultyInfo,
        q_learning_action: studyHoursAction,
        complexity_level: complexityNum === 1 ? 'Beginner' : complexityNum === 2 ? 'Intermediate' : 'Advanced'
      };
      
      console.log(`Generated study plan: ${studyHours} hours over ${daysNeeded} days`);
      
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (action === 'submit_feedback') {
      // Handle feedback to update Q-table (explicit RL feedback)
      if (!feedback || !planData) {
        return new Response(
          JSON.stringify({ error: 'Missing feedback or plan data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const state = planData.complexity - 1;
      const actionTaken = planData.q_learning_action || 1;
      
      // Convert feedback to reward (same logic as Flask backend)
      let reward: number;
      if (feedback >= 4) {
        reward = 1;  // Positive feedback
      } else if (feedback <= 2) {
        reward = -1; // Negative feedback
      } else {
        reward = 0;  // Neutral
      }
      
      const nextState = Math.floor(Math.random() * 3);
      updateQTable(state, actionTaken, reward, nextState);
      
      console.log(`Feedback processed: rating=${feedback}, reward=${reward}`);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Feedback recorded and Q-table updated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
