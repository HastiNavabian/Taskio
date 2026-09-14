import { useState } from "react";
import { useAuth } from "./AuthContext";

function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleForgotPassword() {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }

    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Set a new password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Update password</button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
