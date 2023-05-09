/// <reference types="cypress" />

/**
 * Before each test, we are mocking all the API call and change the response.
 * But if there is a api call in the background like something service,
 * the intercept will fail due to Cypress's netStubbingState reset.
 *
 * Note: we are disabling the testIsolation to keep context between tests.
 */
describe("Situations where intercept fails in our app", () => {
  const setup = (delayTime = 0) => {
    // Initial Cypress Commands takes sometime.
    cy.wait(delayTime);
    // Intercept the API call
    cy.intercept(
      {
        pathname: "/",
        method: "GET",
      },
      (req) => {
        req.reply({
          statusCode: 200,
          body: JSON.stringify("intercepted api"),
        });
      }
    ).as("getData");
  };

  it("visits the app", () => {
    // Visit the app
    cy.visit("https://main.d260hbq9idig9k.amplifyapp.com/");

    // Check if the app is loaded
    cy.get("#welcome h1").should("contain", "Welcome cypress-sample-page");
  });

  it("intercepts and changes the response", () => {
    // Setup the test
    setup();

    // Click the button to call the API
    cy.get("#call-api").click();

    // Wait for the API call to complete
    cy.wait(["@getData"]);

    // Check if the response is intercepted
    cy.get("#response pre").should("contain", "intercepted api");

    // Call the API again but we don't wait for the response
    cy.get("#call-api-delay-1-second").click();

    // Then end the test immediately
  });

  it("intercept failed", () => {
    // Setup the test
    setup(
      1500 // Wait for 1.5 seconds to make sure the previous API call is emited
    );

    // Click the button to call the API check if the response is intercepted
    cy.get("#call-api").click();

    // Wait for the API call to complete
    cy.wait(["@getData"]);

    // Set wait time to 3 seconds make sure the all API call is completed
    cy.wait(3000);

    cy.get("#response pre").should("not.contain", "Hello from server!");
  });
});
