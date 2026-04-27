import { Router } from "express";
import { PostController } from "../controllers/posts.controller";

export const PostsRoute = Router();

PostsRoute.get("/", PostController.getAllPosts);
PostsRoute.get("/:id", PostController.getPostById);