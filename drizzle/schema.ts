import { pgTable, unique, serial, varchar, boolean, json, integer, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar(),
	email: varchar().notNull(),
	isMember: boolean().default(false),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const studyMaterial = pgTable("study_material", {
	id: serial().primaryKey().notNull(),
	courseId: varchar("course_id", { length: 255 }).notNull(),
	courseType: varchar("course_type", { length: 255 }).notNull(),
	topic: varchar({ length: 255 }).notNull(),
	difficultyLevel: varchar("difficulty_level", { length: 50 }).default('Easy').notNull(),
	courseLayout: json("course_layout"),
	createdBy: varchar("created_by", { length: 255 }).notNull(),
	status: varchar().default('Generating').notNull(),
});

export const chapterNotes = pgTable("chapterNotes", {
	id: serial().primaryKey().notNull(),
	courseId: varchar().notNull(),
	chapterId: integer().notNull(),
	notes: text(),
});

export const studyTypeContent = pgTable("studyTypeContent", {
	id: serial().primaryKey().notNull(),
	courseId: varchar().notNull(),
	content: json(),
	type: varchar().notNull(),
});
