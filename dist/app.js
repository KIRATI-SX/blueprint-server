"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const posts_route_1 = require("./routes/posts.route");
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Blueprint Server" });
});
app.use("/api/posts", posts_route_1.PostsRoute);
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log("--------------------------------");
        console.log("Server is running on port: ", port);
        console.log(`Server is running at http://localhost:${port}`);
        console.log("--------------------------------");
    });
}
//# sourceMappingURL=app.js.map