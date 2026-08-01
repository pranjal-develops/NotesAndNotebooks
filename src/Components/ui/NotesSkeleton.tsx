
const NoteSkeleton = () => {
  return (
    <div className="group relative flex flex-col p-5 rounded-xl border border-[hsl(0,0%,85%)] dark:border-[hsl(0,0%,20%)] dark-island:border-[hsl(0,0%,20%)] pitch-black:border-[hsl(0,0%,20%)] shadow-sm overflow-hidden">
      {/* pinned icon placeholder (optional) */}
      <div className="absolute top-3 right-3 text-zinc-400 opacity-40">
        <div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />
      </div>

      {/* title */}
      <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse mb-2" />
      <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse mb-3" />

      {/* description lines */}
      <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse mb-1" />
      <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse mb-1" />
      <div className="h-4 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse mb-3" />

      {/* optional drawing placeholder */}
      <div className="mt-3 rounded-lg overflow-hidden bg-white/10">
        <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />
      </div>

      {/* date */}
      <div className="mt-4 h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />

      {/* tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        <div className="h-5 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />
        <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />
        <div className="h-5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 dark-island:bg-zinc-800 pitch-black:bg-zinc-800 animate-pulse" />
      </div>
    </div>
  );
};

export default NoteSkeleton;
