import { inngest } from "@/inngest/client";
import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { courseOutlineAIModel, GenerateStudyTypeContentAiModel } from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;
    //get event data
    const result = await step.run(
      "check user and create new user if not exist",
      async () => {
        const result = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, user?.primaryEmailAddress));
        if (result?.length == 0) {
          const userResp = await db
            .insert(USER_TABLE)
            .values({
              name: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
            })
            .returning({ id: USER_TABLE.id });
            return userResp;
        }
        return result;
      }
    )
    return "Success";
  }
  //Send welcome email to user


);


export const GenerateNotes = inngest.createFunction(
  { id: "generate-notes" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;
    
    // Get the course layout from the nested structure
    let courseLayout = course.resp.courseLayout;
    
    // Parse the courseLayout if it's a string
    if (typeof courseLayout === 'string') {
      try {
        courseLayout = JSON.parse(courseLayout);
      } catch (error) {
        console.error("Failed to parse courseLayout:", error);
        throw new Error("Invalid courseLayout format");
      }
    }
    
    console.log("Processing course layout:", courseLayout);
    
    if (!courseLayout || !courseLayout.chapters) {
      console.error("Invalid course layout structure:", courseLayout);
      throw new Error("Invalid course layout structure");
    }
    
    // Generate notes for each chapter
    for (let i = 0; i < courseLayout.chapters.length; i++) {
      const chapter = courseLayout.chapters[i];
      const chapterId = i + 1; // Use numeric ID starting from 1
      
      // Generate notes for this chapter
      const PROMPT = `Generate exam material detail content for each chapter , Make sure to includes all topic point in the content, make sure to give content in HTML format (Do not Add HTMLK , Head, Body, title tag), The chapters`+JSON.stringify(chapter);
      
      const notes = await step.run(
        `generate-notes-chapter-${chapterId}`,
        async () => {
          const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
          return aiResp.response.text();
        }
      );
      
      // Save the notes to the database
      await step.run(
        `save-notes-chapter-${chapterId}`,
        async () => {
          await db.insert(CHAPTER_NOTES_TABLE).values({
            courseId: course.resp.courseId,
            chapterId: chapterId,
            notes: notes
          });
        }
      );
    }
    
    // Update the course status
    await step.run("update-course-status", async () => {
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({ status: "Completed" })
        .where(eq(STUDY_MATERIAL_TABLE.id, course.resp.id));
    });
    
    return { message: "Notes generated successfully" };
  }
); 

//use to generate Flash Cards
export const GenerateStudyTypeContent = inngest.createFunction(
  { 
    name: "Generate Study Type Content",
    id: "generate-study-type-content"
  },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;

    const FlashcardAiResult = await step.run('Generating Flash card using AI', async () => {
      try {
        const result = await GenerateStudyTypeContentAiModel.sendMessage(prompt);
        console.log('Raw AI Response:', result); // Debug log
        
        let parsedResult;
        try {
          // Get the text content from the response
          const responseText = result.response.text();
          console.log('Response Text:', responseText);
          
          // Remove JSON code block markers if present
          const cleanJson = responseText.replace(/```json\n|\n```/g, '');
          console.log('Cleaned JSON:', cleanJson);
          
          // Parse the JSON content
          parsedResult = JSON.parse(cleanJson);
          console.log('Parsed Result:', parsedResult);
          
          if (!Array.isArray(parsedResult)) {
            throw new Error('Expected array of flashcards');
          }

          return parsedResult;
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Failed to parse AI response: ' + parseError.message);
        }
      } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
      }
    });

    const DbResult = await step.run('Save Result to DB', async () => {
      try {
        if (!FlashcardAiResult) {
          throw new Error('No content to save to database');
        }

        // Update the record with the generated content
        const result = await db.update(STUDY_TYPE_CONTENT_TABLE)
          .set({
            content: FlashcardAiResult
          })
          .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))
          .returning();

        if (!result || result.length === 0) {
          throw new Error('Failed to update database record');
        }

        return { success: true, message: 'Data saved successfully' };
      } catch (error) {
        console.error('Database Update Error:', error);
        throw error;
      }
    });

    return { 
      success: true, 
      message: 'Content generated and saved successfully',
      recordId: recordId
    };
  }
);