import { pgTable, unique, serial, varchar, foreignKey, text, integer, timestamp, uuid, check, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userRole = pgEnum("user_role", ['user', 'admin'])


export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("categories_name_key").on(table.name),
]);

export const statuses = pgTable("statuses", {
	id: serial().primaryKey().notNull(),
	status: varchar({ length: 10 }).notNull(),
}, (table) => [
	unique("statuses_status_key").on(table.status),
]);

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	image: text().notNull(),
	categoryId: integer("category_id"),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	date: timestamp({ mode: 'string' }).default(sql`CURRENT_DATE`),
	content: text().notNull(),
	statusId: integer("status_id"),
	likesCount: integer("likes_count").default(0),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "posts_category_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.statusId],
			foreignColumns: [statuses.id],
			name: "posts_status_id_fkey"
		}).onDelete("set null"),
]);

export const comments = pgTable("comments", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id"),
	userId: uuid("user_id"),
	commentText: text("comment_text").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "comments_post_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_fkey"
		}).onDelete("cascade"),
]);

export const likes = pgTable("likes", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id"),
	userId: uuid("user_id"),
	likedAt: timestamp("liked_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "likes_post_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "likes_user_id_fkey"
		}).onDelete("cascade"),
	unique("likes_post_id_user_id_key").on(table.postId, table.userId),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	profilePic: text("profile_pic"),
	role: userRole().default('user').notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),
	check("users_role_check", sql`(role)::text = ANY (ARRAY[('user'::character varying)::text, ('admin'::character varying)::text])`),
]);
