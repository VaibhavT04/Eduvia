import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";

export async function POST(req){
    try {
        const {courseId, studyType} = await req.json();
        
        console.log("Received request:", { courseId, studyType });

        if (!courseId || !studyType) {
            return NextResponse.json({
                success: false,
                message: "Course ID and study type are required"
            }, { status: 400 });
        }

        if(studyType === 'ALL'){
            const notes = await db.select().from(CHAPTER_NOTES_TABLE)
            .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));

            const contentList=await db.select().from(STUDY_TYPE_CONTENT_TABLE)
            .where(eq(STUDY_TYPE_CONTENT_TABLE?.courseId, courseId));
            
            const result = {
                success: true,
                data: {
                    notes: notes,
                    flashcards: contentList?.find(item=>item.type=='Flashcard'),
                    quiz: [],
                    qa: []
                }
            }

            return NextResponse.json(result);
        }
        
        // Handle specific study types
        if (studyType === 'notes') {
            const notes = await db.select().from(CHAPTER_NOTES_TABLE)
                .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
                
            return NextResponse.json({
                success: true,
                data: notes
            });
        }
        
        // For other study types, return empty arrays for now
        return NextResponse.json({
            success: true,
            data: []
        });
        
    } catch (error) {
        console.error("Error in study-type route:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error.message
        }, { status: 500 });
    }
}
