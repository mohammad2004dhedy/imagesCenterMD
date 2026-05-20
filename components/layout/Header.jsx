"use client";

import Link from "next/link";
import { Clock3, Heart, ImagePlus, LayoutDashboard, LogOut, Menu, Moon, Search, Shield, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

function getPreferredTheme() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("imagescenter-theme");
  return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function Header({ user: providedUser }) {
  const { user: detectedUser, logout: logoutUser } = useAuth();
  const user = providedUser || detectedUser;
  const [dark, setDark] = useState(getPreferredTheme);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef(null);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    function closeOnOutside(event) {
      if (openRef.current && menuRef.current && !menuRef.current.contains(event.target)) {
        setClosing(true);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  function closeMenu() {
    if (!open) return;
    setClosing(true);
  }

  function toggleMenu() {
    if (open) {
      closeMenu();
      return;
    }
    setClosing(false);
    setOpen(true);
  }

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("imagescenter-theme", next ? "dark" : "light");
  }

  async function logout() {
    await logoutUser();
    window.location.href = "/login";
  }

  const routes = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/search", label: "Search", icon: Search },
        { href: "/favorites", label: "Favorites", icon: Heart },
        { href: "/history", label: "History", icon: Clock3 },
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin", icon: Shield }] : [])
      ]
    : [
        { href: "/", label: "Home", icon: Search }
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/78 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/72">
      <div className="saas-container flex min-h-16 items-center justify-between gap-5">
        <Link href="/" className="inline-flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl saas-gradient text-white shadow-lg shadow-blue-600/20">
            <ImagePlus size={20} />
          </span>
          <span className="text-xl font-black leading-none text-slate-950 dark:text-white sm:text-2xl">imagesCenter</span>
        </Link>

        <div ref={menuRef}>
          <button
            className="inline-flex h-11 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-105 hover:border-blue-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 dark:border-white/10 dark:bg-white/10 dark:text-white"
            onClick={toggleMenu}
            aria-label="Open navigation menu"
          >
            {open ? <X size={26} strokeWidth={2.6} /> : <Menu size={28} strokeWidth={2.6} />}
          </button>

          {(open || closing) && (
            <nav
              className={`fixed right-4 top-20 z-40 max-h-[calc(100vh-96px)] w-[min(88vw,340px)] overflow-y-auto rounded-3xl border border-slate-200 bg-white/95 p-3 text-slate-900 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition duration-300 dark:border-white/10 dark:bg-slate-900/95 dark:text-white ${
                closing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
              }`}
              onTransitionEnd={() => {
                if (closing) {
                  setOpen(false);
                  setClosing(false);
                }
              }}
            >
              {routes.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 font-black transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 dark:hover:bg-white/10" onClick={closeMenu}>
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}

              <div className="mt-3 flex min-h-[52px] items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 font-black dark:bg-white/10">
                <span>{dark ? "Dark mode" : "Light mode"}</span>
                <button
                  className={`relative h-8 w-14 rounded-full border border-slate-200 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 dark:border-white/20 ${dark ? "bg-blue-600" : "bg-slate-200"}`}
                  onClick={toggleDark}
                  aria-label="Toggle dark mode"
                  aria-pressed={dark}
                >
                  <span className={`absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-blue-700 transition ${dark ? "translate-x-6 text-slate-950" : ""}`}>
                    {dark ? <Moon size={14} /> : <Sun size={14} />}
                  </span>
                </button>
              </div>

              <div className="my-3 h-px bg-slate-200 dark:bg-white/10" />

              {user ? (
                <button className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 font-black text-red-600 transition hover:-translate-y-0.5 hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 dark:text-red-200 dark:hover:bg-red-500/10" onClick={logout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="grid gap-3">
                  <Link href="/login" className="saas-button" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link href="/signup" className="saas-button-secondary" onClick={closeMenu}>
                    Create account
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
