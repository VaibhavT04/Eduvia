import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

let aiResult;
// Type validation helper (optional, if using TypeScript or strict checks)
const isValidInput = (obj) => {
  return obj && typeof obj === "object" && 
         ["courseId", "topic", "courseType", "difficultyLevel", "createdBy"].every(key => obj[key] !== undefined && obj[key] !== "");
};

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    if (!isValidInput(body)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const { courseId, topic, courseType, difficultyLevel, createdBy } = body;

    // Generate the prompt with better formatting
    const PROMPT = `
      Generate a study material for ${topic} 
      for ${courseType} 
      and level of difficulty will be ${difficultyLevel} 
      with summary of course, 
      List of Chapters along with summary for each chapter, 
      Topic list in each chapter, 
      All results in JSON format
    `.trim();

    console.log("Sending request to AI model with prompt:", PROMPT);
    
    // Call the AI model with timeout protection
    const aiRespPromise = courseOutlineAIModel.sendMessage(PROMPT);
    const aiResp = await Promise.race([
      aiRespPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("AI request timed out after 30 seconds")), 30000)
      )
    ]);
    
    console.log("Received AI response:", aiResp);
    
    if (!aiResp || !aiResp.response) {
      console.error("AI Response Error: Empty or invalid response", aiResp);
      return NextResponse.json(
        { success: false, message: "Failed to get valid response from AI model" },
        { status: 500 }
      );
    }

    // Extract text from the response with proper fallbacks
    let responseText;
    if (typeof aiResp.response.text === 'function') {
      responseText = aiResp.response.text();
    } else {
      responseText = aiResp.response.text || aiResp.response.content || aiResp.response;
    }
    
    if (typeof responseText !== 'string') {
      // If it's already an object, try to use it directly
      if (typeof responseText === 'object' && responseText !== null) {
        console.log("Response is already an object, skipping JSON parsing");
        aiResult = responseText;
      } else {
        console.error("Invalid AI response format:", responseText);
        return NextResponse.json(
          { success: false, message: "Invalid response format from AI model" },
          { status: 500 }
        );
      }
    } else {
      // Try to parse the response as JSON
      try {
        // Clean the response text to handle common JSON formatting issues
        // This removes any markdown code block syntax or extra text before/after the JSON
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/```\s*([\s\S]*?)\s*```/) || 
                         [null, responseText];
        
        const cleanedResponse = jsonMatch[1].trim();
        console.log("Attempting to parse JSON response:", cleanedResponse.substring(0, 200) + "...");
        
        aiResult = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response text:", responseText);
        return NextResponse.json(
          { success: false, message: "Could not parse AI response as JSON", details: parseError.message },
          { status: 500 }
        );
      }
    }

    // Validate the parsed result
    if (typeof aiResult !== "object" || aiResult === null) {
      console.error("Invalid JSON structure in AI response");
      return NextResponse.json(
        { success: false, message: "AI returned invalid data structure" },
        { status: 500 }
      );
    }

    console.log("Successfully parsed AI response into JSON object");

    // Insert the result into the database
    try {
      const dbResult = await db
        .insert(STUDY_MATERIAL_TABLE)
        .values({
          courseId,
          courseType,
          createdBy,
          topic,
          difficultyLevel,
          courseLayout: aiResult,
        })
        .returning({ resp: STUDY_MATERIAL_TABLE });

      if (!dbResult || dbResult.length === 0) {
        console.error("Database Insertion Failed:", dbResult);
        return NextResponse.json(
          { success: false, message: "Failed to insert data into database" },
          { status: 500 }
        );
      }

      console.log("Database insertion successful:", dbResult);

      // Return the result
      return NextResponse.json({ success: true, result: dbResult[0] }, { status: 200 });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      return NextResponse.json(
        { success: false, message: "Database error", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}