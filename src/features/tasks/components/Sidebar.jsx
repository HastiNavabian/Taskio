import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";
import SearchInput from "./SearchInput";
import useCategories from "../hooks/useCategories";

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

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

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
      setNewColor(CATEGORY_COLORS[0]);
    }
  }
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        <button type="button" className="hamburger-btn" onClick={onToggle}>
          ☰
        </button>
        {!collapsed && <span className="sidebar-brand">Taskio</span>}
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-search">
            <SearchInput />
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-title">Categories</div>

            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                />
                <span className="category-name">{category.name}</span>
                <button
                  type="button"
                  className="category-delete"
                  onClick={() => deleteCategory(category.id)}
                >
                  ×
                </button>
              </div>
            ))}

            {isAdding ? (
              <form onSubmit={handleAddCategory} className="category-form">
                <input
                  type="text"
                  placeholder="Category name"
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
                + Add category
              </button>
            )}
          </nav>

          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-footer-item"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
            </button>
            <div className="sidebar-user-email">{user.email}</div>
            <button
              type="button"
              className="sidebar-footer-item sidebar-signout"
              onClick={signOut}
            >
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
