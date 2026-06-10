"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { authApi } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();
  const [message, setMessage] = useState("Completing secure sign in...");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    let active = true;

    async function finishLogin() {
      if (!supabase) {
        setMessage("Supabase Auth is not configured.");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.access_token) {
        setMessage("Unable to complete Google sign in.");
        return;
      }

      const result = await authApi.oauth({ accessToken: data.session.access_token });
      if (!active) return;

      if (!result.ok) {
        setMessage(result.message || "Unable to complete Google sign in.");
        return;
      }

      setUser(result.user || null);
      router.replace(params.get("next") || "/dashboard");
      router.refresh();
    }

    finishLogin();
    return () => {
      active = false;
    };
  }, [params, router, setUser, supabase]);

  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <section className="max-w-md">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Google Auth</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Please wait</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-300">{message}</p>
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
