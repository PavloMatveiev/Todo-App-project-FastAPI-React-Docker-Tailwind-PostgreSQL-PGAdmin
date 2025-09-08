import { useActionState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../store/auth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  async function loginAction(prevState, formData) {
    const username = formData.get('userName');
    const password = formData.get('password');

    let errors = [];

    try {
      const body = new URLSearchParams();
      body.set("username", username);
      body.set("password", password);
      const { data } = await api.post("/auth/token", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      login(data.access_token);
      navigate("/todos", { replace: true });
    } catch (error) {
      errors.push("Invalid credentials");
      return {
        errors,
      };
    }
  }

  const [formState, formAction] = useActionState(loginAction, {
    errors: null,
  });

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      <form action={formAction} className="space-y-4">

        <div>
          <label className="label" htmlFor="userName">Username</label>
          <input className="input" type="text" name="userName" required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="input" type="password" name="password" required />
        </div>

        {formState.errors && (
          <ul className="text-sm text-rose-600">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <button type="submit" className="btn btn-primary">Login</button>
        <Link to="/register" className="ml-2 text-sm underline">No account? Register</Link>
      </form>
    </div>
  );
}
