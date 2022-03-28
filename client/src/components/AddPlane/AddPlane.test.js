import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";
import AddPlane from "./AddPlane";

describe("AddPlane testing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AddPlane />);
  });

  it("should contain Button component", () => {
    expect(wrapper.find("Button")).toHaveLength(1);
  });
});
