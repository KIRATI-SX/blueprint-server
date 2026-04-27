import { Request, Response } from "express";
import { PostService } from "../services/posts.service";


const PostController = {
  getAllPosts: async (_req: Request, res: Response) => {
    try {
      const posts = await PostService.getAllPosts();
      return res.status(200).json(posts);
    }catch (error) {
      console.error("Failed to fetch posts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPostById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const post = await PostService.getPostById(id as string);
      return res.status(200).json(post);
    }catch (error) {
      console.error("Failed to fetch post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
}
export { PostController };
