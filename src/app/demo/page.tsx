export default function DemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Virtual Fitting Demo</h1>
      <p className="mt-2 text-gray-600">
        Enter body parameters and select a garment to generate a virtual try-on.
      </p>

      {/* TODO (PR-A): Connect to mock engine API routes */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Body Input Panel */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Body Parameters</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gender, age, height (cm), weight (kg)
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-10 rounded bg-gray-100" />
            <div className="h-10 rounded bg-gray-100" />
            <div className="h-10 rounded bg-gray-100" />
            <div className="h-10 rounded bg-gray-100" />
          </div>
        </section>

        {/* Result Panel */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Fitting Result</h2>
          <p className="mt-1 text-sm text-gray-500">
            Generated virtual try-on image will appear here.
          </p>
          <div className="mt-4 flex h-64 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            No result yet
          </div>
        </section>
      </div>
    </div>
  );
}
