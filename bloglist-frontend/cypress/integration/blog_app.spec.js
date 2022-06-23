describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users", {
      username: "teste",
      password: "teste",
      name: "teste",
    });
    cy.visit("http://localhost:3000");
  });

  it("Login Form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeds with correct credentials", function () {
      cy.get("#username").type("teste");
      cy.get("#password").type("teste");
      cy.get("#login-button").click();
      cy.get(".success").should("contain", "Logged In Successfully");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("teste");
      cy.get("#password").type("teste1");
      cy.get("#login-button").click();
      cy.get(".error").should("contain", "Invalid username or password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "teste", password: "teste" });
    });

    it("A blog can be created", function () {
      cy.get("#toggle-blog-form").click();
      cy.get("input[name='title']").type("Teste");
      cy.get("input[name='author']").type("teste");
      cy.get("input[name='url']").type("teste.com");
      cy.get("#submit-form").click();
      cy.get("#submit-form").click(); // Dont know why, the first click does not work if its the first blog being created
      cy.contains("Teste added");
    });
  });

  describe("When blog is created", function () {
    beforeEach(function () {
      cy.login({ username: "teste", password: "teste" });
      cy.createBlog({ title: "teste2", author: "teste2", url: "teste2.com" });
    });

    it("A blog can be liked", function () {
      cy.get(".view-details-button").click();
      cy.get(".like-button").click();
      cy.contains("likes 1");
    });
  });
});
