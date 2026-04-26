"use client";

import { Suspense, useState } from "react";
import PasswordInput from "../components/password-input";
import { authClient } from "@/lib/client/auth-client";
import { redirect, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<ResetPasswordComponent />
			</Suspense>
		</>
	);
}

function ResetPasswordComponent() {
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | undefined>(undefined);
	const [token] = useState(searchParams.get("token") || "");

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [passwordsMatch, setPasswordsMatch] = useState(true);

	const handleResetPassword = async () => {
		if (newPassword !== confirmPassword) {
			setPasswordsMatch(false);
			return;
		}

		const { error } = await authClient.resetPassword({
			token,
			newPassword,
		});

		if (error) {
			setError(error.message);
		}

		redirect("/login");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
			<div className="min-w-96 w-1/4 aspect-square flex flex-col items-center justify-start shadow-lg shadow-neutral rounded-lg py-4">
				<h1 className="text-4xl font-bold mb-4">PineSap Password Reset</h1>

				<div className="w-full flex flex-col items-center justify-center grow shrink basis-auto ">
					{error && (
						<div role="alert" className="alert alert-error my-2 max-w-3/4">
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
							<span>{error}</span>
						</div>
					)}

					<PasswordInput
						placeholder="New Password"
						onChange={(value) => {
							setNewPassword(value);
						}}
					/>
					<PasswordInput
						placeholder="Confirm New Password"
						onChange={(value) => {
							setConfirmPassword(value);
							if (value !== newPassword) {
								setPasswordsMatch(false);
							} else {
								setPasswordsMatch(true);
							}
						}}
					/>
					{!passwordsMatch && (
						<div role="alert" className="alert alert-error">
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
							<span>Passwords do not match.</span>
						</div>
					)}
					<button className="btn btn-primary mt-4" onClick={handleResetPassword}>
						Reset Password
					</button>
				</div>
			</div>
		</div>
	);
}
