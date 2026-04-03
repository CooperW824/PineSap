"use client";
import Link from "next/link";
import { authClient } from "@/lib/client/auth-client";
import { User } from "better-auth";
import Image from "next/image";
import Logo from "../assets/Logo_SVG.svg";

export default function TopBar() {
  const { data: Session } = authClient.useSession();
  const user = Session?.user as User | null;

  return (
    <nav
      data-theme="forest"
      className="navbar w-full bg-base-200 bg-border-300"
    >
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex items-center pl-3">
          <Image
            src={Logo}
            alt="PineSap Logo"
            width={16}
            height={16}
            className="mr-2"
            color="white"
          />
          <div className="px-4 text-xl font-semibold text-heading">PineSap</div>
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium">Welcome, {user.name}</span>
            <Link href="/sign-out" className="border border-white btn">
              Sign Out
            </Link>
          </div>
        ) : (
          <Link href="/login" className="border border-white btn">
            <svg
              aria-label="Email icon"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="white"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            Login with Email
          </Link>
        )}
      </div>
    </nav>
  );
}
