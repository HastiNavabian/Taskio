import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Column from "./Column";

describe("Column", () => {
  const noop = () => {};

  it("does not call onAddTask when the title is empty", async () => {
    const handleAddTask = vi.fn();

    render(
      <Column
        title="Today"
        status="today"
        tasks={[]}
        onAddTask={handleAddTask}
        onDelete={noop}
        onToggleCompleted={noop}
        onDueDateChange={noop}
      />,
    );

    await userEvent.click(screen.getByText("⋯"));
    await userEvent.click(screen.getByText("Add card"));
    await userEvent.click(screen.getByText("Add"));

    expect(handleAddTask).not.toHaveBeenCalled();
  });

  it("calls onAddTask with the typed title when submitted", async () => {
    const handleAddTask = vi.fn();

    render(
      <Column
        title="Today"
        status="today"
        tasks={[]}
        onAddTask={handleAddTask}
        onDelete={noop}
        onToggleCompleted={noop}
        onDueDateChange={noop}
      />,
    );

    await userEvent.click(screen.getByText("⋯"));
    await userEvent.click(screen.getByText("Add card"));

    const input = screen.getByPlaceholderText("Task title");
    await userEvent.type(input, "Buy milk");
    await userEvent.click(screen.getByText("Add"));

    expect(handleAddTask).toHaveBeenCalledWith("Buy milk", "today", false);
  });
});
