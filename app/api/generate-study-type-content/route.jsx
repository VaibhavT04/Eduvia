import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import nextConfig from "@/next.config.mjs";

export async function POST(req) {
    const {chapters,courseID,type}=await req.json();

    const PROMPT='Generate the flashcard on topic :  '+chapters+' in JSON format with front back content Maximum 15' 

    //Insert record to DB, update status to generating....
    const result=await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseID: courseID,
        type: type

    }).returning({id:STUDY_TYPE_CONTENT_TABLE.id});


    //TRigger ingest function
    inngest.send({
        name: 'studyType.content',
        data: {
            studyType:type,
            prompt:PROMPT,
            courseId:courseId,
            recordId:result[0].id
        }
    })

    return NextResponse.json(result[0].id)
    
}