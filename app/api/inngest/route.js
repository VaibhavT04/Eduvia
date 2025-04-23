import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent } from "@/inngest/functions";
import { AiModel } from "@/models/AiModel";
import { sql } from "@vercel/postgres";

// Create an API that serves Inngest functions
export const { GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateStudyTypeContent,
    PricingDialog
  ],
});

export const generateContent = inngest.createFunction(
  { id: "generate-content" },
  { event: "app/generate.content" },
  async ({ event, step }) => {
    const { courseId, studyType, userId, courseContent } = event.data;

    try {
      await step.run("Start content generation", async () => {
        console.log(`Starting ${studyType} generation for course ${courseId}`);
      });

      let prompt;
      if (studyType === "Flashcard") {
        prompt = AiModel.FLASHCARD_PROMPT;
      } else if (studyType === "Notes") {
        prompt = AiModel.NOTES_PROMPT;
      } else if (studyType === "Quiz") {
        prompt = AiModel.QUIZ_PROMPT;
      }

      const content = await step.run("Generate content", async () => {
        // Use the existing AiModel approach to generate content
        const response = await fetch(process.env.GEMINI_API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `${prompt}\n\nCourse Content:\n${courseContent}`,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate ${studyType} content`);
        }

        const data = await response.json();
        return data.content;
      });

      let parsedContent;
      try {
        if (studyType === "Notes") {
          parsedContent = content;
        } else {
          // Extract JSON from the response
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[([\s\S]*?)\]/);
          const jsonContent = jsonMatch ? jsonMatch[1] : content;
          parsedContent = JSON.parse(jsonContent);
          
          // Validate quiz content structure
          if (studyType === "Quiz") {
            if (!Array.isArray(parsedContent)) {
              throw new Error("Quiz content must be an array of questions");
            }
            
            parsedContent.forEach((question, index) => {
              if (!question.question || !Array.isArray(question.options) || !question.correctAnswer || !question.explanation) {
                throw new Error(`Invalid question format at index ${index}`);
              }
              if (!question.options.includes(question.correctAnswer)) {
                throw new Error(`Correct answer not found in options at question ${index + 1}`);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error parsing content:", error);
        throw new Error(`Failed to parse ${studyType} content: ${error.message}`);
      }

      // Store in database
      await step.run("Store in database", async () => {
        const contentString = JSON.stringify(parsedContent);
        await sql`
          INSERT INTO study_type_content (course_id, study_type, content, user_id)
          VALUES (${courseId}, ${studyType}, ${contentString}, ${userId})
          ON CONFLICT (course_id, study_type) 
          DO UPDATE SET content = ${contentString}, updated_at = NOW()
        `;
      });

      return {
        success: true,
        message: `Successfully generated and stored ${studyType} content`,
        studyType,
        courseId
      };

    } catch (error) {
      console.error(`Error in generate-content function:`, error);
      return {
        success: false,
        message: error.message,
        studyType,
        courseId
      };
    }
  }
);