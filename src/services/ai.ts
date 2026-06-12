import type { QuizQuestion, Flashcard, StudyTask } from './mockData';
import { generatePlannerSchedule } from './mockData';

// Helper to delay execution (simulates network latency)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getGeminiApiKey = () => {
  // Read VITE_GEMINI_API_KEY from env, falling back to localStorage
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('ash_gemini_key') || '';
};

// 1. Solve Question
export const solveQuestion = async (
  question: string, 
  level: 'beginner' | 'school' | 'college'
): Promise<string[]> => {
  const geminiKey = getGeminiApiKey();

  if (!geminiKey) {
    throw new Error("Gemini API key is not configured. Please enter your API Key in Settings or define VITE_GEMINI_API_KEY in a .env file.");
  }

  // Simulate a brief loading roundtrip for aesthetic smooth spinners
  await delay(600);

  try {
    const prompt = `Explain the academic question: "${question}". 
    Explain at a ${level.toUpperCase()} level.
    Format your response strictly as a JSON array of strings (e.g. ["Step 1...", "Step 2..."]), containing 4 to 6 steps. 
    Do not include any other text, and do not wrap in markdown code blocks like \`\`\`json. Just return the raw JSON array.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format received from Gemini API.");
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to solve the question using Gemini API.");
  }
};

// 2. Notes Summarizer
export const summarizeNotes = async (
  notes: string,
  image?: { mimeType: string; base64: string }
): Promise<{ summary: string[]; flashcards: Flashcard[] }> => {
  const geminiKey = getGeminiApiKey();

  if (!geminiKey) {
    throw new Error("Gemini API key is not configured. Please enter your API Key in Settings or define VITE_GEMINI_API_KEY in a .env file.");
  }

  await delay(800);

  try {
    const prompt = image
      ? `Extract the academic content, textbook text, diagrams, or handwritten notes from the provided image/photo. Summarize its contents${notes.trim() ? ` along with these accompanying notes: "${notes}"` : ''} into bullet points, and generate 4 flashcards.
    
    Format your response strictly as a JSON object of this structure:
    {
      "summary": ["Point 1...", "Point 2...", "Point 3..."],
      "flashcards": [
        {"id": 1, "front": "Question...", "back": "Answer..."},
        {"id": 2, "front": "Question...", "back": "Answer..."}
      ]
    }
    Do not wrap the output in markdown code blocks. Just return the raw JSON.`
      : `Summarize the following notes into bullet points, and generate 4 flashcards.
    Notes: "${notes}"
    
    Format your response strictly as a JSON object of this structure:
    {
      "summary": ["Point 1...", "Point 2...", "Point 3..."],
      "flashcards": [
        {"id": 1, "front": "Question...", "back": "Answer..."},
        {"id": 2, "front": "Question...", "back": "Answer..."}
      ]
    }
    Do not wrap the output in markdown code blocks. Just return the raw JSON.`;

    const parts: any[] = [{ text: prompt }];
    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format received from Gemini API.");
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to summarize notes using Gemini API.");
  }
};

// 3. Quiz Generator
export const generateQuiz = async (
  topic: string, 
  count: number
): Promise<QuizQuestion[]> => {
  const geminiKey = getGeminiApiKey();

  if (!geminiKey) {
    throw new Error("Gemini API key is not configured. Please enter your API Key in Settings or define VITE_GEMINI_API_KEY in a .env file.");
  }

  await delay(700);

  try {
    const prompt = `Generate a multiple choice quiz about the topic "${topic}". The quiz must contain exactly ${count} questions.
    Format your response strictly as a JSON array of questions, with this structure:
    [
      {
        "id": 1,
        "question": "Question text...",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": 0, // index of correct option (0, 1, 2, or 3)
        "explanation": "Explanation..."
      }
    ]
    Do not wrap the output in markdown code blocks. Just return the raw JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format received from Gemini API.");
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to generate quiz using Gemini API.");
  }
};

// 4. Study Planner
export const generatePlanner = async (
  subjects: string[], 
  examDate: string, 
  dailyHours: number
): Promise<StudyTask[]> => {
  // Planner runs local scheduling calendar logic
  return generatePlannerSchedule(subjects, examDate, dailyHours);
};
