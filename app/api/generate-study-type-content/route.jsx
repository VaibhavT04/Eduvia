import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { db } from "@/configs/db";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(req) {
    try {
        const { chapters, courseId, type } = await req.json();
        
        console.log("Received request:", { chapters, courseId, type });
        
        if (!chapters || !courseId || !type) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        try {
            // Insert record to DB, update status to generating....
            const result = await db
                .insert(STUDY_TYPE_CONTENT_TABLE)
                .values({
                    courseId: courseId,
                    type: type,
                    content: null,
                    status: 'Generating'
                })
                .returning();

            console.log("Database insert result:", result);

            if (!result || result.length === 0) {
                throw new Error("Failed to create record in database");
            }

            // Trigger appropriate Inngest function based on type
            if (type === 'Notes/Chapters') {
                await inngest.send({
                    name: "notes.generate",
                    data: {
                        course: {
                            resp: {
                                courseId: courseId,
                                courseLayout: { chapters: chapters.split(',').map(c => ({ chapterTitle: c.trim() })) }
                            }
                        }
                    }
                });
            } else if (type === 'Flashcard') {
                await inngest.send({
                    name: 'studyType.content',
                    data: {
                        studyType: type,
                        prompt: 'Generate the flashcard on topic: ' + chapters + ' in JSON format with front back content Maximum 15',
                        courseId: courseId,
                        recordId: result[0].id
                    }
                });
            }

            return NextResponse.json({ 
                success: true, 
                id: result[0].id 
            });
        } catch (dbError) {
            console.error("Database operation failed:", dbError);
            throw dbError; // Re-throw to be caught by outer try-catch
        }
    } catch (error) {
        console.error("Error in generate-study-type-content:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Internal server error",
                details: error.stack,
                code: error.code // Include database error code if available
            },
            { status: 500 }
        );
    }
}