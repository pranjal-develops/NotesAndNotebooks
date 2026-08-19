import {
  useThemeSwitcher,
  type ThemeId,
} from "../../../hooks/useThemeSwitcher";

const ThemeSwitch = () => {
  const { theme, themes, setTheme, toggleDarkLight, isDarkLike } =
    useThemeSwitcher();

  return (
    <>
      {/* <= md: your existing single toggle UI (Light <-> Dark) */}
      <button
        onClick={toggleDarkLight}
        className="flex md:flex lg:hidden p-2 rounded-full transition-all active:scale-95 ml-2
               text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200
               dark:text-zinc-400 hover:dark:text-zinc-100 dark:bg-zinc-800 hover:dark:bg-zinc-700
               dark-island:text-zinc-400 hover:dark-island:text-zinc-100 dark-island:bg-zinc-800 hover:dark-island:bg-zinc-700 
               pitch-black:text-zinc-400 hover:pitch-black:text-zinc-100 pitch-black:bg-zinc-800 hover:pitch-black:bg-zinc-700 
               "
        aria-label="Toggle dark/light theme"
      >
        {isDarkLike ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* >= lg: theme picker for all themes (scales when you add more) */}
      <div className="hidden lg:flex items-center">
        <label className="sr-only" htmlFor="themeSelect">
          Theme
        </label>

        <select
          id="themeSelect"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeId)}
          className="
        h-10 px-3 rounded-full
        bg-zinc-100 text-zinc-700
        dark:bg-zinc-800 dark:text-zinc-100
        dark-island:bg-zinc-950 dark-island:text-zinc-200
        pitch-black:bg-black pitch-black:text-zinc-200
        pure-white:bg-white
    
        ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 dark-island:ring-zinc-900 pitch-black:ring-zinc-900
    
        focus:outline-none
        focus:ring-2 focus:ring-(--accent-color)
        cursor-pointer
      "
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t === "dark"
                ? "Dark"
                : t === "light"
                  ? "Light"
                  : t === "island"
                    ? "Island"
                    : t === "dark-island"
                      ? "Dark Island"
                      : t === "pure-white"
                        ? "Pure White"
                        : "Pitch Black"}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ThemeSwitch;
