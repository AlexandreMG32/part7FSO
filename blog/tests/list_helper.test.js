const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(listHelper.blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("When there are multiple Blogs it adds the total of likes", () => {
    const result = listHelper.totalLikes(listHelper.blogs);
    expect(result).toBe(36);
  });
});

describe("favorite Blogs", () => {
  test("When there are multiple blogs, it gets the one with most likes", () => {
    const result = listHelper.favoriteBlog(listHelper.blogs);
    expect(result).toEqual(listHelper.blogs[2]);
  });
});

describe("most likes", () => {
  test("Gets the user with most likes and the number of likes", () => {
    const result = listHelper.mostLikes(listHelper.blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 });
  });

  describe("with most blogs posted", () => {
    test("Gets the user with most blogs posted", () => {
      const result = listHelper.mostBlogs(listHelper.blogs);
      expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
    });
  });
});
