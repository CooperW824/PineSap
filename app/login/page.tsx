"use client";
import { authClient } from "@/lib/client/auth-client"; // relative path — no @/ alias
import { useState } from "react";
import EmailInput from "../components/email-input";
import PasswordInput from "../components/password-input";

export default function LoginPage() {
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/", // Redirect to home page after successful login
    });
    if (error) {
      setErrorText(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <div className="min-w-96 w-1/4 aspect-square flex flex-col items-center justify-center shadow-lg shadow-neutral rounded-lg py-4">
        <h1 className="text-4xl font-bold mb-4">Login to PineSap</h1>

        {errorText && (
          <div role="alert" className="alert alert-error my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorText}</span>
          </div>
        )}
        <EmailInput onChange={setEmail} />
        <PasswordInput onChange={setPassword} />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="checkbox checkbox-neutral mr-2"
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember Me
        </label>

        <button
          className="btn btn-primary"
          onClick={() => handleLogin(email, password, rememberMe)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
