import { render, screen } from "@testing-library/react";
import { BlueprintEditorPage } from "../BlueprintEditorPage";

describe("BlueprintEditorPage", () => {
  it("renders the blueprint editor scaffold", () => {
    render(<BlueprintEditorPage />);

    expect(screen.getByText("Blueprint Editor")).toBeInTheDocument();
    expect(screen.getByText("Collect Inputs")).toBeInTheDocument();
  });
});
