import { Request, Response } from "express";
declare const PostController: {
    getAllPosts: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export { PostController };
//# sourceMappingURL=posts.controller.d.ts.map