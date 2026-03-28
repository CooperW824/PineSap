"use client";

import { UserData } from "@/lib/server/DatabaseModels/user";
import { Plus } from "lucide-react";
import { useState } from "react";
import UserCard from "./user-card";
import PaginationControls from "../pagination-controls";
import Modal from "../Modal";
import { set } from "better-auth";

export default function UserManagementPane({
  users,
  count,
}: {
  users: UserData[];
  count: number;
}) {
  const [reactiveUsers, setReactiveUsers] = useState<UserData[]>(users);
  const [reactiveCount, setReactiveCount] = useState<number>(count);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [userCreationError, setUserCreationError] = useState<string | null>(
    null,
  );
  const [userUpdateError, setUserUpdateError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    if (!newUserName || !newUserEmail) return;

    setCreateUserLoading(true);
    setUserCreationError(null);

    const response = await fetch("/api/user-management/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setReactiveUsers((users) => [data.user, ...users]);
      setReactiveCount((count) => count + 1);
      setAddUserModalOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setUserCreationError(null);
    } else {
      setUserCreationError("Failed to create user. Please try again.");
      console.error("Failed to create user:", await response.text());
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const response = await fetch("/api/user-management/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      setUserUpdateError("Failed to delete user. Please try again.");
    } else {
      setUserUpdateError(null);
      setReactiveUsers((users) => users.filter((user) => user.id !== userId));
      setReactiveCount((count) => count - 1);
    }
  };

  const resetUserPassword = async (userId: string) => {
    const response = await fetch("/api/user-management/password-reset", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      setUserUpdateError(
        "Failed to send password reset email. Please try again.",
      );
    } else {
      setUserUpdateError(null);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    const response = await fetch("/api/user-management/role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (!response.ok) {
      setUserUpdateError("Failed to update user role. Please try again.");
    } else {
      setUserUpdateError(null);
      const updatedUser = await response.json();
      setReactiveUsers((users) =>
        users.map((user) =>
          user.id === userId ? { ...user, role: updatedUser.user.role } : user,
        ),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:items-start lg:justify-between">
      <h1 className="text-3xl font-bold sm:text-4xl">User Management</h1>

      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          className="btn btn-neutral h-14 min-h-14 rounded-2xl px-8 text-lg font-semibold shadow-none"
          onClick={() => setAddUserModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>

        <Modal
          title="Add New User"
          open={addUserModalOpen}
          onClose={() => {
            setAddUserModalOpen(false);
          }}
          actions={
            <button
              type="button"
              className="btn btn-primary h-10 min-h-10 rounded-full px-6 text-sm font-medium shadow-none"
              onClick={handleCreateUser}
            >
              {createUserLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Create User"
              )}
            </button>
          }
        >
          <div className="flex flex-col gap-1 mb-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered w-full bg-base-200"
              placeholder="Enter user's name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="input input-bordered w-full bg-base-200"
              placeholder="Enter user's email"
            />
          </div>

          <div className="mb-4">
            {userCreationError && (
              <p className="text-sm text-red-500 mb-2">{userCreationError}</p>
            )}
          </div>
        </Modal>

        <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-xl font-bold">Active Users</h2>
            <div className="badge badge-outline badge-lg px-4 py-3 text-sm font-medium">
              {reactiveCount} users
            </div>
          </div>
        </div>
      </div>

      {userUpdateError && (
        <p className="text-sm text-red-500 mb-2">{userUpdateError}</p>
      )}

      <div className="space-y-3 w-full">
        {reactiveUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDeleteUser}
            onResetPassword={resetUserPassword}
            onRoleChange={handleChangeUserRole}
          />
        ))}
      </div>

      <PaginationControls
        totalPages={Math.ceil(
          reactiveCount / Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE),
        )}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
