import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { PostsRoute } from "./routes/posts.route";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:3000", // Frontend local (React แบบอื่น)
      "https://blueprint-app-zeta.vercel.app", // Frontend ที่ Deploy แล้ว
    ],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Blueprint Server" });
});

app.use("/api/posts", PostsRoute);

// รัน server เองเฉพาะ local / VPS — บน Vercel ใช้ handler ไม่ listen
if (!process.env.VERCEL) {
  const openApiPath = path.resolve(process.cwd(), "docs", "openapi.json");
  if (fs.existsSync(openApiPath)) {
    const openApiDocument = JSON.parse(fs.readFileSync(openApiPath, "utf8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  } else {
    console.warn("Swagger disabled: docs/openapi.json not found");
  }

  app.listen(port, () => {
    console.log("--------------------------------");
    console.log("Server is running on port: ", port);
    console.log(`Server is running at http://localhost:${port}`);
    console.log("--------------------------------");
  });
}

// Vercel: ต้องมี `module.exports = app` — ใช้ `export =` แทน `export default` ให้ tsc ออกแบบ CJS ตรงกับ @vercel/node
export = app;
