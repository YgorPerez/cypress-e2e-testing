// <reference types="cypress" />

const { get } = require("https");

beforeEach(() => {
  cy.visit("/accomplishments");
});

function clickSubmit() {
  cy.get(".Accomplishment-btn").contains("Submit Accomplishment").click();
}

function addTitle(title) {
  cy.get("input[placeholder='Title']").type(`${title}`);
}

function addDescription(description) {
  cy.get("[data-cy=accomplishment-input]").type(description);
}

function chechCheckbox() {
  cy.get("[data-cy=accomplishment-checkbox]").click();
}

function addAccomplishment(
  title = "new acomplishment",
  description = "new description",
  checkbox = true
) {
  if (title !== "") addTitle(title);

  if (description !== "") addDescription(description);

  if (checkbox) chechCheckbox();

  clickSubmit();
}

function getError(msg) {
  return cy.get(".Accomplishment-error-container > p").contains(msg);
}

describe("Accomplishment dashboard", () => {
  it("Should be able to add a new accomplishment", () => {
    addAccomplishment();
    cy.get("[data-cy=accomplishment-input]").should("not.exist");
    cy.get("[data-cy=accomplishment-checkbox]").should("not.exist");
    cy.get(".Accomplishment-btn")
      .contains("Submit Accomplishment")
      .should("not.exist");
    cy.get("h1")
      .contains("This Accomplisment was Successfully Submitted")
      .should("be.visible");
  });
  describe("Should be empty", () => {
    afterEach(() => {
      cy.get("[data-cy=accomplishment-input]").should("have.value", "");
      cy.get("input[placeholder='Title']").should("have.value", "");
      cy.get("[data-cy=accomplishment-checkbox]").should("not.be.checked", "");
      cy.get(".Accomplishment-error-container").should("not.exist");
    });

    it("Should render with an empty form", () => {});

    it("Should return with an empty form after adding and clicking go back", () => {
      addAccomplishment();
      cy.get(".Accomplishment-btn").contains("Go Back").click();
    });
  });
  describe("Should give error messages", () => {
    afterEach(() => {
      cy.get("h1").should("not.exist");
    });

    describe("Should give error messages on aproppriate posts", () => {
      afterEach(() => {
        getError("Complete the items above to continue").should("be.visible");
      });
      it("Should give title error when there is no title", () => {
        addAccomplishment("", "new description");
      });

      it("Should give description error when there is no description", () => {
        addAccomplishment("Super title", "");
      });

      it("Should give checkbox error when there is no checkbox", () => {
        addAccomplishment("Super title", "new description", false);
      });

      it("Should give error when nothing is filled ", () => {
        addAccomplishment("", "", false);
      });
    });

    describe("Inappropriate content", () => {
      afterEach(() => {
        getError("Your content is not appropriate").should("be.visible");
      });
      it("Should display inappropriate content error message when description contains inapproriate words with mock", () => {
        cy.intercept("POST", "https://localhost:4000/accomplishments", {
          fixtures: "accomplishment",
        }).as("handleContent");
        //   (req) => {
        //     req.reply((res) => {
        //       res.send({
        //         msg: "Your content is not approriate",
        //       });
        //     });
        // }
        addAccomplishment("Cool accomplishment", "giraffe");
      });
      it("Should display inappropriate content error message when description contains inapproriate words", () => {
        addAccomplishment("Cool accomplishment", "giraffe");
      });
    });
  });
});
