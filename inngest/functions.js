import { inngest } from "@/inngest/client";
import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
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
  {id:'Generate Study Type Content'},
  {event:'studyType.content'},

  async({event, step})=>{
    const {studyType, prompt, courseId} = event.data;

    const FlashcardAiResult = await step.run('Generating Flash card using AI',async()=>{
      const result = GenerateStudyTypeContentAiModel.sendMessage(prompt);
      const AIResult = JSON.parse(result.response.text());
      return AIResult
    })

    //save the Result
    const DbResult = await step.run('Save Result to DB',async()=>{
      const result = await db.insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId:courseId,
        type:studyType,
        content:FlashcardAiResult
      })

      return 'Data Inserted'
    })
  }
)