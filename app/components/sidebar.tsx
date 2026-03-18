"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConciergeBell,
  DollarSign,
  House,
  Settings,
  UserRound,
} from "lucide-react";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function menuItemClass(active: boolean) {
  return [
    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
    "is-drawer-close:justify-center",
    active ? "text-success" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label
        htmlFor="pinesap-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <div className="flex h-screen flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        <ul className="menu w-full grow pt-16 pb-6">
          <li>
            <Link
              href="/"
              aria-current={isActivePath(pathname, "/") ? "page" : undefined}
              className={menuItemClass(isActivePath(pathname, "/"))}
              data-tip="Home"
            >
              <House className="size-5 shrink-0" strokeWidth={2.25} />
              <span className="is-drawer-close:hidden">Home</span>
            </Link>
          </li>

          <li>
            <Link
              href="/requests"
              aria-current={isActivePath(pathname, "/requests") ? "page" : undefined}
              className={menuItemClass(isActivePath(pathname, "/requests"))}
              data-tip="Requests"
            >
              <ConciergeBell className="size-5 shrink-0" strokeWidth={2.25} />
              <span className="is-drawer-close:hidden">Requests</span>
            </Link>
          </li>

          <li>
            <Link
              href="/user-management"
              aria-current={isActivePath(pathname, "/user-management") ? "page" : undefined}
              className={menuItemClass(isActivePath(pathname, "/user-management"))}
              data-tip="User Management"
            >
              <UserRound className="size-5 shrink-0" strokeWidth={2.25} />
              <span className="is-drawer-close:hidden">User Management</span>
            </Link>
          </li>

          <li>
            <Link
              href="/budget"
              aria-current={isActivePath(pathname, "/budget") ? "page" : undefined}
              className={menuItemClass(isActivePath(pathname, "/budget"))}
              data-tip="Budget"
            >
              <DollarSign className="size-5 shrink-0" strokeWidth={2.25} />
              <span className="is-drawer-close:hidden">Budget</span>
            </Link>
          </li>

          <li className="mt-auto">
            <Link
              href="/admin-panel"
              aria-current={isActivePath(pathname, "/admin-panel") ? "page" : undefined}
              className={menuItemClass(isActivePath(pathname, "/admin-panel"))}
              data-tip="Admin Panel"
            >
              <Settings className="size-5 shrink-0" strokeWidth={2.25} />
              <span className="is-drawer-close:hidden">Admin Panel</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
