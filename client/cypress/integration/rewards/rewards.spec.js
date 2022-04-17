/// <reference types="cypress" />

function changeSelect(month) {
  cy.get("select").select(month);
}

describe("Rewards dashboard", () => {
  beforeEach(() => {
    cy.visit("/rewards");
  });

  it("Sould display a list of rewards", () => {
  });

  it("Should display a list of rewards with mock", () => {
    cy.intercept("GET", "https://localhost:4000/rewards", {
      fixture: "rewards.json",
    }).as("getRewards");
  });

  it("Should only appear march data when the select option is march", () => {});
});
