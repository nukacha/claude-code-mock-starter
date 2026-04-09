export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        claude-code-mock-starter
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is the empty starter page. Run{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
          /discover
        </code>{" "}
        in Claude Code to begin requirements gathering.
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Claude Code で{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
          /discover
        </code>{" "}
        を実行して要件定義を開始してください。
      </p>
    </section>
  );
}
