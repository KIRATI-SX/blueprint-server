import { PostRepository } from "../repositories/posts.repository";
import {
  CreatePostBody,
  GetPostsQuery,
  PatchPostPayload,
  UpdatePostPayload,
} from "../types/posts.types";

const PostService = {
  createPost: async (postData: CreatePostBody) => {
    const result = await PostRepository.createPost(postData);
    return result;
  },
  getAllPosts: async (query: GetPostsQuery) => {
    const result = await PostRepository.getAllPosts(query);
    return result;
  },
  getPostById: async (id: number) => {
    const result = await PostRepository.getPostById(id);
    return result;
  },
  updatePost: async ({ postId, body }: UpdatePostPayload) => {
    try {
      const result = await PostRepository.updatePost(postId, body);
      return result;
    } catch (error) {
      console.error("Failed to update post:", error);
      throw new Error("Failed to update post");
    }
  },
  patchPost: async ({ postId, body }: PatchPostPayload) => {
    try {
      const result = await PostRepository.patchPost(postId, body);
      return result;
    } catch (error) {
      console.error("Failed to patch post:", error);
      throw new Error("Failed to patch post");
    }
  },
  deletePost: async (id: number) => {
    const result = await PostRepository.deletePost(id);
    return result;
  },
};
export { PostService };
