import { useActionState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Label from "../../components/input/Label";
import api from "../../api";

import {
  isEmail,
  isNotEmpty,
  isEqualToOtherValue,
  hasMinLength,
} from './validation';

export default function Register() {
  const navigate = useNavigate();
  async function registerAction(prevState, formData) {
    const email = formData.get('email');
    const username = formData.get('userName');
    const first_name = formData.get('firstName');
    const last_name = formData.get('lastName');
    const role = formData.get('role');
    const phone_number = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    let errors = [];

    if (!isEmail(email)) {
      errors.push('Invalid email address.');
    }

    if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
      errors.push('You must provide a password with at least six characters.');
    }

    if (!isEqualToOtherValue(password, confirmPassword)) {
      errors.push('Passwords do not match.');
    }

    if (!isNotEmpty(first_name) || !isNotEmpty(last_name)) {
      errors.push('Please provide both your first and last name.');
    }

    if (!isNotEmpty(role)) {
      errors.push('Please select a role.');
    }

    if (errors.length > 0) {
      return {
        errors,
      };
    }

    try {
      await api.post("/auth", {
        email,
        username,
        first_name,
        last_name,
        role,
        phone_number,
        password,
      });
      navigate("/login", { replace: true });
    } catch (error) {
      errors.push('Registration failed! Try again later...');
      console.log(error)
      return {
        errors,
      };
    }
  }

  const [formState, formAction] = useActionState(registerAction, {
    errors: null,
  });

  return (
    <div className="card">
      <h2 className="main-title">Register</h2>
      <form action={formAction} className="grid grid-cols-1 gap-4">
        <Label name="email" title="Email" />
        <Label name="userName" title="Username" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Label name="firstName" title="First name" />
          <Label name="lastName" title="Last name" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Label name="role" title="Role" options={["user", "admin"]}/>
          <Label name="phone" title="Phone number"/>
        </div>
        <Label name="password" type="password" title="Password"/>
        <Label name="confirmPassword" type="password" title="Verify password"/>

        {formState.errors && (
          <ul className="text-sm text-rose-600">
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">Sign up</button>
          <Link to="/login" className="btn">Already have an account?</Link>
        </div>
      </form>
    </div>
  )
}