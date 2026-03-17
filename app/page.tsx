import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <h1 className="text-4xl font-bold mb-4">Welcome to PineSap!</h1>
      <button className="btn btn-accent">Get Started</button>
    </div>
  );
}
