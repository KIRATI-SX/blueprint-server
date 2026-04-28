import { relations } from "drizzle-orm/relations";
import { categories, posts, statuses, comments, users, likes } from "./schema";

export const postsRelations = relations(posts, ({one, many}) => ({
	category: one(categories, {
		fields: [posts.categoryId],
		references: [categories.id]
	}),
	status: one(statuses, {
		fields: [posts.statusId],
		references: [statuses.id]
	}),
	comments: many(comments),
	likes: many(likes),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	posts: many(posts),
}));

export const statusesRelations = relations(statuses, ({many}) => ({
	posts: many(posts),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
	likes: many(likes),
}));

export const likesRelations = relations(likes, ({one}) => ({
	post: one(posts, {
		fields: [likes.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
}));