import type { InferSelectModel } from "drizzle-orm";
import { posts } from "../db/schema/schema";

export type PostRecord = InferSelectModel<typeof posts>;

export type UpdatePostParams = {
  postId: number;
};

export type UpdatePostBody = {
  title: string;
  content: string;
  image: string;
  categoryId: number | null;
  statusId: number | null;
  description: string | null;
};

export type UpdatePostPayload = UpdatePostParams & {
  body: UpdatePostBody;
};

export type PatchPostBody = Partial<UpdatePostBody>;

export type PatchPostPayload = UpdatePostParams & {
  body: PatchPostBody;
};

export type CreatePostBody = {
  title: string;
  image: string;
  categoryId: number | string;
  description: string;
  content: string;
  statusId: number ;
};

export type GetPostsQuery = {
  page: number;
  limit: number;
  category?: string;
  keyword?: string;
};

export type GetPostsResult = {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  posts: PostRecord[];
  nextPage: number | null;
};
