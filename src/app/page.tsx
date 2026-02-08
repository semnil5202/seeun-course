import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-zinc-50 px-6 dark:bg-black">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Seeun Course
      </h1>
      <nav className="flex gap-6">
        <Link
          href="/event"
          className="rounded-xl border border-zinc-200 px-8 py-4 text-lg font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          이벤트
        </Link>
        <Link
          href="/date"
          className="rounded-xl border border-zinc-200 px-8 py-4 text-lg font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          데이트 코스
        </Link>
      </nav>
    </div>
  );
}
