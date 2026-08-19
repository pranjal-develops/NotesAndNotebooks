import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "../api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slice/authSlice";
import type { RootState } from "../store/store";
import type { AxiosError } from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pfp, setPfp] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Convert uploaded image file to Base64 string for avatar
  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string; // data:image/png;base64,AAAA...
      const base64 = result.split(",")[1]; // AAAA...
      setPfp(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // 1. Create the user
      console.log("pfp value type:", typeof pfp);
      console.log("pfp value preview:", pfp?.slice?.(0, 30));

      await authApi.register({ username, password, pfp });

      // 2. Automatically log in the user after register
      const loginRes = await authApi.login({ username, password });
      const { token, user } = loginRes.data;
      dispatch(loginSuccess({ token, user }));

      navigate("/");
    } catch (err: unknown) {
      const e = err as AxiosError<{ message?: string }>;

      const msg =
        typeof e.response?.data === "string"
          ? e.response.data
          : e.response?.data?.message;

      dispatch(loginFailure(msg ?? "Login failed"));
    }

    // } catch (err: any) {
    //     dispatch(loginFailure(err.response?.data || "Registration failed"));
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
        <h2 className="text-center text-3xl font-extrabold tracking-tight note-accent-gradient">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Join us to start taking notes
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2">
            <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-100/50 hover:bg-zinc-200/50 dark:border-zinc-700 dark:bg-zinc-850/50">
              {pfp ? (
                <img
                  src={pfp}
                  alt="Preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400 font-semibold text-center">
                  Add Avatar
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePfpChange}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Username
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/20 dark:border-zinc-800 dark:bg-zinc-950/50"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/20 dark:border-zinc-800 dark:bg-zinc-950/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-(--accent-color) py-3 text-sm font-semibold text-white shadow-lg shadow-(--accent-color)/20 hover:brightness-110 active:scale-[0.98] transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-(--accent-color) hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
