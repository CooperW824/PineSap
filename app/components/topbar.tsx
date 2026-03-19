import Link from "next/link";

export default function TopBar() {
  return (
    <nav className="navbar w-full bg-base-200 bg-border-300">

      {/* Replace w/ img tag or svg for logo*/}
      <div> logo_here </div>
      <div className="px-4 text-xl font-semibold text-heading">PineSap</div>
      <ul className="menu menu-horizontal px-1">
        <li>
          <Link href="/login" className="border border-white">
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
        </li>
      </ul>
    </nav>
  );
}
