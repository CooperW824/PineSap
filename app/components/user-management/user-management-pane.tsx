"use client";

import { UserData } from "@/lib/server/DatabaseModels/user";
import { Plus } from "lucide-react";
import { useState } from "react";
import UserCard from "./user-card";

export default function UserManagementPane({
  users,
  count,
}: {
  users: UserData[];
  count: number;
}) {
  const [reactiveUsers, setReactiveUsers] = useState<UserData[]>(users);
  const [reactiveCount, setReactiveCount] = useState<number>(count);

  return (
    <div className="flex flex-col gap-4 lg:items-start lg:justify-between">
      <h1 className="text-3xl font-bold sm:text-4xl">User Management</h1>

      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          className="btn btn-neutral h-14 min-h-14 rounded-2xl px-8 text-lg font-semibold shadow-none"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>

        <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xl font-bold">Active Users</h2>
            <div className="badge badge-outline badge-lg px-4 py-3 text-sm font-medium">
              {reactiveCount} users
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 w-full">
        {reactiveUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
