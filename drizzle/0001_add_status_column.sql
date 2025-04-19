ALTER TABLE "studyTypeContent" 
ADD COLUMN IF NOT EXISTS "status" VARCHAR DEFAULT 'Generating'; 