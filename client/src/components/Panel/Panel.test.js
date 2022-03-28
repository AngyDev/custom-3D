import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";
import Panel from "./Panel";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

describe("Panel testing", () => {
  let wrapper;
  beforeEach(() => {
    const initialState = {
      scene: {
        scene: {},
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <Panel />
      </Provider>,
    );
  });

  it("should contain Panel text", () => {
    expect(wrapper.find(".panel")).toHaveLength(1);
  });
});
