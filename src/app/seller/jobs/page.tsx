export default function SellerJobsPage() {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fitting Jobs</h1>
          <p className="mt-1 text-gray-600">
            Submit virtual fitting jobs and track their progress.
          </p>
        </div>
        {/* TODO (PR-C): Implement job submission flow */}
        <button
          disabled
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        >
          + Submit Job
        </button>
      </div>

      {/* Job list */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-3">
          <div className="grid grid-cols-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>Job ID</span>
            <span>Product</span>
            <span>Status</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
        </div>
        <div className="p-8 text-center text-gray-400">
          No fitting jobs yet.
        </div>
      </div>
    </div>
  );
}
