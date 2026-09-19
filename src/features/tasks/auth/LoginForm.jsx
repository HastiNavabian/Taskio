import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function LoginForm() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { data, error } = await signUp(email, password);

      if (error) {
        setError(error.message);
      } else if (data?.user?.identities?.length === 0) {
        setError("You already have an account. Try signing in instead.");
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    }
  }

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
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>

        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError(null);
            setMessage(null);
          }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "No account? Sign Up"}
        </button>
        <button
          type="button"
          className="forgot-password"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
export default LoginForm;
