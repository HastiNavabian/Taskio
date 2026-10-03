import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";
import SearchInput from "./SearchInput";
import useCategories from "../hooks/useCategories";
import useSearchStore from "../../../store/searchStore";
import useTasks from "../hooks/useTasks";

const CATEGORY_COLORS = [
  "#e74c3c",
  "#f39c12",
  "#27ae60",
  "#4f6df5",
  "#9b59b6",
  "#1abc9c",
];

function Sidebar({ collapsed, onToggle }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { categories, addCategory, deleteCategory } = useCategories();
  const { tasks } = useTasks();
  const selectedCategoryId = useSearchStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useSearchStore((s) => s.setSelectedCategoryId);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

  function categoryTaskCount(categoryId) {
    return tasks.filter((t) => t.categoryId === categoryId).length;
  }

  function handleAddCategory(e) {
    e.preventDefault();
    if (newName.trim() === "") return;
    addCategory(newName.trim(), newColor);
    setNewName("");
    setNewColor(CATEGORY_COLORS[0]);
    setIsAdding(false);
  }

  function handleCategoryKeyDown(e) {
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
    }
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-brand">Menu</span>
        <button type="button" className="hamburger-btn" onClick={onToggle}>
          ☰
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-search">
          <svg
            className="search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <SearchInput />
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Lists</div>

          <button
            type="button"
            className={`category-item ${selectedCategoryId === null ? "category-item-active" : ""}`}
            onPointerUp={() => setSelectedCategoryId(null)}
          >
            <span className="category-dot category-dot-all" />
            <span className="category-name">All</span>
            <span className="task-count">{tasks.length}</span>
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`category-item ${selectedCategoryId === category.id ? "category-item-active" : ""}`}
              onPointerUp={() => setSelectedCategoryId(category.id)}
            >
              <span
                className="category-dot"
                style={{ backgroundColor: category.color }}
              />
              <span className="category-name">{category.name}</span>
              <span className="task-count">
                {categoryTaskCount(category.id)}
              </span>
              <span
                role="button"
                className="category-delete"
                onPointerUp={(e) => {
                  e.stopPropagation();
                  deleteCategory(category.id);
                }}
              >
                ×
              </span>
            </button>
          ))}

          {isAdding ? (
            <form onSubmit={handleAddCategory} className="category-form">
              <input
                type="text"
                placeholder="List name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleCategoryKeyDown}
                autoFocus
              />
              <div className="category-color-picker">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`color-swatch ${newColor === color ? "color-swatch-selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
              <div className="category-form-actions">
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="sidebar-add-category"
              onClick={() => setIsAdding(true)}
            >
              + Add new list
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-footer-item"
            onClick={toggleTheme}
          >
            <span className="sidebar-footer-icon">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          <div className="sidebar-user-email">{user.email || "Guest"}</div>
          <button
            type="button"
            className="sidebar-footer-item sidebar-signout"
            onClick={signOut}
          >
            <svg
              className="sidebar-footer-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
