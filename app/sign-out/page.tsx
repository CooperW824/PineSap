import { auth } from "@/lib/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignOutPage() {
  const resp = await auth.api.signOut({
    headers: await headers(),
  });

  if (resp.success) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <h1 className="text-4xl font-bold mb-4">
        Failed to Sign Out, Please refresh to try again.
      </h1>
    </div>
  );
}
