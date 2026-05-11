import { render, screen } from "@testing-library/react";
import { SessionStartPage } from "../SessionStartPage";

describe("SessionStartPage", () => {
  it("renders the session launcher scaffold", () => {
    render(<SessionStartPage />);

    expect(screen.getByText("Generation Session Launcher")).toBeInTheDocument();
  });
});
