import React from "react";
import "@testing-library/jest-dom";
import { mount } from "enzyme";
import PanelItem from "./PanelItem";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

describe("PanelItem testing", () => {
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
        <PanelItem />
      </Provider>,
    );
  });

  it("should contain option class", () => {
    expect(wrapper.find(".option")).toHaveLength(1);
  });
});
