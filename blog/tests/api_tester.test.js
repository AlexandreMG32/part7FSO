const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const listHelper = require("../utils/list_helper");

const Blog = require("../models/blog");
const User = require("../models/user");
let token = "";

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  let user = {
    username: "teste",
    name: "teste",
    password: "teste",
  };

  const userResponse = await api.post("/api/users").send(user);
  const response = await api
    .post("/api/login")
    .send({ username: user.username, password: user.password });
  token = response.body.token;

  let blog = new Blog(listHelper.blogs[0]);
  blog.user = userResponse.id;
  await blog.save();
  blog = new Blog(listHelper.blogs[1]);
  blog.user = userResponse.id;
  await blog.save();
});

test("notes are JSON type", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("returns all notes", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(2);
});

test("has an id field", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("is correctly saved to the database", async () => {
  await api
    .post("/api/blogs")
    .set("Authorization", "bearer " + token)
    .send(listHelper.blogs[2])
    .expect(201);

  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(3);
  expect(response.body[2].title).toEqual("Canonical string reduction");
});

test("if there is no likes field it defaults to the value 0", async () => {
  const blog = {
    title: "test",
    author: "test",
    url: "test.com",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", "bearer " + token)
    .send(blog)
    .expect(201);

  const response = await api.get("/api/blogs");

  expect(response.body[2].likes).toEqual(0);
});

test("if there is no title or url property it gives a 400 bad request", async () => {
  const blog = {
    author: "test",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", "bearer " + token)
    .send(blog)
    .expect(400);
});

test("deleting a blog with correct id gives a 204 request and length is correct", async () => {
  await api
    .delete("/api/blogs/5a422a851b54a676234d17f7")
    .set("Authorization", "bearer " + token)
    .expect(204);

  const result = await api.get("/api/blogs");
  expect(result.body).toHaveLength(1);
});

test("deleting a blog with non existing id gives a 400 response and length is still the same", async () => {
  await api
    .delete("/api/blogs/5a422a851bjdankdjsa")
    .set("Authorization", "bearer " + token)
    .expect(400);

  const result = await api.get("/api/blogs");
  expect(result.body).toHaveLength(2);
});

test("updating likes of a blog", async () => {
  await api
    .put("/api/blogs/5a422a851b54a676234d17f7")
    .send({ likes: 10 })
    .expect(201);

  const result = await api.get("/api/blogs");
  expect(result.body[0].likes).toBe(10);
});

test("adding blog fails if not provided a token", async () => {
  const result = await api
    .post("/api/blogs")
    .send(listHelper.blogs[3])
    .expect(401);
});

afterAll(() => {
  mongoose.connection.close();
});
