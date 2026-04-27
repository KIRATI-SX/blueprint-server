
import { PostRepository } from "../repositories/posts.repository";

const PostService = {
  getAllPosts: async () => {
    const result = await PostRepository.getAllPosts();
    return result;
  },
  getPostById: async (id: string) => {
    const result = await PostRepository.getPostById(id);
    return result;
  },
}
export { PostService };
