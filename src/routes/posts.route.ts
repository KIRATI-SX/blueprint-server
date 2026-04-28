import { Router } from "express";
import { PostController } from "../controllers/posts.controller";
import { PostMiddleware } from "../middleware/posts.middleware";

export const PostsRoute = Router();

PostsRoute.get("/", [PostMiddleware.validateGetPostsQuery], PostController.getAllPosts);
PostsRoute.get(
  "/:postId",
  [PostMiddleware.validatePostId],
  PostController.getPostById,
);

PostsRoute.post("/", [PostMiddleware.validateCreatePostData], PostController.createPost);

PostsRoute.put(
  "/:postId",
  [PostMiddleware.validatePostId, PostMiddleware.validatePostData],
  PostController.updatePost,
);
PostsRoute.patch(
  "/:postId",
  [PostMiddleware.validatePostId, PostMiddleware.validatePatchPostData],
  PostController.patchPost,
);

PostsRoute.delete(
  "/:postId",
  [PostMiddleware.validatePostId],
  PostController.deletePost,
);



export default PostsRoute;
