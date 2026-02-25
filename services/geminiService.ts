
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { NoteContent, Quiz, SourceCard, QuizResult } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const UNIVERSAL_PROMPT_SYSTEM = `You are a Universal Intelligence Architect. 
Your goal is to synthesize raw context into high-density, structured intelligence packs with extreme precision and depth. 
Whether the content is business strategy, creative writing, technical code, or academic research, 
you must provide:
1. High-level Executive Synthesis: A concise but profound overview of the core value proposition.
2. Structured Insight Blocks (Markdown): Deep, scannable insights using bold headers and bullet points.
3. Logical Architecture/Flow diagrams (Mermaid.js): Accurate, syntactically correct diagrams representing the logical flow or system architecture.
4. Speculative "What-If" scenarios: Rigorous edge-case planning and future-proofing analysis.
5. Action Items: Highly specific, actionable, and checkbox-style tasks extracted from the content.

Maintain a tone of professional mastery, technical rigor, and intellectual clarity.`;

export const webSearchNotes = async (query: string): Promise<{ notes: NoteContent, sources: SourceCard[] }> => {
  const searchResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `RESEARCH AND ANALYZE: "${query}". Contextualize for professional/personal mastery. Provide a deep dive into the subject matter.`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });

  const groundingMetadata = searchResponse.candidates?.[0]?.groundingMetadata;
  const rawSources = groundingMetadata?.groundingChunks || [];
  const rawText = searchResponse.text || "";

  const unifiedResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `FORGE INTELLIGENCE FOR: "${query}"
               DATA: ${rawText.substring(0, 12000)}
               ${UNIVERSAL_PROMPT_SYSTEM}`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A compelling and precise title for the intelligence pack." },
          category: { type: Type.STRING, enum: ['Business', 'Technical', 'Creative', 'General'], description: "The most relevant domain for this content." },
          structuredNotes: { type: Type.STRING, description: "Deeply structured Markdown notes with clear hierarchy." },
          summary: { type: Type.STRING, description: "A high-density executive summary, formatted as a bulleted list of key takeaways." },
          keyTerms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Essential vocabulary and concepts." },
          visualData: { type: Type.STRING, description: "Syntactically valid Mermaid.js chart code (e.g., graph TD, sequenceDiagram)." },
          whatIfScenarios: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Probing questions and scenarios for future analysis." },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING, description: "A specific, actionable task." }
              }
            }
          }
        },
        required: ["title", "category", "structuredNotes", "summary", "whatIfScenarios"]
      }
    }
  });

  const synthesis = JSON.parse(unifiedResponse.text || '{}');
  const sources: SourceCard[] = rawSources.map((chunk: any) => ({
    siteName: chunk.web?.title || "Research Node",
    url: chunk.web?.uri || "#",
    snippet: chunk.web?.title || "Reference material.",
    similarityScore: 95,
  }));

  return {
    notes: {
      id: Math.random().toString(36).substr(2, 9),
      title: synthesis.title || query,
      category: synthesis.category || 'General',
      structuredNotes: synthesis.structuredNotes || "",
      summary: synthesis.summary || "",
      keyTerms: synthesis.keyTerms || [],
      visualData: synthesis.visualData,
      sources: sources,
      whatIfScenarios: synthesis.whatIfScenarios || [],
      actionItems: synthesis.actionItems?.map((a: any) => ({ 
        id: Math.random().toString(36).substr(2, 5), 
        task: a.task, 
        completed: false 
      })) || [],
      createdAt: new Date().toISOString()
    },
    sources
  };
};

export const generateNotesFromText = async (text: string, options?: any): Promise<NoteContent> => {
  const formatInstruction = options?.visualFormat ? `PRIMARY FORMAT REQUIREMENT: Output content in a ${options.visualFormat} style. If JSONSpec, provide a valid JSON representation inside 'structuredNotes'. If Flowchart, maximize the detail in 'visualData' using Mermaid.js.` : '';

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `${UNIVERSAL_PROMPT_SYSTEM}\n\nUSER CONFIG: ${JSON.stringify(options || {})}\n\n${formatInstruction}\n\nCONTENT TO ANALYZE: ${text.substring(0, 20000)}`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Business', 'Technical', 'Creative', 'General'] },
          structuredNotes: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualData: { type: Type.STRING, description: "Mermaid.js code for visualization." },
          whatIfScenarios: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  const data = JSON.parse(response.text || '{}');
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: data.title || "Forged Document",
    category: data.category || 'General',
    structuredNotes: data.structuredNotes || "",
    summary: data.summary || "",
    keyTerms: data.keyTerms || [],
    visualData: data.visualData,
    sources: [],
    whatIfScenarios: data.whatIfScenarios || [],
    actionItems: data.actionItems?.map((a: any) => ({ 
      id: Math.random().toString(36).substr(2, 5), 
      task: a.task, 
      completed: false 
    })) || [],
    createdAt: new Date().toISOString()
  };
};

export const generateArchitectureDocs = async (title: string, prompt: string): Promise<NoteContent> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `GENERATE TECHNICAL ARCHITECTURE FOR: "${title}". 
               REQUIREMENT: ${prompt}.
               The response must include detailed technical logic, a Mermaid.js flowchart (visualData), 
               key technical terms, and speculative edge cases (what-if scenarios).
               ${UNIVERSAL_PROMPT_SYSTEM}`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Business', 'Technical', 'Creative', 'General'] },
          structuredNotes: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualData: { type: Type.STRING, description: "Valid Mermaid.js chart code explaining the architecture flow." },
          whatIfScenarios: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "category", "structuredNotes", "summary", "whatIfScenarios"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: data.title || title,
    category: data.category || 'Technical',
    structuredNotes: data.structuredNotes || "",
    summary: data.summary || "",
    keyTerms: data.keyTerms || [],
    visualData: data.visualData,
    sources: [],
    whatIfScenarios: data.whatIfScenarios || [],
    actionItems: data.actionItems?.map((a: any) => ({ id: Math.random().toString(36).substr(2, 5), task: a.task, completed: false })) || [],
    createdAt: new Date().toISOString()
  };
};

export const generateQuiz = async (text: string, title: string): Promise<Partial<Quiz>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `BUILD INTERACTIVE ASSESSMENT FOR: "${title}". Use the following context: ${text.substring(0, 15000)}. Ensure questions are challenging and test deep understanding.`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["MCQ", "SHORT", "LONG"] },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for MCQ, optional otherwise." },
                correctAnswer: { type: Type.STRING, description: "The definitive correct answer or a detailed rubric for open-ended questions." }
              }
            }
          }
        }
      }
    }
  });
  const parsed = JSON.parse(response.text || '{"questions": []}');
  return { 
    id: Math.random().toString(36).substr(2, 6).toUpperCase(), 
    title, 
    questions: parsed.questions.map((q: any) => ({ 
      ...q, 
      id: Math.random().toString(36).substr(2, 9), 
      type: q.type.toUpperCase() 
    }))
  };
};

export const evaluateAssessment = async (quiz: Quiz, userAnswers: Record<string, string>): Promise<Partial<QuizResult>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `EVALUATE ASSESSMENT: ${quiz.title}. User Submission: ${JSON.stringify(userAnswers)}. 
               Reference Answers: ${JSON.stringify(quiz.questions.map(q => ({ q: q.question, a: q.correctAnswer })))}.
               Provide a scorecard, feedback, and accurate score. Be rigorous in evaluation.`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Number of correct answers." },
          feedback: { type: Type.STRING, description: "Detailed feedback on performance and areas for improvement." }
        }
      }
    }
  });
  const evalData = JSON.parse(response.text || '{}');
  return {
    score: evalData.score || 0,
    totalQuestions: quiz.questions.length,
    percentage: ((evalData.score || 0) / quiz.questions.length) * 100,
    feedback: evalData.feedback || "Evaluation complete.",
    answers: userAnswers
  };
};

export const getAITutorExplanation = async (concept: string, level: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Explain "${concept}" for a ${level} audience. Contextualize for real-world mastery. Use analogies and clear examples.`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  return response.text || "Synthesis unavailable.";
};
