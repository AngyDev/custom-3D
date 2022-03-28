import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";
import Main from "./Main";

describe("Main testing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Main />);
  });

  it("should contain Main text", () => {
    expect(wrapper.find("h1").text()).toContain("Main");
  });

  // it('should contain Profile component', () => {
  //     expect(wrapper.find('Profile')).toHaveLength(1);
  // });
});
