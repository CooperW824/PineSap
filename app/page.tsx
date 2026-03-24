import { auth } from "@/lib/server/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return (
    <main
      data-theme="forest"
      className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-base-100 py-2 text-base-content"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to PineSap!</h1>
      {session ? (
        <p className="text-lg">You are logged in as {session.user.name}</p>
      ) : (
        <p className="text-lg">You are not logged in.</p>
      )}
    </main>
  );
}
