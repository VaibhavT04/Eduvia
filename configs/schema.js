import {json, boolean, pgTable, serial, varchar, integer, text } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  email: varchar("email").notNull().unique(),
  isMember: boolean("isMember").default(false),
  customerId:varchar()
});

export const STUDY_MATERIAL_TABLE = pgTable("study_material", {
  id: serial("id").primaryKey(),
  courseId: varchar("course_id", { length: 255 }).notNull(),
  courseType: varchar("course_type", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  difficultyLevel: varchar("difficulty_level", { length: 50 }).default("Easy").notNull(),
  courseLayout: json("course_layout"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  status: varchar("status").default("Generating").notNull(),
});

export const CHAPTER_NOTES_TABLE = pgTable("chapterNotes", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  chapterId: integer("chapterId").notNull(),
  notes: text("notes")
});

export const STUDY_TYPE_CONTENT_TABLE = pgTable("studyTypeContent", {
  id: serial("id").primaryKey(),
  courseId: varchar("courseId").notNull(),
  content: json("content"),
  type: varchar("type").notNull()
});

export const PAYMENT_RECORD_TABLE = pgTable("paymentRecord",{
  id:serial().primaryKey(),
  cutomerId:varchar(),
  sessionId:varchar()
})