"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRoute = void 0;
const express_1 = require("express");
const posts_controller_1 = require("../controllers/posts.controller");
exports.PostsRoute = (0, express_1.Router)();
exports.PostsRoute.get("/", posts_controller_1.PostController.getAllPosts);
exports.PostsRoute.get("/:id", posts_controller_1.PostController.getPostById);
//# sourceMappingURL=posts.route.js.map