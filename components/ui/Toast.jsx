"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(
    () => ({
      push(message, type = "info") {
        const id = crypto.randomUUID();
        setToasts((items) => [...items, { id, message, type }]);
        setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[min(92vw,380px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-2xl border p-4 text-sm shadow-2xl backdrop-blur-xl transition ${
              toast.type === "error"
                ? "border-red-200 bg-red-50/95 text-red-950 dark:border-red-500/30 dark:bg-red-950/90 dark:text-red-50"
                : toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50/95 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/90 dark:text-emerald-50"
                  : "border-blue-200 bg-white/95 text-slate-950 dark:border-white/10 dark:bg-slate-900/95 dark:text-white"
            }`}
            role="status"
          >
            <span className="mt-0.5">
              {toast.type === "error" ? <XCircle size={18} /> : toast.type === "success" ? <CheckCircle2 size={18} /> : <Info size={18} />}
            </span>
            <p className="flex-1 font-medium leading-6">{toast.message}</p>
            <button
              className="rounded-lg p-1 text-current/70 transition hover:bg-black/5 hover:text-current focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 dark:hover:bg-white/10"
              aria-label="Dismiss notification"
              onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
