"use client";

import { useState } from "react";

export default function PasswordInput({
  onChange,
  placeholder = "Password",
  disabled = false,
}: {
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label className="input validator input-neutral my-2">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          type={showPassword ? "text" : "password"}
          required
          placeholder={placeholder}
          minLength={8}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((current) => !current)}
          disabled={disabled}
        >
          <svg
            className="h-[1.1em] w-[1.1em] opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r={showPassword ? "6.5" : "4.5"}
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </label>
    </>
  );
}
