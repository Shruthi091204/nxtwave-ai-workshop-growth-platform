import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { title, url, description } = await req.json();

    let fetchedContext = '';
    // Attempt to fetch URL (Basic implementation)
    try {
      if (url.includes('github.com')) {
        // Fetch README if possible
        const rawUrl = url.replace('github.com', 'raw.githubusercontent.com') + '/main/README.md';
        const res = await fetch(rawUrl, { signal: AbortSignal.timeout(3000) });
        if (res.ok) fetchedContext = await res.text();
      } else {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const html = await res.text();
          const titleMatch = html.match(/<title>(.*?)<\/title>/i);
          if (titleMatch) fetchedContext = `Page Title: ${titleMatch[1]}`;
        }
      }
    } catch (e) {
      console.warn("Could not fetch URL:", url);
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mock score if no AI
      const total = Math.floor(Math.random() * 30) + 60; // 60-90
      return NextResponse.json({
        score: {
          idea: 15,
          working_demo: 20,
          use_of_AI: 20,
          UI_quality: 10,
          explanation: 10,
          total,
          strengths: ["Clear project description", "Good use of web technologies"],
          improvements: ["Add more robust error handling", "Improve mobile responsiveness"],
          next_step: "Consider deploying to Vercel or adding user authentication."
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Evaluate an AI project built by a student.
    Title: ${title}
    URL: ${url}
    Description: ${description}
    Fetched Context: ${fetchedContext ? fetchedContext.substring(0, 500) : "Could not fetch URL directly. Evaluate based on description."}

    Rubric:
    - idea (0-20)
    - working_demo (0-25)
    - use_of_AI (0-25)
    - UI_quality (0-15)
    - explanation (0-15)

    Return EXACTLY this JSON structure:
    {
      "idea": number,
      "working_demo": number,
      "use_of_AI": number,
      "UI_quality": number,
      "explanation": number,
      "total": number,
      "strengths": ["str1", "str2"],
      "improvements": ["imp1", "imp2"],
      "next_step": "one sentence"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) throw new Error("No response");

    const score = JSON.parse(text);
    return NextResponse.json({ score });

  } catch (error) {
    console.error("Eval Error:", error);
    return NextResponse.json({ error: "Failed to evaluate project" }, { status: 500 });
  }
}
