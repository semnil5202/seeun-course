import Link from "next/link";

const events = [
  { slug: "birthday", title: "생일 이벤트" },
  { slug: "anniversary", title: "기념일 이벤트" },
  { slug: "christmas", title: "크리스마스 이벤트" },
];

export default function EventListPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        이벤트 목록
      </h1>
      <ul className="flex w-full max-w-md flex-col gap-4">
        {events.map((event) => (
          <li key={event.slug}>
            <Link
              href={`/event/${event.slug}`}
              className="block rounded-lg border border-zinc-200 px-6 py-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        홈으로
      </Link>
    </div>
  );
}
