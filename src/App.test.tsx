import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the app name", () => {
  render(<App />);
  const name = screen.getByText(/contactful/i);
  expect(name).toBeInTheDocument();
});
