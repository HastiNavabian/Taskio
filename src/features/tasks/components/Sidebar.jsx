import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import SearchInput from "./SearchInput";

function Sidebar({ collapsed, onToggle }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
            {/* بعداً لیست دسته‌ها اینجا میاد */}
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
