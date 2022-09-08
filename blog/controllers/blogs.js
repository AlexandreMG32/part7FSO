require("express-async-errors");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (req, res, next) => {
  const blog = new Blog(req.body);

  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  blog.user = user;
  user.blogs = user.blogs.concat(blog);
  await user.save();
  const result = await blog.save();
  return res.status(201).json(result);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  const blog = await Blog.findById(id);
  if (blog.user.toString() !== user.id.toString()) {
    return res
      .status(401)
      .json({ error: "You dont have permission to delete this blog" });
  }

  await Blog.findByIdAndRemove(id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const blog = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  res.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
