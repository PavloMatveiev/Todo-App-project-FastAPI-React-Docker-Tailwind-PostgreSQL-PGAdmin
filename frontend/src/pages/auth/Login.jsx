import { useActionState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../store/auth.jsx";
import Label from "../../components/input/Label.jsx";

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
      errors.push(error?.response?.data?.detail ??
                  error?.response?.data?.message ??
                  (typeof error?.response?.data === "string" ? error.response.data : null) ??
                  error?.message ??
                  "Invalid credentials");
      return { errors, };
    }
  }

  const [formState, formAction] = useActionState(loginAction, {
    errors: null,
  });

  return (
    <div className="card">
      <h2 className="main-title">Login</h2>
      <form action={formAction} className="space-y-4">
        <Label name="userName" title="Username" />
        <Label name="password" title="Password" type="password" />

        {formState.errors && (
          <ul className="text-sm text-rose-600">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">Login</button>
          <Link to="/register" className="btn">No account? Register</Link>
        </div>
      </form>
    </div>
  );
}
