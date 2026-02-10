import Link from "next/link";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Seller sidebar */}
      <aside className="w-56 border-r border-gray-200 bg-white px-4 py-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Seller Menu
        </h2>
        <nav className="space-y-1">
          <Link
            href="/seller/dashboard"
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/seller/products"
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/seller/jobs"
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Jobs
          </Link>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
