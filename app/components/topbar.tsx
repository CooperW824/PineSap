import { PanelLeftClose } from "lucide-react";

export default function TopBar() {
  return (
    <nav className="navbar w-full bg-base-300">
      <label
        htmlFor="pinesap-drawer"
        aria-label="open sidebar"
        className="btn btn-square btn-ghost"
      >
        <PanelLeftClose className="size-5" strokeWidth={2} />
      </label>
      <div className="px-4">PineSap</div>
    </nav>
  );
}
