import connectionPool from "../db/supabase";

const PostRepository = {
    getAllPosts: async () => {
        const result = await connectionPool.query("SELECT * FROM posts");
        return result.rows;
    },
    getPostById: async (id: string) => {
        const result = await connectionPool.query("SELECT * FROM posts WHERE id = $1", [id]);
        return result.rows[0];
    },
}
export { PostRepository };