import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

// const aiModel = "google/gemini-2.0-flash-exp:free";
const aiModel = "nvidia/nemotron-3-nano-30b-a3b:free";

if (!process.env.OPENROUTER_API_KEY) {
  console.warn("OPENROUTER_API_KEY is not set. Gemini service will not work.");
  process.exit(1);
}

interface Flashcard {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizItem {
  question: string;
  options: string[];
  difficulty: "easy" | "medium" | "hard";
  correctAnswer: string;
  explanation: string;
}

const generateFlashcards = async (
  text: string,
  count = 10
): Promise<Flashcard[]> => {
  const prompt = `You are an expert educator creating flashcards for effective learning. Generate EXACTLY ${count} concise flashcards from the following text. Focus on key concepts, facts, definitions, processes, and relationships. Ensure questions are varied (e.g., factual recall for Easy, application for Medium, analysis/comparison for Hard) and directly derived from the text. Avoid redundancy.

    MANDATORY: Distribute difficulties: ~3 easy, 4 medium, 3 hard for 10 cards.
    
    Output ONLY a valid JSON object, no extra text or formatting:
    {
      "data": [
        {
          "question": "Clear, specific question ending with ?",
          "answer": "Accurate, concise answer from text (1-3 sentences)",
          "difficulty": "easy"  // or medium/hard
        }
        // ... EXACTLY ${count} items, no more/less
      ],
      "success": true
    }
    
    Text: ${text.substring(0, 1500)}`;
  try {
    const response = await openrouter.chat.send({
      model: aiModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });
    const content = response.choices[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      return [];
    }
    let parsed: { data: Flashcard[]; success: boolean };
    try {
      parsed = JSON.parse(content.trim());
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Content preview:", content.substring(0, 500));
      return [];
    }

    const flashcards: Flashcard[] = parsed.data
      .filter(
        (card: Flashcard) =>
          typeof card.question === "string" &&
          typeof card.answer === "string" &&
          typeof card.difficulty === "string" &&
          card.question.trim() !== "" &&
          card.answer.trim() !== "" &&
          ["easy", "medium", "hard"].includes(card.difficulty)
      )
      .slice(0, count);

    if (flashcards.length === 0) {
      console.warn("No valid flashcards after filter.");
      return [];
    }

    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
};

const generateQuizFromText = async (
  text: string,
  numOfQuestions = 5
): Promise<QuizItem[]> => {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const prompt = `You are a skilled educator tasked with creating a multiple-choice quiz to assess comprehension of the following text. Generate EXACTLY ${numOfQuestions} questions that cover key concepts, facts, definitions, processes, and relationships from the text. Ensure questions are varied (e.g., factual recall, application, inference) and directly derived from the text. Avoid redundancy.
      For each question:
      - Make the correct answer accurate and based on the text.
      - Create 3 plausible distractors (wrong options) that are similar but incorrect.
      - Keep questions and options concise (under 20 words each).

      Output ONLY a valid JSON object, no extra text or formatting:
      {
        "data": [
          {
            "question": "Clear, engaging question",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],  // array of 4 strings
            "correctAnswer": "",  //  correct option (value of correct answer in string)
            "explanation": "Brief explanation (1-2 sentences) why this is correct, referencing the text"
            "difficulty": "easy" | "medium" | "hard"  // difficulty level
          }
          // ... EXACTLY ${numOfQuestions} items, no more/less
        ],
        "success": true
      }

      Text: ${text.substring(0, 1500)}`;

  try {
    const response = await openrouter.chat.send({
      model: aiModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });
    const content = response.choices[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      return [];
    }
    let parsed: { data: QuizItem[]; success: boolean };
    try {
      parsed = JSON.parse(content.trim());
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Content preview:", content.substring(0, 500));
      return [];
    }

    if (
      !parsed.data ||
      !Array.isArray(parsed.data) ||
      parsed.data.length === 0
    ) {
      console.warn("Invalid or empty data array.");
      return [];
    }

    const quizzes: QuizItem[] = parsed.data
      .filter(
        (item: QuizItem) =>
          typeof item.question === "string" &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          item.options.every((opt) => typeof opt === "string") &&
          typeof item.explanation === "string" &&
          item.question.trim() !== "" &&
          item.explanation.trim() !== ""
      )
      .slice(0, numOfQuestions);

    if (quizzes.length === 0) {
      console.warn("No valid quizzes after filter.");
      return [];
    }

    return quizzes;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

const generateSummary = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    return "No valid text provided for summarization.";
  }

  const truncatedText = text.substring(0, 1500);

  const prompt = `You are an expert summarizer specializing in distilling complex information into clear, engaging overviews. Generate a concise summary (150-250 words) of the following text. Focus on:
- Main ideas and key concepts
- Logical structure and flow (e.g., introduction, arguments, conclusions)
- Important facts, examples, or implications
- Neutral, objective tone without adding external information

Structure the summary as:
- **Overview**: A 1-2 sentence high-level intro.
- **Key Points**: Bullet list of 4-6 core elements.
- **Conclusion**: 1 sentence on overall impact or takeaway.

Keep it readable, avoid jargon unless essential (explain if needed), and ensure it's spoiler-free if the text is narrative.

Text: ${truncatedText}`;
  try {
    const response = await openrouter.chat.send({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
      temperature: 0.3,
    });
    let fullContent: string = "No summary generated.";
    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      fullContent = content;
    } else if (Array.isArray(content)) {
      fullContent = content
        .filter(
          (item): item is { type: "text"; text: string } => item.type === "text"
        )
        .map((item) => (item as { type: "text"; text: string }).text)
        .join("\n");

      if (fullContent.trim() === "") {
        fullContent = "No text content found in response.";
      }
    }

    if (fullContent.length < 100) {
      console.warn("Summary too short; using fallback.");
      fullContent = `Unable to generate a detailed summary. Original text preview: ${truncatedText.substring(
        0,
        200
      )}...`;
    }

    return fullContent;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "An error occurred while generating the summary. Please check your API key and try again.";
  }
};

const chatWithContext = async (
  question: string,
  chunks: { content: string }[]
): Promise<string> => {
  if (!question || question.trim().length === 0) {
    return "Please provide a valid question.";
  }
  if (!chunks || chunks.length === 0) {
    return "No context chunks provided. Unable to answer without context.";
  }

  let context = chunks
    .map((chunk, index) => `[Chunk ${index + 1}]:\n${chunk.content}`)
    .join("\n\n");
  const maxContextLength = 4000;
  if (context.length > maxContextLength) {
    context =
      context.substring(0, maxContextLength) +
      "\n\n[Context truncated for brevity; key details preserved.]";
    console.warn(
      `Context truncated to ${maxContextLength} characters. Original length: ${context.length}`
    );
  }

  console.log("Context for chat:", context);
  const prompt = `You are an expert knowledge assistant specialized in retrieving and synthesizing information from document chunks. Your goal is to answer the user's question accurately, concisely, and directly based ONLY on the provided context chunks below. Do NOT use external knowledge, hallucinate, or add unsubstantiated details—stick to what's in the chunks. If the question can't be fully answered from the context, say so clearly and suggest what additional info might help.
        Key guidelines:
        - Keep responses under 300 words; be clear and structured (use bullets if listing points).
        - If relevant, structure as: Answer + Evidence (with chunk refs) + Limitations (if any).

        Context:
        ${context}

        Question: ${question}

        Answer:`;

  try {
    const response = await openrouter.chat.send({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
      temperature: 0.3,
    });
    let fullContent: string = "No response generated.";

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      fullContent = content;
    } else if (Array.isArray(content)) {
      fullContent = content
        .filter(
          (item): item is { type: "text"; text: string } => item.type === "text"
        )
        .map((item) => (item as { type: "text"; text: string }).text)
        .join("\n");

      if (fullContent.trim() === "") {
        fullContent = "No text content found in response.";
      }
    }

    if (
      fullContent.length < 20 ||
      !fullContent.includes(question.toLowerCase().substring(0, 10))
    ) {
      console.warn("Response too short or irrelevant; using fallback.");
      fullContent =
        "Based on the provided context, I couldn't generate a precise answer. Please refine your question or provide more chunks.";
    }

    return fullContent;
  } catch (error) {
    console.error("Error during chat:", error);
    return "An error occurred while processing your question. Please check your API key and try again.";
  }
};

const explainConcept = async (
  concept: string,
  context: string
): Promise<string> => {
  if (!concept || concept.trim().length === 0) {
    return "Please provide a valid concept to explain.";
  }
  if (!context || context.trim().length === 0) {
    return "No context provided. Unable to explain without supporting information.";
  }

  const maxContextLength = 4000;
  let truncatedContext = context;
  if (context.length > maxContextLength) {
    truncatedContext =
      context.substring(0, maxContextLength) +
      "\n\n[Context truncated for brevity; key details preserved.]";
    console.warn(
      `Context truncated to ${maxContextLength} characters. Original length: ${context.length}`
    );
  }

  const prompt = `You are an expert educator and communicator, skilled at breaking down complex ideas into simple, engaging explanations. Using ONLY the provided context below, explain the concept of "${concept}" in a way that's accessible to beginners (e.g., high school level or non-experts). Do NOT add external knowledge, examples, or details not directly supported by the context—stick strictly to it. If the context doesn't cover the concept fully, note that clearly and explain what's available.
        Structure your explanation clearly and engagingly (under 400 words total):
        - **Definition**: A simple, one-sentence definition from the context.
        - **Breakdown**: 3-5 key components or steps, explained simply (use analogies if implied in context).
        - **Examples/Applications**: 1-2 brief, context-based examples or real-world ties.
        - **Why It Matters**: A short note on importance or implications from the context.
        - **Key Takeaway**: One memorable sentence to wrap up.

        Use friendly language, short sentences, and bullet points for readability. Make it fun and encouraging to build curiosity.

        Context: ${truncatedContext}

        Explanation:`;

  try {
    const response = await openrouter.chat.send({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
      temperature: 0.3,
    });
    let fullContent: string = "No explanation generated.";
    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      fullContent = content;
    } else if (Array.isArray(content)) {
      fullContent = content
        .filter(
          (item): item is { type: "text"; text: string } => item.type === "text"
        )
        .map((item) => (item as { type: "text"; text: string }).text)
        .join("\n");

      if (fullContent.trim() === "") {
        fullContent = "No text content found in response.";
      }
    }
    if (
      fullContent.length < 100 ||
      !fullContent.toLowerCase().includes(concept.toLowerCase())
    ) {
      console.warn("Explanation too short or irrelevant; using fallback.");
      fullContent = `Based on the provided context, here's a basic explanation of "${concept}": [Limited details available—context may need expansion]. For a fuller understanding, more information is recommended.`;
    }
    return fullContent;
  } catch (error) {
    console.error("Error explaining concept:", error);
    return "An error occurred while explaining the concept. Please check your API key and try again.";
  }
};

export const aiServices = {
  generateFlashcards,
  generateQuizFromText,
  generateSummary,
  chatWithContext,
  explainConcept,
};
