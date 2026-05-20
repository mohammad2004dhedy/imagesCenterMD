"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { ArrowRight, ImagePlus, Lock, Mail, User } from "lucide-react";
import Swal from "sweetalert2";
import { authApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { user, loading: authLoading, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  const nextPath = params.get("next");
  const switchHref = `${isSignup ? "/login" : "/signup"}${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`;

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(params.get("next") || "/dashboard");
    }
  }, [authLoading, user, router, params]);

  async function submit(event) {
    event.preventDefault();
    if (isSignup && form.name.trim().length < 2) {
      toast?.push("Please enter your full name.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast?.push("Please enter a valid email address.", "error");
      return;
    }
    if (form.password.length < (isSignup ? 10 : 1)) {
      toast?.push(isSignup ? "Password must be at least 10 characters." : "Please enter your password.", "error");
      return;
    }
    if (isSignup && (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))) {
      toast?.push("Password must include at least one letter and one number.", "error");
      return;
    }
    setLoading(true);
    let data;
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      };
      data = await (isSignup ? authApi.signup(payload) : authApi.login(payload));
    } catch {
      setLoading(false);
      toast?.push("Unable to reach the server. Please try again.", "error");
      return;
    }
    setLoading(false);
    if (!data.ok) {
      const fieldError = data.details?.fieldErrors
        ? Object.values(data.details.fieldErrors).flat().filter(Boolean)[0]
        : null;
      await Swal.fire({
        title: "Authentication failed",
        text: fieldError || data.message || "Please check your details and try again.",
        icon: "error",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        }
      });
      toast?.push(fieldError || data.message || "Authentication failed.", "error");
      return;
    }
    await Swal.fire({
      title: isSignup ? "Account created" : "Welcome back",
      text: isSignup ? "Your imagesCenter workspace is ready." : "You are signed in securely.",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-3xl"
      }
    });
    setUser(data.user || null);
    toast?.push(isSignup ? "Account created." : "Welcome back.", "success");
    router.push(params.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <section className="saas-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden min-h-[620px] overflow-hidden text-white lg:block">
          <div className="absolute inset-0 saas-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.28),transparent_230px)]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-black">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <ImagePlus size={22} />
              </span>
              <span>imagesCenter</span>
            </Link>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-100">Image Search Workspace</p>
              <h1 className="mt-4 max-w-sm text-5xl font-black leading-none">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-4 max-w-sm leading-7 text-blue-50">
                {isSignup
                  ? "Save favorites, track history, and keep your image searches organized."
                  : "Sign in to continue your search history and favorite image collections."}
              </p>
            </div>
          </div>
        </aside>

        <form className="flex min-h-[620px] flex-col justify-center px-6 py-10 sm:px-12" onSubmit={submit}>
          <Link href="/" className="mb-10 inline-flex items-center gap-3 text-xl font-black text-blue-700 dark:text-blue-300 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-blue-200">
              <ImagePlus size={22} />
            </span>
            <span>imagesCenter</span>
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">
              {isSignup ? "New account" : "Account access"}
            </p>
            <h2 className="mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
              {isSignup ? "Sign up" : "Login"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
              {isSignup ? "Create an account to start saving your image workflow." : "Enter your credentials to access your workspace."}
            </p>
          </div>

          <div className="mt-8 grid max-w-md gap-4">
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
                <span className="relative block">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20" placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </span>
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20" placeholder="you@example.com" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Password</span>
              <span className="relative block">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:ring-blue-500/20" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              </span>
            </label>
          </div>

          <button className="saas-button mt-6 max-w-md disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="mt-6 max-w-md text-center text-sm text-slate-500 dark:text-slate-300">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link href={switchHref} className="font-black text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200">
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
