export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Showcase</h1>
      <p className="mt-2 text-gray-600">
        Browse pre-generated virtual fitting results.
      </p>

      {/* TODO (PR-A): Render showcase artifacts from demo_artifacts */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-48 rounded-lg bg-gray-100" />
            <p className="mt-3 text-sm font-medium text-gray-700">
              Sample Fitting #{i}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
