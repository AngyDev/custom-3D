import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";

import Button from "./Button";

describe("Button component", () => {
  test("Renders the button component without crashing", () => {
    render(<Button />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("Renders the button with props", () => {
    render(<Button text="Click" type="button" disabled={true} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Click");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("Renders the button with image", () => {
    render(<Button text="Click" type="button" img="img" title="image" />);

    const image = screen.getByAltText("image");

    expect(image).toHaveAttribute("src", "img");
  });

  test("matches snapshot", () => {
    const tree = renderer.create(<Button text="Click" type="button" img="img" title="image" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
