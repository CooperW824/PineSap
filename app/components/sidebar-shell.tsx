"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import {
  Home,
  ClipboardList,
  Users,
  DollarSign,
  Settings,
  PanelLeftClose,
} from "lucide-react";

type SideBarShellProps = {
  isAdmin: boolean;
};

const DRAWER_ID = "pinesap-drawer";

export default function SideBarShell({ isAdmin }: SideBarShellProps) {
  const itemClasses =
    "flex items-center is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:grid-cols-1 is-drawer-close:justify-center is-drawer-close:px-0 h-10";

  const toggleDrawer = () => {
    const drawerToggle = document.getElementById(DRAWER_ID) as HTMLInputElement | null;

    if (!drawerToggle) {
      return;
    }

    drawerToggle.checked = !drawerToggle.checked;
  };

  const handleAsideClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    if (target.closest("a, button, label, input, select, textarea")) {
      return;
    }

    toggleDrawer();
  };

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label
        htmlFor={DRAWER_ID}
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside
        data-theme="forest"
        className="flex h-screen flex-col items-start border-r border-base-300 bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64"
        onClick={handleAsideClick}
      >
        <ul className="menu w-full grow pt-8">
          <li>
            <button
              type="button"
              aria-label="toggle sidebar"
              className={itemClasses}
              onClick={toggleDrawer}
            >
              <PanelLeftClose
                className="h-6 w-6 is-drawer-close:rotate-180 transition duration-300"
                strokeWidth={2}
              />
              <span className="is-drawer-close:hidden">Close Sidebar</span>
            </button>
          </li>
          <li>
            <Link href="/" className={itemClasses} data-tip="Home">
              <Home className="h-6 w-6" />
              <span className="is-drawer-close:hidden">Home</span>
            </Link>
          </li>

          <li>
            <Link href="/requests" className={itemClasses} data-tip="Requests">
              <ClipboardList className="h-6 w-6" />
              <span className="is-drawer-close:hidden">Requests</span>
            </Link>
          </li>

          <li>
            <Link href="/budget" className={itemClasses} data-tip="Budget">
              <DollarSign className="h-6 w-6" />
              <span className="is-drawer-close:hidden">Budget</span>
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link
                href="/user-management"
                className={itemClasses}
                data-tip="User Management"
              >
                <Users className="h-6 w-6" />
                <span className="is-drawer-close:hidden">User Management</span>
              </Link>
            </li>
          )}
        </ul>
        {isAdmin && (
          <div className="w-full pb-4">
            <ul className="menu w-full">
              <li>
                <Link
                  href="/admin-panel"
                  className={itemClasses}
                  data-tip="Admin Settings"
                >
                  <Settings className="h-6 w-6" />
                  <span className="is-drawer-close:hidden">Admin Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
