import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";

import Button from "./Button";

describe("Button testing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Button text="Click" />);
  });

  it("should contain Button text", () => {
    expect(wrapper.find("button").text()).toContain("Click");
  });
});
