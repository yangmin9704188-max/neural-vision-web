export default function SellerProductsPage() {
  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-gray-600">
            Register garments and manage product catalog.
          </p>
        </div>
        {/* TODO (PR-B): Implement product registration with schema validation */}
        <button
          disabled
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        >
          + Add Product
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-400 shadow-sm">
        No products registered yet.
      </div>
    </div>
  );
}
