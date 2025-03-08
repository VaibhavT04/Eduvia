import {json, boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  isMember: boolean().default(false),
});

export const STUDY_MATERIAL_TABLE = pgTable("study_material", {
  id: serial("id").primaryKey(),
  courseId: varchar("course_id", { length: 255 }).notNull(),
  courseType: varchar("course_type", { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficultyLevel: varchar('difficulty_level', { length: 50 }).default('Easy').notNull(),
  courseLayout: json('course_layout'),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  status: varchar().default('Generating').notNull(),
});

