"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const supabase_1 = __importDefault(require("../db/supabase"));
const PostRepository = {
    getAllPosts: async () => {
        const result = await supabase_1.default.query("SELECT * FROM posts");
        return result.rows;
    },
    getPostById: async (id) => {
        const result = await supabase_1.default.query("SELECT * FROM posts WHERE id = $1", [id]);
        return result.rows[0];
    },
};
exports.PostRepository = PostRepository;
//# sourceMappingURL=posts.repository.js.map