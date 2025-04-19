-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar NOT NULL,
	"isMember" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "study_material" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"course_type" varchar(255) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"difficulty_level" varchar(50) DEFAULT 'Easy' NOT NULL,
	"course_layout" json,
	"created_by" varchar(255) NOT NULL,
	"status" varchar DEFAULT 'Generating' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapterNotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"chapterId" integer NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "studyTypeContent" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" varchar NOT NULL,
	"content" json,
	"type" varchar NOT NULL
);

*/