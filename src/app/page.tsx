import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Neural Vision
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        AI-powered virtual fitting — from body scan to photorealistic try-on.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/demo"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
        >
          Try Demo
        </Link>
        <Link
          href="/showcase"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold shadow hover:bg-gray-100 transition-colors"
        >
          View Showcase
        </Link>
      </div>
    </div>
  );
}
