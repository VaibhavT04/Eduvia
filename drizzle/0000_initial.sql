CREATE TABLE IF NOT EXISTS "study_material" (
  "id" SERIAL PRIMARY KEY,
  "course_id" VARCHAR(255) NOT NULL,
  "course_type" VARCHAR(255) NOT NULL,
  "topic" VARCHAR(255) NOT NULL,
  "difficulty_level" VARCHAR(50) NOT NULL DEFAULT 'Easy',
  "course_layout" JSONB,
  "created_by" VARCHAR(255) NOT NULL,
  "status" VARCHAR NOT NULL DEFAULT 'Generating'
); 