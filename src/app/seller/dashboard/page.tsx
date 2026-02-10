export default function SellerDashboardPage() {
  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Account overview, recent jobs, and key metrics.
      </p>

      {/* TODO (PR-B): Implement dashboard widgets */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Products", value: "—" },
          { label: "Active Jobs", value: "—" },
          { label: "Completed", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
