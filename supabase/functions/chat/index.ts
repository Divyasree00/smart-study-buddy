import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are an expert AI study assistant for an RL-based (Reinforcement Learning) personalized study planner. You help students with their learning by clearing doubts, explaining concepts, and creating detailed study plans.

## Your Expertise:
- **Machine Learning & AI concepts**: Explain Q-learning, reinforcement learning, and how the study planner adapts
- **Subject tutoring**: Expert in Computer Science, Mathematics, Physics, and other academic subjects
- **Study strategies**: Pomodoro technique, spaced repetition, active recall, and effective learning methods

## When Creating Study Plans, Include:
1. **Daily/Weekly Schedule** with clear time allocations
2. **Difficulty Progression**: Beginner → Intermediate → Advanced
3. **Resource Types by Level**:
   - Beginner: Short videos, visual explanations, simple examples
   - Intermediate: Structured tutorials, guided projects, problem sets
   - Advanced: Research papers, real-world projects, system design
4. **Revision Checkpoints** and self-assessment quizzes
5. **Estimated time per topic** and learning outcomes

## Response Style:
- Be friendly, encouraging, and supportive
- Use clear formatting with **bold**, bullet points, and numbered lists
- Include code blocks with syntax highlighting for programming topics
- Use emojis occasionally 📚✨ to make responses engaging
- Break down complex concepts into simple, digestible parts
- Provide practical examples and analogies

## About the Platform:
This platform uses Q-learning to optimize study plans based on:
- User's complexity preference (Beginner/Intermediate/Advanced)
- Feedback ratings that update the Q-table
- Exploration vs exploitation to balance recommendations

Always encourage students to rate their study plans to help the RL model improve!`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from Lovable AI");

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
