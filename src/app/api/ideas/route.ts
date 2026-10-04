import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Basic in-memory rate limiting (per cold start)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

const FALLBACK_IDEAS = {
  "CSE/IT": [
    { title: "AI Code Review Assistant", description: "Automated GitHub PR reviewer that suggests optimizations." },
    { title: "Smart Study Planner", description: "Creates dynamic learning schedules based on syllabus." },
    { title: "Fake News Detector", description: "Browser extension that scores article credibility." }
  ],
  "ECE": [
    { title: "IoT Predictive Maintenance", description: "AI that predicts when hardware sensors will fail." },
    { title: "Smart Traffic Controller", description: "Optimizes light timings using camera feeds." },
    { title: "Voice-Controlled Drone", description: "Use NLP to issue flight commands." }
  ],
  "Mechanical": [
    { title: "Defect Detection Vision System", description: "Identifies manufacturing flaws on a conveyor belt." },
    { title: "HVAC Energy Optimizer", description: "Learns thermal patterns to reduce AC power usage." },
    { title: "AI CAD Generative Design", description: "Suggests optimal structural designs." }
  ],
  "default": [
    { title: "Personal Finance Categorizer", description: "Automatically tags spending using LLMs." },
    { title: "Resume AI Tailor", description: "Modifies your resume to match job descriptions." },
    { title: "Meeting Summarizer", description: "Transcribes and extracts action items." }
  ]
};

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const limitWindow = 60000; // 1 minute
    const maxRequests = 5;

    const userLimit = rateLimitMap.get(ip);
    if (userLimit && now < userLimit.resetTime) {
      if (userLimit.count >= maxRequests) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      userLimit.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    }

    const { branch, interest } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No API key, using fallback");
      return NextResponse.json({ 
        ideas: FALLBACK_IDEAS[branch as keyof typeof FALLBACK_IDEAS] || FALLBACK_IDEAS.default 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an AI mentor for a final-year engineering student.
    The student is in the ${branch} branch and is interested in ${interest}.
    Provide EXACTLY 3 beginner-friendly AI project ideas they could build in a 60-minute workshop.
    Return the result strictly as a JSON array of objects.
    Each object must have exactly two keys: "title" (string, max 5 words) and "description" (string, max 12 words).
    Do not use markdown formatting like \`\`\`json in the response, just the raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");

    const ideas = JSON.parse(text);
    return NextResponse.json({ ideas });

  } catch (error) {
    console.error("AI API Error:", error);
    // Static Fallback
    return NextResponse.json({ 
      ideas: FALLBACK_IDEAS.default 
    });
  }
}
