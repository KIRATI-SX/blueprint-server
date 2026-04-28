import { db } from "../db/drizzle";
import { categories, posts } from "../db/schema/schema";
import { and, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import {
  CreatePostBody,
  GetPostsQuery,
  GetPostsResult,
  PatchPostBody,
  UpdatePostBody,
} from "../types/posts.types";

const buildFilters = ({ category, keyword }: GetPostsQuery): SQL[] => {
  const filters: SQL[] = [];

  if (category) {
    if (/^\d+$/.test(category)) {
      filters.push(eq(posts.categoryId, Number(category)));
    } else {
      filters.push(ilike(categories.name, category));
    }
  }

  if (keyword) {
    const keywordPattern = `%${keyword}%`;
    const keywordFilter = or(
      ilike(posts.title, keywordPattern),
      ilike(posts.description, keywordPattern),
      ilike(posts.content, keywordPattern),
    );
    if (keywordFilter) {
      filters.push(keywordFilter);
    }
  }

  return filters;
};

const combineFilters = (filters: SQL[]): SQL | undefined => {
  if (filters.length === 0) {
    return undefined;
  }
  if (filters.length === 1) {
    return filters[0];
  }
  return and(...filters);
};

const PostRepository = {
  createPost: async (postData: CreatePostBody) => {
    const result = await db.insert(posts).values([{
      ...postData,
      categoryId: Number(postData.categoryId),
      statusId: Number(postData.statusId),
    }]).returning();
    return result[0] ?? null;
  },
  getAllPosts: async (query: GetPostsQuery): Promise<GetPostsResult> => {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const filters = buildFilters(query);
    const whereClause = combineFilters(filters);

    const countRows = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(whereClause);

    const totalPosts = Number(countRows[0]?.count ?? 0);
    const totalPages = totalPosts === 0 ? 0 : Math.ceil(totalPosts / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    const postRows = await db
      .select({ post: posts })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: postRows.map((row) => row.post),
      nextPage,
    };
  },
  getPostById: async (id: number) => {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  },
  updatePost: async (postId: number, dataToUpdate: UpdatePostBody) => {
    const result = await db
      .update(posts)
      .set(dataToUpdate)
      .where(eq(posts.id, postId))
      .returning();
    return result[0] ?? null;
  },
  patchPost: async (postId: number, dataToUpdate: PatchPostBody) => {
    const result = await db
      .update(posts)
      .set(dataToUpdate)
      .where(eq(posts.id, postId))
      .returning();
    return result[0] ?? null;
  },
  deletePost: async (id: number) => {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result[0] ?? null;
  },
};
export { PostRepository };
