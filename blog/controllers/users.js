const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
  const result = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  res.json(result);
});

usersRouter.get("/:id", async (req, res, next) => {
  const result = await User.findById(req.params.id).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  res.json(result);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: "username must be unique",
    });
  }

  if (!password) {
    return res.status(400).json({
      error: "Password is required",
    });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: "Password must be at least 3 characters",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
