import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Devices navigation", () => {
  render(<App />);
  const navButton = screen.getByRole("button", { name: /devices/i });
  expect(navButton).toBeInTheDocument();
});
