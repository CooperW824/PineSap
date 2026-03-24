import { ChevronDown, Plus, RotateCcw, Trash2, UserRound } from "lucide-react";

const sampleUsers = [
  {
    username: "user1",
    name: "Abishek",
    type: "Admin",
  },
  {
    username: "user2",
    name: "Another Guy",
    type: "User",
  },
  {
    username: "user3",
    name: "A Real Name",
    type: "User",
  },
  {
    username: "user4",
    name: "40000 Angry Bees",
    type: "Admin",
  },
];

export default function UserManagementPage() {
  return (
    <main
      data-theme="forest"
      className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">Requests</h1>
              </div>

              <button
                type="button"
                className="btn btn-neutral h-14 min-h-14 rounded-2xl px-8 text-lg font-semibold shadow-none"
              >
                <Plus className="h-5 w-5" />
                Create Request
              </button>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-xl font-bold">All Requests</h2>
                <div className="badge badge-outline badge-lg px-4 py-3 text-sm font-medium">
                  {sampleUsers.length} requests
                </div>
              </div>

              <div className="space-y-3">
                {sampleUsers.map((user) => (
                  <article
                    key={user.username}
                    className="grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm lg:grid-cols-[minmax(0,1.15fr)_minmax(190px,0.9fr)_minmax(220px,1fr)_minmax(180px,0.85fr)]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                        <UserRound className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{user.username}</p>
                        <p className="truncate text-sm text-base-content/70">{user.name}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn h-14 min-h-14 rounded-2xl border-base-300 bg-base-200 text-base font-semibold text-base-content shadow-none hover:border-error/30 hover:bg-error/10"
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

                    <button
                      type="button"
                      className="btn h-14 min-h-14 justify-between rounded-2xl border-base-300 bg-base-200 px-5 text-base font-semibold text-base-content shadow-none"
                    >
                      <span>{user.type}</span>
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}