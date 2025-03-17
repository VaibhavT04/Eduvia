import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body
        const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

        // Validate required fields
        if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate the prompt for the AI model - Add spaces for better prompt formatting
        const PROMPT = 'Generate a study material for ' + topic + ' for ' + courseType + 
                      ' and level of difficulty will be ' + difficultyLevel + 
                      ' with summary of course, List of Chapters along with summary for each chapter, Topic list in each chapter, All results in JSON format';

        // Call the AI model
        const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
        
        if (!aiResp || !aiResp.response) {
            return NextResponse.json(
                { success: false, message: "Failed to get response from AI model" },
                { status: 500 }
            );
        }

        // Validate and parse the AI response
        let aiResult;
        try {
            aiResult = JSON.parse(aiResp.response.text());
        } catch (error) {
            console.error("Failed to parse AI response:", aiResp.response.text());
            return NextResponse.json(
                { success: false, message: "Invalid response from AI model" },
                { status: 500 }
            );
        }

        // Insert the result into the database
        const dbResult = await db
            .insert(STUDY_MATERIAL_TABLE)
            .values({
                courseId: courseId,
                courseType: courseType,
                createdBy: createdBy,
                topic: topic,
                difficultyLevel: difficultyLevel, // Adding difficultyLevel to the database record
                courseLayout: aiResult,
            })
            .returning({ resp: STUDY_MATERIAL_TABLE });

        if (!dbResult || dbResult.length === 0) {
            return NextResponse.json(
                { success: false, message: "Failed to insert data into database" },
                { status: 500 }
            );
        }

        console.log("Database insertion result:", dbResult);

        // Return the result
        return NextResponse.json({ success: true, result: dbResult[0] });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}