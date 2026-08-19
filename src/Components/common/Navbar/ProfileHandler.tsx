import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../store/slice/authSlice";
import type { RootState } from "../../../store/store";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdLogIn } from "react-icons/io";

const HeaderPopup = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    if (!open) return;

    const anchorEl = anchorRef.current;
    const popupEl = popupRef.current;
    if (!anchorEl || !popupEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const popupWidth = popupEl.getBoundingClientRect().width;
    const popupHeight = popupEl.getBoundingClientRect().height;

    let left = rect.right - popupWidth;
    let top = rect.bottom + 8;

    const padding = 8;
    const maxLeft = window.innerWidth - popupWidth - padding;
    left = Math.max(padding, Math.min(left, maxLeft));

    const maxTop = window.innerHeight - popupHeight - padding;
    if (top > maxTop) top = rect.top - popupHeight - 8;

    setPos({ left, top });
  }, [open]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      const a = anchorRef.current;
      const p = popupRef.current;
      const target = e.target as Node;

      if (a?.contains(target) || p?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div ref={anchorRef} className="relative ml-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full border border-zinc-200 object-cover shadow-sm dark:border-zinc-800 dark-island:border-zinc-800 pitch-black:border-zinc-800 overflow-hidden flex items-center justify-center bg-transparent z-9999"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isAuthenticated && user?.pfp ? (
          <img
            src={user.pfp.startsWith("data:") ? user.pfp : `data:image/png;base64,${user.pfp}`}
            alt={user.username}
            className="h-9 w-9 object-cover"
          />
        ) : isAuthenticated && user ? (
          <div className="flex h-9 w-9 items-center justify-center bg-(--accent-color)/10 text-xl text-(--accent-color)">
            {user.username.substring(0, 1).toUpperCase()}
          </div>
        ) : (
          <div
            className="flex h-9 w-9 text-2xl items-center justify-center bg-(--accent-color)/10 font-bold 
          text-(--accent-color)
          "
          >
            <IoMdLogIn />
          </div>
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={popupRef}
            style={{ position: "fixed", left: pos.left, top: pos.top }}
            className="
              w-44 rounded-lg bg-white shadow-lg ring-1 ring-black/5
              dark:bg-zinc-900 dark:ring-white/10
              dark-island:bg-zinc-900 dark-island:ring-white/10
              pitch-black:bg-zinc-900 pitch-black:ring-white/10
              z-99999
            "
            role="menu"
          >
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="
                    block px-3 py-2 text-xs font-semibold
                    text-zinc-700 hover:bg-zinc-100
                    dark:text-zinc-200 dark:hover:bg-zinc-800
                    dark-island:text-zinc-200 dark-island:hover:bg-zinc-800
                    pitch-black:text-zinc-200 pitch-black:hover:bg-zinc-800
                    transition
                  "
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                  }}
                  role="menuitem"
                  className="
                    w-full text-left block px-3 py-2 text-xs font-semibold
                    text-zinc-700 hover:bg-zinc-100
                    dark:text-zinc-200 dark:hover:bg-zinc-800
                    dark-island:text-zinc-200 dark-island:hover:bg-zinc-800
                    pitch-black:text-zinc-200 pitch-black:hover:bg-zinc-800
                    transition
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="
                    block px-3 py-2 text-xs font-semibold
                    text-zinc-700 hover:bg-zinc-100
                    dark:text-zinc-200 dark:hover:bg-zinc-800
                    dark-island:text-zinc-200 dark-island:hover:bg-zinc-800
                    pitch-black:text-zinc-200 pitch-black:hover:bg-zinc-800
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="
                    block px-3 py-2 text-xs font-semibold
                    text-zinc-700 hover:bg-zinc-100
                    dark:text-zinc-200 dark:hover:bg-zinc-800
                    dark-island:text-zinc-200 dark-island:hover:bg-zinc-800
                    pitch-black:text-zinc-200 pitch-black:hover:bg-zinc-800
                    transition
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default HeaderPopup;
