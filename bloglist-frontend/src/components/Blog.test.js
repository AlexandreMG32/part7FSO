import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;

  beforeEach(() => {
    const user = {
      name: "teste",
      username: "teste",
      token: "teste",
    };

    const blog = {
      title: "Component testing",
      author: "TestAuthor",
      likes: 0,
      url: "teste.com",
      user: user,
    };

    container = render(<Blog blog={blog} user={user} />).container;
  });

  test("renders title and author and doesnt render likes and url", () => {
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("Component testing");
    expect(div).toHaveTextContent("TestAuthor");
    expect(div).not.toHaveTextContent("likes: 0");
    expect(div).not.toHaveTextContent("teste.com");
  });

  test("renders title, author, likes and url", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("likes 0");
    expect(div).toHaveTextContent("teste.com");
  });
});

test("Like blog 2 times event handler called twice", async () => {
  const userBlog = {
    name: "teste",
    username: "teste",
    token: "teste",
  };

  const blog = {
    title: "Component testing",
    author: "TestAuthor",
    likes: 0,
    url: "teste.com",
    user: userBlog,
  };
  const like = jest.fn();
  const user = userEvent.setup();
  render(<Blog blog={blog} user={userBlog} like={like} />);

  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(like.mock.calls).toHaveLength(2);
});
