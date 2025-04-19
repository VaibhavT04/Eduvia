import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { eq, and, desc, isNotNull } from "drizzle-orm";

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
                .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

            const contentList = await db.select()
                .from(STUDY_TYPE_CONTENT_TABLE)
                .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
            
            console.log('ALL query contentList:', contentList);
            
            // Find the latest non-null content for each type
            const getLatestContent = (type) => {
                const typeContent = contentList
                    .filter(item => item.type === type && item.content !== null)
                    .sort((a, b) => b.id - a.id)[0];
                return typeContent?.content || [];
            };
            
            const result = {
                success: true,
                data: {
                    notes: notes,
                    flashcards: getLatestContent('Flashcard'),
                    quiz: getLatestContent('Quiz'),
                    qa: getLatestContent('Question/Answer')
                }
            }

            return NextResponse.json(result);
        }
        
        // Handle specific study types
        if (studyType === 'notes') {
            const notes = await db.select().from(CHAPTER_NOTES_TABLE)
                .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
                
            return NextResponse.json({
                success: true,
                data: notes
            });
        } else {
            // For flashcards and other study types
            // Get the latest non-null content for the specific type
            const content = await db.select()
                .from(STUDY_TYPE_CONTENT_TABLE)
                .where(
                    and(
                        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
                        eq(STUDY_TYPE_CONTENT_TABLE.type, studyType),
                        isNotNull(STUDY_TYPE_CONTENT_TABLE.content)
                    )
                )
                .orderBy(desc(STUDY_TYPE_CONTENT_TABLE.id))
                .limit(1);

            console.log('Query result for', studyType, ':', content);

            if (!content || content.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: 'No content found for this type'
                });
            }

            // Parse content if it's a string
            let parsedContent = content[0].content;
            if (typeof parsedContent === 'string') {
                try {
                    parsedContent = JSON.parse(parsedContent);
                } catch (e) {
                    console.error('Error parsing content:', e);
                }
            }

            return NextResponse.json({
                success: true,
                content: Array.isArray(parsedContent) ? parsedContent : []
            });
        }
    } catch (error) {
        console.error("Error in study-type route:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error.message
        }, { status: 500 });
    }
}
