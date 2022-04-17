/// <reference types="cypress" />

function getLink(link) {
  return cy.get(".SideNav").find("a").contains(link);
}

function clickLink(link) {
  getLink(link).click();
}

function includeUrl(link) {
  let linkName = link.toLowerCase();
  cy.url().should("include", `/${linkName}`);
}

function assertLink(link) {
    getLink(link).should("be.visible");
    clickLink(link);
    includeUrl(link);
}

describe("Sidebar links", () => {
  beforeEach("visit the home page", () => {
    cy.visit("/");
  });

  afterEach(() => {
    assertLink(link);
  });
  let link = it("Should be able to click on the habits link", () => {
    link = "Habit";
  });

  link = it("Should be able to click on the accomplishments link", () => {
    link = "Accomplishment";
  });

    link = it("Should be able to click on the Rewards link", () => {
      link = "Rewards";
    });

    link = it("Should be able to click links in another pages", () => {
      assertLink("Habit");
      assertLink("Rewards");
      assertLink("Accomplishment");
      assertLink("Rewards");
      assertLink("Habit");
      assertLink("Accomplishment");
      link = "Rewards"
    })
});
