import { render, screen } from "@testing-library/react";
import { WorkspaceSetupPage } from "../WorkspaceSetupPage";

describe("WorkspaceSetupPage", () => {
  it("renders the workspace setup scaffold", () => {
    render(<WorkspaceSetupPage />);

    expect(screen.getByText("Workspace Setup Scaffold")).toBeInTheDocument();
    expect(screen.getByText("Save Workspace Draft")).toBeInTheDocument();
  });
});
