import { Router } from "express";
import { publicPosts, privatePosts } from "../db.js";
import checkAuth from "../middleware/checkAuth.js";
const router = Router();

router.get("/public", async (req, res) => {
  res.json(publicPosts);
});

router.get("/private", checkAuth, async (req, res) => {
  return res.json(privatePosts);
});
export default router;
