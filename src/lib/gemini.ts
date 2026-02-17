// Gemini API client for generating X posts

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeneratedPost {
  id: string;
  content: string;
  scheduledTime: string; // HH:mm format
  scheduledDate: string; // YYYY-MM-DD
  status: "pending" | "posted" | "failed";
  createdAt: string;
}

export async function generateXPost(
  apiKey: string,
  prompt: string,
  count: number = 1
): Promise<string[]> {
  const systemPrompt = `You are a viral X (Twitter) content creator. Generate exactly ${count} unique, engaging post(s) based on the user's topic/prompt.

Rules:
- Each post MUST be at least 3 words long
- Each post should be highly engaging, relatable, and encourage replies
- Use emojis strategically but don't overdo it
- Include a call-to-action (question, "share your story", etc.) at the end
- Make posts feel personal, emotional, and human — NOT robotic
- Mix humor, vulnerability, and relatability
- Keep each post under 280 characters
- Posts should be about tech, dev life, data science, ML, or coding culture
- Each post should have a different angle/style (humor, emotional, educational, relatable)

Format: Return ONLY a JSON array of strings. No markdown, no explanation. Just the JSON array.
Example: ["Post 1 content here 👇", "Post 2 content here 😂👇"]`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nUser prompt/topic: ${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error("No response from Gemini");

  // Parse JSON array from response
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const posts: string[] = JSON.parse(jsonMatch[0]);
    // Filter out posts with fewer than 3 words
    return posts.filter((p) => p.trim().split(/\s+/).length >= 3);
  } catch {
    // Fallback: split by double newline if JSON parsing fails
    return text
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0 && p.split(/\s+/).length >= 3);
  }
}
