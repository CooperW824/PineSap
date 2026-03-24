"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/client/auth-client";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(() => {
      router.refresh(); // re-fetches all server components including navbar
      router.push("/");
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <h1 className="text-4xl font-bold mb-4">Signing out...</h1>
    </div>
  );
}
