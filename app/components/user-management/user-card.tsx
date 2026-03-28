"use client";

import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";
import { UserData } from "@/lib/server/DatabaseModels/user";

export default function UserCard({
  user,
  onDelete,
}: {
  user: UserData;
  onDelete: (userId: string) => void;
}) {
  return (
    <article
      key={user.id}
      className="grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm lg:grid-cols-[minmax(0,1.15fr)_minmax(190px,0.9fr)_minmax(220px,1fr)_minmax(180px,0.85fr)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
          <UserRound className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{user.name}</p>
          <p className="truncate text-sm text-base-content/70">{user.email}</p>
        </div>
      </div>

      <button
        type="button"
        className="btn h-14 min-h-14 rounded-2xl border-base-300 bg-base-200 text-base font-semibold text-base-content shadow-none hover:border-error/30 hover:bg-error/10"
        onClick={() => onDelete(user.id)}
      >
        <Trash2 className="h-4 w-4" />
        Delete User
      </button>

      <button
        type="button"
        className="btn h-14 min-h-14 rounded-2xl border-base-300 bg-base-200 text-base font-semibold text-base-content shadow-none hover:border-warning/30 hover:bg-warning/10"
      >
        <RotateCcw className="h-4 w-4" />
        Reset User Password
      </button>

      <select
        className="select h-14 min-h-14 rounded-2xl border-base-300 bg-base-200 text-base font-semibold text-base-content shadow-none hover:border-primary/30 hover:bg-primary/10"
        defaultValue={user.role}
      >
        <option value="admin">Admin</option>
        <option value="member">Member</option>
        <option value="external">External</option>
      </select>
    </article>
  );
}
