import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useState } from "react";
import Column from "./Column";
import SearchInput from "./SearchInput";
import useSearchStore from "../../../store/searchStore";
import useTasks from "../../../features/tasks/hooks/useTasks";
import { useTheme } from "../../../context/ThemeContext";

function BoardView({ user, signOut }) {
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    isLoading,
    error,
    moveTask,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    updateTaskDueDate,
  } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const [activeTask, setActiveTask] = useState(null);

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  }

  function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const destination = over.id;

    if (destination === "completed") {
      const currentTask = tasks.find((t) => t.id === taskId);
      moveTask(taskId, currentTask.status, true);
    } else {
      moveTask(taskId, destination, false);
    }
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const todayTasks = filteredTasks.filter(
    (task) => task.status === "today" && !task.completed,
  );
  const thisWeekTasks = filteredTasks.filter(
    (task) => task.status === "this-week" && !task.completed,
  );
  const completedTasks = filteredTasks.filter((task) => task.completed);

  if (isLoading) {
    return <p className="status-message">Loading...</p>;
  }
  if (error) {
    return (
      <p className="status-message status-error">Error: {error.message}</p>
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-brand">Taskio</div>
        <div className="app-header-search">
          <SearchInput />
        </div>
        <div className="app-header-actions">
          <button type="button" className="icon-button" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button type="button" className="icon-button" onClick={signOut}>
            🚪
          </button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <Column
            title="Today"
            status="today"
            tasks={todayTasks}
            onAddTask={addTask}
            onDelete={deleteTask}
            onToggleCompleted={toggleTaskCompleted}
            onDueDateChange={updateTaskDueDate}
          />
          <Column
            title="This Week"
            status="this-week"
            tasks={thisWeekTasks}
            onAddTask={addTask}
            onDelete={deleteTask}
            onToggleCompleted={toggleTaskCompleted}
            onDueDateChange={updateTaskDueDate}
          />
          <Column
            title="Completed"
            status="completed"
            tasks={completedTasks}
            onAddTask={addTask}
            onDelete={deleteTask}
            onToggleCompleted={toggleTaskCompleted}
            onDueDateChange={updateTaskDueDate}
          />
        </div>
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="task-card task-card-overlay">
              <div className="task-card-header">
                <input
                  type="checkbox"
                  checked={activeTask.completed}
                  readOnly
                />
                <span className="task-title">{activeTask.title}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default BoardView;
