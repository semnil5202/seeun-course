import Link from "next/link";

const courses = [
  { slug: "gangnam-cafe", title: "강남 카페 투어" },
  { slug: "han-river", title: "한강 피크닉" },
  { slug: "jongno-walk", title: "종로 산책 코스" },
];

export default function DateListPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-6 py-16 dark:bg-black">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        데이트 코스 목록
      </h1>
      <ul className="flex w-full max-w-md flex-col gap-4">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link
              href={`/date/${course.slug}`}
              className="block rounded-lg border border-zinc-200 px-6 py-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {course.title}
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
