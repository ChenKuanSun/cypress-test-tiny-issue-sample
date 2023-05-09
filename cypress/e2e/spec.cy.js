/// <reference types="cypress" />
describe("page", () => {
  const setup = () => {
    cy.intercept(
      {
        method: "*",
        url: "*",
      },
      (req) => {
        req.reply((res) => {
          res.body = {};
        });
      }
    );
    cy.intercept(
      {
        method: "GET",
        url: "*",
      },
      (req) => {
        req.reply((res) => {
          res.body = "intercepted api";
        });
      }
    ).as("getData");
  };

  it("visits the app", () => {
    cy.visit("https://main.d260hbq9idig9k.amplifyapp.com/");

    cy.get("#welcome h1").should("contain", "Welcome cypress-sample-page");
  });

  it("intercepts and changes the response", () => {
    setup();
    cy.get("#call-api").click();

    cy.get("#response pre").should("contain", "intercepted api");
    cy.get("#call-api").click();
  });

  it("intercept failed", () => {
    setup();
    cy.get("#call-api").click();
    cy.wait(5000);
  });
});
