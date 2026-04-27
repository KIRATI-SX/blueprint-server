"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const PostService = {
    getAllPosts: async () => {
        const result = await posts_repository_1.PostRepository.getAllPosts();
        return result;
    },
    getPostById: async (id) => {
        const result = await posts_repository_1.PostRepository.getPostById(id);
        return result;
    },
};
exports.PostService = PostService;
//# sourceMappingURL=posts.service.js.map