"use client";

import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import { BriefcaseBusiness } from "lucide-react";

const links = [
  { href: "https://www.facebook.com/share/1BC3LtK1qd/", label: "Facebook", icon: FaFacebook },
  { href: "https://www.instagram.com/m.dhedy.04?igsh=MXRkOGEwNWtzemQ5MQ==", label: "Instagram", icon: FaInstagram },
  { href: "https://github.com/mohammad2004dhedy", label: "GitHub", icon:FaGithub },
  { href: "https://mohammad2004dhedy.github.io/portfolio_official/", label: "Portfolio", icon: BriefcaseBusiness }
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60 py-6 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <div className="saas-container flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          © {new Date().getFullYear()} imagesCenter. Developed by mohammed dhedy.
        </p>
        <div className="flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:bg-white/10 dark:text-blue-200 dark:hover:bg-white/15"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
