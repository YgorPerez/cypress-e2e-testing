// <reference types="cypress" />

const randomString = (length) => {
  function makeId(lenght) {
    var text = "";
    var possible = "ABCDEZavyze1679!@#$%¨&*  ";
    for (var i = 1; i < lenght; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  var string = makeId(length).trim();
  return string.replace(/\s+/g, " ");
};

let testHabit = randomString(20);

beforeEach(() => {
  cy.visit("/habits");
  testHabit = randomString(20);
});

function clickAdd() {
  cy.contains("button", "Add").click();
}

function typeHabit(habit = habitText) {
  cy.get("input[placeholder='Habit']").type(`${habit}`);
}

function clickSubmit() {
  cy.contains("button", "Save Changes").click();
}

function addHabits({
  habit = testHabit,
  tot = 1,
  func = false,
  func2 = false,
}) {
  let habitText;
  let i;
  for (i = 1; i <= tot; i++) {
    habitText = `${habit} ${i}`;
    clickAdd();
    typeHabit(habitText);
    clickSubmit();
    if (func) {
      func({ habit: habitText, tot: tot, i: i });
    }
  }
  if (func2 && i > 1) {
    func2({ habit: `${habit} ${i - 2}`, tot: 1, i: i });
  }
}

function getHabit(habit) {
  return cy.contains("div", habit);
}

function findImg(habit) {
  return getHabit(habit).parent().find(".HabitCard__completion-icon");
}

function clickHabit(habit) {
  getHabit(habit).click();
}

function includesImg(img, habit) {
  findImg(habit)
    .should("be.visible")
    .and("have.attr", "src")
    .and("include", `${img}`);
}

function toggleChecker({ habit, tot = 1, close = true }) {
  for (let i = 1; i <= tot; i++) {
    for (let j = 1; j <= 3; j++) {
      close = !close;
      let img;
      close ? (img = "close") : (img = "check");
      clickHabit(habit);
      includesImg(img, habit);
    }
  }
}

function getHabitCount() {
  return cy.get(".HabitCard").its("length");
}
describe("Habit modal", () => {
  beforeEach(() => {
    clickAdd();
  });
  it("Should display modal when add button is clicked", () => {
    cy.contains("div", "Add a new habit").should("be.visible");
  });

  it("Should not add a habit if nothing was typed after pressing save", () => {
    clickSubmit();
    cy.get(".HabitCard").should("not.exist");
  });
  describe("Modal input", () => {
    it("Should display input field", () => {
      cy.get("input[placeholder='Habit']").should("be.visible");
    });

    it("Should start input field empty", () => {
      cy.get("input[placeholder='Habit']").should("have.value", "");
    });

    it("Should type into input field", () => {
      cy.get("input[placeholder='Habit']")
        .type(testHabit)
        .should("have.value", testHabit);
    });
  });

  describe("Should close modal", () => {
    afterEach("Modal should not exist", () => {
      cy.get(".Habit-header").contains("Habit Checklist").should("be.visible");
      cy.get('[placeholder="Habit"]').should("not.exist");
      cy.get(".HabitCard").should("not.exist");
    });

    it("Should close the modal if the x button is pressed", () => {
      cy.get('.close > [aria-hidden="true"]').click();
    });

    it("Should close the modal if the close button is pressed", () => {
      cy.get(".btn-secondary").contains("Close").click();
    });

    it("Should close the modal if the modal is pressed", () => {
      cy.get(".modal").click();
    });
  });
});

describe("habit dashboard", () => {
  it("Should display the a habit card on the list when new habit is added", () => {
    function assertions() {
      getHabit(testHabit)
        .should("be.visible")
        .and("have.class", "HabitCard__habit-container");
    }
    addHabits({ habit: testHabit, func: assertions });
  });
  it("Should display new habits with the close img", () => {
    addHabits({ habit: testHabit });
    includesImg("close", `${testHabit} 1`);
  });

  it("Should toggle bettween the habit card img", () => {
    addHabits({ func: toggleChecker, habit: testHabit });
  });
});

describe("Multiple habits", () => {
  it("Should have 5 habits if 5 habits were added", () => {
    function assertions({ i, habit = testHabit }) {
      getHabit(habit)
        .should("be.visible")
        .and("have.class", "HabitCard__habit-container");
      getHabitCount().should("eq", i);
    }
    addHabits({ tot: 5, func: assertions });
  });

  it("Should toggle the right habit if there are multiple", () => {
    addHabits({ tot: 4, func: toggleChecker, func2: toggleChecker });
  });
});
