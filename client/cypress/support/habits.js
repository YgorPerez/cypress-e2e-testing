// <reference types="cypress"/>

Cypress.Commands.add("clickAdd", () => {
  cy.contains("button", "Add").click();
});

Cypress.Commands.add("typeHabit", (habit) => {
  cy.get("input[placeholder='Habit']").type(`${habit}`);
});

Cypress.Commands.add("clickSave", () => {
  cy.contains("button", "Save Changes").click();
});

Cypress.Commands.add("addHabit", (habit) => {
  cy.clickAdd();
  cy.typeHabit(habit);
  cy.clickSave();
});

Cypress.Commands.add("getHabit", (habit) => {
  return cy.contains("div", habit);
});

Cypress.Commands.add("findImg", (habit) => {
  return cy.getHabit(habit).parent().find(".HabitCard__completion-icon");
});

Cypress.Commands.add("clickHabit", (habit) => {
  cy.getHabit(habit).click();
});
