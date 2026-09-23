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
  categoryId,
  categories,
  dueDate,
  onDelete,
  onToggleCompleted,
  onDueDateChange,
  onTitleChange,
  onCategoryChange,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const titleInputRef = useRef(null);
  const category = categories.find((c) => c.id === categoryId);

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

  useEffect(() => {
    function handleDragStartGlobal() {
      setMenuOpen(false);
    }
    document.addEventListener("task-drag-start", handleDragStartGlobal);
    return () =>
      document.removeEventListener("task-drag-start", handleDragStartGlobal);
  }, []);

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

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  function handleTitleSave() {
    const trimmed = editedTitle.trim();
    if (trimmed !== "" && trimmed !== title) {
      onTitleChange(id, trimmed);
    } else {
      setEditedTitle(title);
    }
    setIsEditingTitle(false);
  }

  function handleTitleKeyDown(e) {
    console.log("key pressed:", e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(title);
      setIsEditingTitle(false);
    }
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });
  const style = isDragging ? { opacity: 0.4 } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderInlineStart: category ? `3px solid ${category.color}` : undefined,
      }}
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

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            className="task-title-input"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={`task-title ${completed ? "task-title-done" : ""}`}>
            {title}
          </span>
        )}

        {!isEditingTitle && (
          <button
            type="button"
            className="task-title-edit"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </button>
        )}

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

            <label className="menu-date-label">
              Due date
              <input
                type="date"
                value={dueDate || ""}
                onChange={(e) => onDueDateChange(id, e.target.value)}
                className="menu-date-input"
              />
            </label>

            <label className="menu-date-label">
              Category
              <select
                value={categoryId || ""}
                onChange={(e) => onCategoryChange(id, e.target.value || null)}
                className="menu-date-input"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

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
          <p className="modal-category-row">
            Category:{" "}
            {category ? (
              <span className="category-inline">
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            ) : (
              "None"
            )}
          </p>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal>
      )}
    </div>
  );
}

export default TaskCard;
