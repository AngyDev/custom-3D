import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";

import Import from "./Import";

describe("Import testing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Import text="Click" />);
  });

  it("should contain Import text", () => {
    expect(wrapper.find("label").text()).toContain("Import");
  });
});
