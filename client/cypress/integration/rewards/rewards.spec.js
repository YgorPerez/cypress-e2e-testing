/// <reference types="cypress" />

function changeSelect(month) {
  cy.get("select").select(month);
}

function comapareDomObject(body) {
  cy.get("ul > li").should(($els) => {
    $els.toArray().map((el) => {
      if (body) {
        const elMonth = el.getAttribute("data-month");
        const elId = el.getAttribute("data-id");
        expect(el.innerText).to.deep.eq(body[elId - 1].reward);
        expect(elMonth).to.deep.eq(body[elId - 1].month);
      }
    });
  });
}

var columns = [];
for (var i = 0; i < 9; i++) {
  var key = i;
  columns[key] = {
    sortable: true,
    resizeable: true,
  };
}

function objectsEqual(o1, o2) {
  return (
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p])
  );
}

function arraysEqual(array1, array2) {
  return (
    array1.length === array2.length && array1.every((object, index) => objectsEqual(object, array2[index]))
  );
}

function getResponseByMonth(month = "All") {
  let responseList = [];
  cy.request("http://localhost:4000/rewards").then((response) => {
    expect(response.status).to.equal(200);
    for (var i = 0; i < response.body.lenght; i++) {
      responseList[i] = {
        id: i + 1,
        reward: response.body[i].reward,
        month: response.body[i].month,
      };
      if (i + 1 === response.body.lenght) {
        console.debug(responseList);
        return responseList;
      }
    }
  });
}

function getDomList() {
  let domList = [];
  cy.get("ul > li").each(($el, index, $list) => {
    let id = Number($el.attr("data-id"));
    let reward = $el.text();
    let month = $el.attr("data-month");
    domList[$el.attr("data-id") - 1] = {
      id: id,
      reward: reward,
      month: month,
    };
    if (index == $list.length - 1) {
      return domList
    }
    console.warn(domList)
  });
  console.warn(domList);
}

function responseEqualDomList(domList, responseList) {
  expect(arraysEqual(domList, responseList)).to.be.true;
}

describe("Rewards dashboard", () => {
  beforeEach(() => {
    cy.visit("/rewards");
  });

  it("Should be the same content bettween the dom and the response", () => {
    const domList = getDomList();
    const responseList = getResponseByMonth();
    expect(arraysEqual(domList, responseList)).to.be.true;
  });
  
  describe("Should display rewards", () => {
    it("Sould display a list of rewards", () => {
      console.debug(getResponseByMonth());
      console.debug(getDomList());
      comapareDomObject();
    });

    it("Should display a list of rewards with mock", () => {
      cy.intercept("GET", "http://localhost:4000/rewards", (req) => {
        req.reply({
          statusCode: 200, // default
          fixture: "rewards.json",
        });
      }).as("getRewards");
      cy.wait("@getRewards").then((intercept) => {
        cy.wait(500);
        comapareDomObject(intercept.response.body);
      });
    });

    it("Should display response elements on the list", () => {
      cy.request("http://localhost:4000/rewards").then((response) => {
        expect(response.status).to.equal(200);
        cy.wait(500);
        comapareDomObject(response.body);
      });
    });
  });


  describe("Should render the right month ", () => {
    it("Should change months to the selected", () => {
      cy.get("select")
        .find("option")
        .each(($el, index, $list) => {
          let month = $el.text();
          changeSelect(month);
          cy.get("select")
            .find(":selected")
            .contains(month)
            .should("be.visible");
        });
    });
  });
});
