import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api, authApi } from "../api";
import { loginStart, loginSuccess, loginFailure } from "../store/slice/authSlice";
import type { RootState } from "../store/store";
import { clearGuestNotes, getGuestNotebooks, getGuestNotes, clearGuestNotebooks } from "../utils/guestStorage";
import type { Note, Notebook } from "../types";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    // const notes = useSelector((state: RootState) => state.note.notes);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await authApi.login({ username, password });
            const { token, user } = response.data;
            dispatch(loginSuccess({ token, user }));

            // Sync Guest to DB
            // Run in parallel
            // ✅ More reliable — reads from the ground truth source
            const guestNotes = getGuestNotes();
            console.log(guestNotes);
            
            const guestNotebooks = getGuestNotebooks();
            await Promise.all(guestNotes.map((note: Note) => api.post(`/notes`, note)));
            await Promise.all(guestNotebooks.map((notebook: Notebook) => api.post(`/notebooks`, notebook)));
            clearGuestNotes();
            clearGuestNotebooks();


            navigate("/");
        } catch (err: any) {
            dispatch(loginFailure(err.response?.data || "Authentication failed"));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60">
                <h2 className="text-center text-3xl font-extrabold tracking-tight note-accent-gradient">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Sign in to sync your notes to the cloud
                </p>

                {error && (
                    <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm outline-none transition focus:border-(--accent-color) focus:ring-2 focus:ring-(--accent-color)/20 dark:border-zinc-800 dark:bg-zinc-950/50"
                            placeholder="Enter your username"
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
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-zinc-500">Don't have an account? </span>
                    <Link to="/register" className="font-semibold text-(--accent-color) hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
