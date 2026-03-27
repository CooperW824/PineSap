const sampleBudgets = [
  {
    projectName: "High budget project",
    budget: "$10",
  },
  {
    projectName: "Beehive",
    budget: "$850000",
  },
  {
    projectName: "Aerospace Club",
    budget: "$200",
  },
  {
    projectName: "???",
    budget: "$1250",
  },
];

export default function BudgetPage() {
  return (
    <main
      data-theme="forest"
      className="min-h-[calc(100vh-4rem)] w-full bg-base-100 px-4 py-6 text-base-content sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="px-6 py-8 sm:px-8 lg:px-10">
            <h1 className="text-3xl font-bold sm:text-4xl">Project Budgets</h1>

            <div className="mt-8 space-y-4">
              {sampleBudgets.map((project) => (
                <article
                  key={project.projectName}
                  className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200/60 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{project.projectName}</h2>
                    <p className="text-lg font-semibold">Budget: {project.budget}</p>
                  </div>

                  <button
                    type="button"
                    className="btn h-12 min-h-12 rounded-xl border-base-300 bg-base-300 px-6 text-base font-medium text-base-content shadow-none hover:bg-base-300"
                  >
                    Adjust Budget
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
