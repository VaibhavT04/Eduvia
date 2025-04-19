import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { helloWorld, CreateNewUser, GenerateNotes, GenerateStudyTypeContent } from "@/inngest/functions";


// Create an API that serves Inngest functions
export const { GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateStudyTypeContent
  ],
});