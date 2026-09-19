import { useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import Modal from "./Modal";
import Button from "./Button";

function TaskCard({
  id,
  title,
  status,
  completed,
  dueDate,
  onDelete,
  onToggleCompleted,
  onDueDateChange,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const dateInputRef = useRef(null);

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

  function handleMenuToggle(e) {
    e.stopPropagation();
    if (!menuOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = 150;
      const openUpward = window.innerHeight - rect.bottom < menuHeight;

      setMenuPosition({
        top: openUpward ? rect.top - menuHeight : rect.bottom + 4,
        left: rect.right - 170,
      });
    }
    setMenuOpen((open) => !open);
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });
  const style = isDragging ? { opacity: 0.4 } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card"
    >
      <div className="task-card-header">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggleCompleted(id, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <span className={`task-title ${completed ? "task-title-done" : ""}`}>
          {title}
        </span>
        <button
          type="button"
          ref={triggerRef}
          className="task-menu-trigger"
          onClick={handleMenuToggle}
        >
          ⋯
        </button>
      </div>

      {menuOpen &&
        createPortal(
          <div
            className="task-menu task-menu-portal"
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              Edit dates
            </button>
            <input
              ref={dateInputRef}
              className="hidden-date-input"
              value={dueDate || ""}
              onChange={(e) => onDueDateChange(id, e.target.value)}
              type="date"
            />
            <button
              type="button"
              onClick={() => {
                onDelete(id);
                setMenuOpen(false);
              }}
            >
              Delete
            </button>
          </div>,
          document.body,
        )}

      {isModalOpen && (
        <Modal>
          <h3>{title}</h3>
          <p>Status: {status}</p>
          <p>Completed: {completed ? "Yes" : "No"}</p>
          <p>Due date: {dueDate || "None"}</p>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal>
      )}
    </div>
  );
}

export default TaskCard;
