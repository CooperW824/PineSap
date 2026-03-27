import Link from "next/link";
import {
  Home,
  ClipboardList,
  Users,
  DollarSign,
  Settings,
  PanelLeftClose,
  ArrowRightFromLine,
} from "lucide-react";

export default function SideBar() {
  const itemClasses =
    "flex is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:grid-cols-1 is-drawer-close:justify-center is-drawer-close:px-0 h-8";

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label
        htmlFor="pinesap-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <aside
        data-theme="forest"
        className="flex h-screen flex-col items-start border-r border-base-300 bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64"
      >
        {/* This is our close sidebar button */}
        <ul className="menu w-full grow pt-8">
          <li>
            <label
              htmlFor="pinesap-drawer"
              aria-label="close sidebar"
              className={itemClasses}
              data-tip="Open sidebar"
            >
              <PanelLeftClose
                className="h-5 w-5 is-drawer-close:rotate-180 transition duration-300"
                strokeWidth={2}
              />
              <span className="is-drawer-close:hidden">Close Sidebar</span>
            </label>
          </li>
          <li>
            <Link href="/" className={itemClasses} data-tip="Home">
              <Home className="h-5 w-5" />
              <span className="is-drawer-close:hidden">Home</span>
            </Link>
          </li>

          <li>
            <Link href="/requests" className={itemClasses} data-tip="Requests">
              <ClipboardList className="h-5 w-5" />
              <span className="is-drawer-close:hidden">Requests</span>
            </Link>
          </li>

          <li>
            <Link
              href="/user-management"
              className={itemClasses}
              data-tip="User Management"
            >
              <Users className="h-5 w-5" />
              <span className="is-drawer-close:hidden">User Management</span>
            </Link>
          </li>

          <li>
            <Link href="/budget" className={itemClasses} data-tip="Budget">
              <DollarSign className="h-5 w-5" />
              <span className="is-drawer-close:hidden">Budget</span>
            </Link>
          </li>
        </ul>

        <div className="w-full pb-4">
          <ul className="menu w-full">
            <li>
              <Link
                href="/admin-panel"
                className={itemClasses}
                data-tip="Admin Settings"
              >
                <Settings className="h-5 w-5" />
                <span className="is-drawer-close:hidden">Admin Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
