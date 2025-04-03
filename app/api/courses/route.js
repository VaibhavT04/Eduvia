import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";

// Utility function to inspect course layout structure
function inspectCourseLayout(courseLayout) {
  if (!courseLayout) return { error: "No course layout data" };
  
  try {
    // Parse if it's a string
    const parsed = typeof courseLayout === 'string' 
      ? JSON.parse(courseLayout) 
      : courseLayout;
    
    // Check for common title and summary fields
    const titleFields = ['course_title', 'title', 'courseTitle', 'name'];
    const summaryFields = ['summary', 'courseSummary', 'description', 'overview'];
    
    const title = titleFields.find(field => parsed[field]) || null;
    const summary = summaryFields.find(field => parsed[field]) || null;
    
    return {
      hasTitle: !!title,
      hasSummary: !!summary,
      titleField: title,
      summaryField: summary,
      titleValue: title ? parsed[title] : null,
      summaryValue: summary ? parsed[summary] : null,
      allKeys: Object.keys(parsed),
      structure: JSON.stringify(parsed).substring(0, 200) + "..."
    };
  } catch (error) {
    return { error: `Failed to parse course layout: ${error.message}` };
  }
}

export async function POST(req) {
  try {
    const { createdBy } = await req.json();
    
    if (!createdBy) {
      return NextResponse.json(
        { success: false, message: "createdBy is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id));
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req){
  try {
    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl);
    const courseId = searchParams?.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 }
      );
    }
    
    const course = await db.select().from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE?.courseId, courseId));
    
    if (!course || course.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    
    // Log the course data for debugging
    console.log("Course data:", JSON.stringify(course[0], null, 2).substring(0, 500) + "...");
    
    // Check if courseLayout is present and log its type
    if (course[0].courseLayout) {
      console.log("Course layout type:", typeof course[0].courseLayout);
      console.log("Course layout length:", course[0].courseLayout.length);
      
      // Inspect the course layout structure
      const inspection = inspectCourseLayout(course[0].courseLayout);
      console.log("Course layout inspection:", inspection);
    } else {
      console.log("No courseLayout found in course data");
    }
    
    return NextResponse.json({
      success: true,
      result: course[0]
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch course", error: error.message },
      { status: 500 }
    );
  }
}
