import express from "express";
import "dotenv/config";
import auth from "./routes/auth.js";
import post from "./routes/post.js";
const app = express();

app.use(express.json());
app.use("/auth", auth);
app.use("/posts", post);
app.get("/", (req, res) => {
  res.send("Hey workin");
});

app.listen(3000, () => {
  console.log("Server is up and running");
});
