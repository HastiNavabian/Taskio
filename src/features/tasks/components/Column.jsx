import TaskCard from "./TaskCard";
import Button from "./Button";
import { useEffect, useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";

function Column({
  title,
  tasks,
  status,
  onStatusChange,
  onAddTask,
  onDelete,
  onToggleCompleted,
  onDueDateChange,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

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
    setIsAdding(false);
  }
  return (
    <div
      ref={setNodeRef}
      className={`column ${isOver ? "column-drag-over" : ""}`}
    >
      <div className="column-header">
        <h2>
          {title}

          <span className="task-count">{tasks.length}</span>
        </h2>
        <button
          type="button"
          ref={triggerRef}
          className="column-menu-trigger"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ⋯
        </button>
      </div>

      {menuOpen && (
        <div className="column-menu" ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              setIsAdding(true);
              setMenuOpen(false);
            }}
          >
            Add card
          </button>
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          status={task.status}
          completed={task.completed}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onToggleCompleted={onToggleCompleted}
          onDueDateChange={onDueDateChange}
          dueDate={task.dueDate}
        />
      ))}
      {tasks.length === 0 && !isAdding && (
        <p className="column-empty">No tasks yet</p>
      )}
      {isAdding && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <div>
            <Button type="submit">Add</Button>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
export default Column;
