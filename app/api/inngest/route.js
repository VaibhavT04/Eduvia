import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { helloWorld, CreateNewUser, GenerateNotes } from "@/inngest/functions";
import { GenerateStudyTypeContentAiModel } from "@/configs/AiModel";


// Create an API that serves Inngest functions
export const { GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateStudyTypeContentAiModel
  ],
});