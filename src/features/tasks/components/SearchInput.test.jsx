import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";
import useSearchStore from "../../../store/searchStore";
import { beforeEach } from "vitest";

describe("SearchInput", () => {
  beforeEach(() => {
    useSearchStore.setState({ searchTerm: "" });
  });
  it("renders with an empty value by default", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search tasks")).toHaveValue("");
  });

  it("updates the Zustand store when the user types", async () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText("Search tasks");

    await userEvent.type(input, "milk");

    expect(useSearchStore.getState().searchTerm).toBe("milk");
  });
});
