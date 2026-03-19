import Link from "next/link";
import {
  Home,
  ClipboardList,
  Users,
  DollarSign,
  Settings,
  PanelLeftClose,
  ArrowRightFromLine
} from "lucide-react";

export default function SideBar() {
  const itemClasses =
    "is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:grid-cols-1 is-drawer-close:justify-items-center is-drawer-close:px-0";

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
              <PanelLeftClose className="h-5 w-5" strokeWidth={2} />
            </label>
          </li>
          <li>
            <Link
              href="/"
              className={itemClasses}
              data-tip="Home"
            >
              <Home className="h-5 w-5" />
              <span className="is-drawer-close:hidden">Home</span>
            </Link>
          </li>

          <li>
            <Link
              href="/requests"
              className={itemClasses}
              data-tip="Requests"
            >
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
            <Link
              href="/budget"
              className={itemClasses}
              data-tip="Budget"
            >
              <DollarSign className="h-5 w-5" />
              <span className="is-drawer-close:hidden">Budget</span>
            </Link>
          </li>
        </ul>



        <div className="w-full pb-4">
          <ul className="menu w-full">
            <li>
              <Link
              href="/sign-out"
              className={itemClasses}
              data-tip="Sign Out"
              >
                <ArrowRightFromLine className = "h-5 w-5"/>
                <span className = "is-drawer-close:hidden">Sign Out</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin-panel"
                className={itemClasses}
                data-tip="Admin Panel"
              >
                <Settings className="h-5 w-5" />
                <span className="is-drawer-close:hidden">Admin Panel</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
