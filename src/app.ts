import "dotenv/config";
import express from "express";
import cors from "cors";
import { PostsRoute } from "./routes/posts.route";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors(

));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Blueprint Server" });
});





app.use("/api/posts", PostsRoute);

// รัน server เองเฉพาะ local / VPS — บน Vercel ใช้ handler ไม่ listen
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log("--------------------------------");
    console.log("Server is running on port: ", port);
    console.log(`Server is running at http://localhost:${port}`);
    console.log("--------------------------------");
  });
}

// Vercel: ต้องมี `module.exports = app` — ใช้ `export =` แทน `export default` ให้ tsc ออกแบบ CJS ตรงกับ @vercel/node
export = app;
