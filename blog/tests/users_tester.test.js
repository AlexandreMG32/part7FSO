const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const helper = require("../utils/users_helper");

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  let user = new User(helper.users[0]);
  await user.save();
  user = new User(helper.users[1]);
  await user.save();
});

test("there is two users inserted", async () => {
  const result = await api.get("/api/users");

  expect(result.body).toHaveLength(2);
});

test("new user without password is not inserted", async () => {
  const result = await api
    .post("/api/users")
    .send({ username: "teste", name: "teste" })
    .expect(400);

  expect(result.body.error).toEqual("Password is required");
});

test("new user with password length < 3 is not inserted", async () => {
  const result = await api
    .post("/api/users")
    .send({ username: "teste", name: "teste", password: "t" })
    .expect(400);

  expect(result.body.error).toEqual("Password must be at least 3 characters");
});

afterAll(() => {
  mongoose.connection.close();
});
