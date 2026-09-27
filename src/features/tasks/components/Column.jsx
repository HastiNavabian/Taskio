import TaskCard from "./TaskCard";
import Button from "./Button";
import { useEffect, useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";

function Column({
  title,
  tasks,
  status,
  categories,
  onStatusChange,
  onAddTask,
  onDelete,
  onToggleCompleted,
  onDueDateChange,
  onTitleChange,
  onCategoryChange,
  isAdding,
  onStartAdding,
  onStopAdding,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const formRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onStopAdding();
      }
    }
    if (isAdding) {
      document.addEventListener("pointerdown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [isAdding, onStopAdding]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newTitle.trim() === "") return;
    if (status === "completed") {
      onAddTask(newTitle, "today", true);
    } else {
      onAddTask(newTitle, status, false);
    }
    setNewTitle("");
    onStopAdding();
  }
  return (
    <div
      ref={setNodeRef}
      className={`column ${isOver ? "column-drag-over" : ""}`}
    >
      <div className="column-header">
        <h2 className="column-title">
          {title} <span className="task-count">{tasks.length}</span>
        </h2>
      </div>

      <button
        type="button"
        className="add-task-btn"
        onPointerUp={() => onStartAdding()}
      >
        <span className="add-task-icon">+</span> Add task
      </button>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          status={task.status}
          completed={task.completed}
          categoryId={task.categoryId}
          categories={categories}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onToggleCompleted={onToggleCompleted}
          onDueDateChange={onDueDateChange}
          dueDate={task.dueDate}
          onTitleChange={onTitleChange}
          onCategoryChange={onCategoryChange}
        />
      ))}
      {tasks.length === 0 && !isAdding && (
        <p className="column-empty">No tasks yet</p>
      )}
      {isAdding && (
        <form onSubmit={handleSubmit} ref={formRef}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <div>
            <Button type="submit">Add</Button>
            <Button variant="secondary" onClick={() => onStopAdding()}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
export default Column;
