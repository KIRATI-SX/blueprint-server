"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const posts_service_1 = require("../services/posts.service");
const PostController = {
    getAllPosts: async (_req, res) => {
        try {
            const posts = await posts_service_1.PostService.getAllPosts();
            return res.status(200).json(posts);
        }
        catch (error) {
            console.error("Failed to fetch posts:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    getPostById: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await posts_service_1.PostService.getPostById(id);
            return res.status(200).json(post);
        }
        catch (error) {
            console.error("Failed to fetch post:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
};
exports.PostController = PostController;
//# sourceMappingURL=posts.controller.js.map