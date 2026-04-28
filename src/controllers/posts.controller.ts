import { Request, Response } from "express";
import { PostService } from "../services/posts.service";
import {
  CreatePostBody,
  GetPostsQuery,
  PatchPostBody,
  UpdatePostBody,
} from "../types/posts.types";

const PostController = {

  createPost: async (req: Request, res: Response) => {
    try {
      const postData = (res.locals.createPostData ?? req.body) as CreatePostBody;
      const post = await PostService.createPost(postData);
      return res.status(201).json(post);
    } catch (error) {
      console.error("Failed to create post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllPosts: async (_req: Request, res: Response) => {
    try {
      const query = (res.locals.getPostsQuery ?? {
        page: 1,
        limit: 6,
      }) as GetPostsQuery;
      const result = await PostService.getAllPosts(query);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPostById: async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const post = await PostService.getPostById(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "Server could not find a requested post" });
      }
      return res.status(200).json(post);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      return res
        .status(500)
        .json({
          message: "Server could not read post because database connection",
        });
    }
  },
  updatePost: async (req: Request, res: Response) => {
    try {
      const postId = (res.locals.postId ?? Number(req.params.postId)) as number;
      const postData = (res.locals.postData ?? req.body) as UpdatePostBody;
      const post = await PostService.updatePost({
        postId,
        body: postData,
      });
      if (!post) {
        return res
          .status(404)
          .json({ message: "Server could not find a requested post" });
      }
      return res.status(200).json(post);
    } catch (error) {
      console.error("Failed to update post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  patchPost: async (req: Request, res: Response) => {
    try {
      const postId = (res.locals.postId ?? Number(req.params.postId)) as number;
      const postData = (res.locals.patchPostData ?? req.body) as PatchPostBody;
      const post = await PostService.patchPost({
        postId,
        body: postData,
      });
      if (!post) {
        return res
          .status(404)
          .json({ message: "Server could not find a requested post" });
      }
      return res.status(200).json(post);
    } catch (error) {
      console.error("Failed to patch post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deletePost: async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.postId);
      const post = await PostService.deletePost(postId);
      if (!post) {
        return res
          .status(404)
          .json({ message: "Server could not find a requested post" });
      }
      return res.status(200).json(post);
    } catch (error) {
      console.error("Failed to delete post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export { PostController };
