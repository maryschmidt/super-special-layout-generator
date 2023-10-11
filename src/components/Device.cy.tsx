import Device from "./Device";

describe("<Device />", () => {
  it("renders with the correct grid col span", () => {
    cy.mount(<Device backgroundColor="aliceblue" widthFt={40} />);
    cy.get('[data-cy="device"]').should(
      "have.css",
      "grid-column-end",
      "span 4"
    );
  });
});
