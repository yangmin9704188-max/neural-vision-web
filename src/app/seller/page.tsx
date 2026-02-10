import Link from "next/link";

export default function SellerPortalPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Seller Portal</h1>
      <p className="mt-2 text-gray-600">
        Manage your garments, submit fitting jobs, and track results.
      </p>

      {/* TODO (PR-B): Implement onboarding flow */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <Link
          href="/seller/dashboard"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Overview of your account.</p>
        </Link>
        <Link
          href="/seller/products"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="mt-1 text-sm text-gray-500">Register and manage garments.</p>
        </Link>
        <Link
          href="/seller/jobs"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Jobs</h2>
          <p className="mt-1 text-sm text-gray-500">Submit and track fitting jobs.</p>
        </Link>
      </div>
    </div>
  );
}
