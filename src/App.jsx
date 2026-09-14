import { useAuth } from "./context/AuthContext";
import LoginForm from "./features/tasks/auth/LoginForm";
import BoardView from "../src/features/tasks/components/BoardView";
import ResetPasswordForm from "./features/tasks/auth/ResetPasswordForm";

function App() {
  const {
    user,
    isLoading: authLoading,
    isPasswordRecovery,
    signOut,
  } = useAuth();

  if (authLoading) {
    return <p className="status-message">Loading...</p>;
  }

  if (isPasswordRecovery) {
    return <ResetPasswordForm />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <BoardView user={user} signOut={signOut} />;
}

export default App;
