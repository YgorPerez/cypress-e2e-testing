// reference types="cypress"

describe("Locator", () => {
  beforeEach(() => {
    cy.visit("/elements");
  });

  it("Locating elements with get", () => {
    // get all elements by role
    cy.get("button");

    cy.get(".btn-with-class");

    cy.get("[class='Elements-btn btn-with-class']");

    cy.get("[type='submit']");

    cy.get("[type='submit'].Elements-btn");

    cy.get("[data-cy='btn-id-1']");

    cy.getByTestId("btn-id-1");
  });

  it("Locating elements with contains", () => {
    cy.contains(/contains/i);

    cy.contains("Not Unique Text");

    cy.contains("[type='submit']", "Not Unique Text");

    cy.get("[type='submit']").contains("Not Unique Text");

    cy.contains("form", "Not Unique Text");
  });
  it("Locating elements with find", () => {
    cy.get("#form-1").find(".btn-1");
    cy.get("#form-1").find(".btn-2");
  });
});
