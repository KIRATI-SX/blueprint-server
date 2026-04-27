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


if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log("--------------------------------");
    console.log("Server is running on port: ", port);
    console.log(`Server is running at http://localhost:${port}`);
    console.log("--------------------------------");
  });
}
