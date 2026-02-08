import Link from "next/link";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-4 py-12 sm:gap-8 sm:px-6 sm:py-16 dark:bg-black">
      <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-50">
        이벤트: {slug}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        이벤트 내용을 여기에 작성하세요.
      </p>
      <Link
        href="/event"
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        목록으로
      </Link>
    </div>
  );
}
