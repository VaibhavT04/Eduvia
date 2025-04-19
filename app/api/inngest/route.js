import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent } from "@/inngest/functions";
import { AiModel } from "@/models/AiModel";


// Create an API that serves Inngest functions
export const { GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateStudyTypeContent
  ],
});

export const generateContent = inngest.createFunction(
  { id: "generate-content" },
  { event: "app/generate.content" },
  async ({ event, step }) => {
    const { courseId, studyType, userId } = event.data;

    try {
      // ... existing code ...

      let prompt;
      if (studyType === "flashcards") {
        prompt = AiModel.FLASHCARD_PROMPT;
      } else if (studyType === "notes") {
        prompt = AiModel.NOTES_PROMPT;
      } else if (studyType === "Quiz") {
        prompt = AiModel.QUIZ_PROMPT;
      }

      // ... existing code ...

      let parsedContent;
      try {
        if (studyType === "notes") {
          parsedContent = content;
        } else {
          parsedContent = JSON.parse(content);
          
          // Validate quiz content structure
          if (studyType === "Quiz") {
            if (!Array.isArray(parsedContent)) {
              throw new Error("Quiz content must be an array of questions");
            }
            
            parsedContent.forEach((question, index) => {
              if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
                throw new Error(`Invalid question format at index ${index}`);
              }
              if (!question.options.includes(question.correctAnswer)) {
                throw new Error(`Correct answer not found in options at question ${index + 1}`);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error(`Failed to parse ${studyType} content: ${error.message}`);
      }

      // ... existing code ...
    } catch (error) {
      // ... existing error handling ...
    }
  }
);