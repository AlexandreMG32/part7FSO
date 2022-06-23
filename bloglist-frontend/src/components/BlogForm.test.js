import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("BlogForm updates parent state and calls onSubmit", async () => {
  const addBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm addBlog={addBlog} />);
  const titleInput = screen.getByPlaceholderText("Title");
  const authorInput = screen.getByPlaceholderText("Author");
  const urlInput = screen.getByPlaceholderText("Url");

  const saveButton = screen.getByText("Create");

  await user.type(titleInput, "teste");
  await user.type(authorInput, "teste");
  await user.type(urlInput, "teste.com");
  await user.click(saveButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0].title).toBe("teste");
  expect(addBlog.mock.calls[0][0].author).toBe("teste");
  expect(addBlog.mock.calls[0][0].url).toBe("teste.com");
});
