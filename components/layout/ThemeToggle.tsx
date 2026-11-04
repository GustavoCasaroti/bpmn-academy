"use client";

import { useEffect, useState } from "react";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Tema claro/escuro com persistência em localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("bpmn-academy:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("bpmn-academy:theme", next);
  };

  return { theme, toggle, mounted };
}

/**
 * Botão de alternância de tema (ícone outline único em toda a aplicação).
 * Usado no shell, no drawer mobile e na página inicial.
 */
export function ThemeToggle({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  const { theme, toggle, mounted } = useTheme();
  const Icon = mounted && theme === "dark" ? getIcon("Sun") : getIcon("Moon");

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-sunk",
        className
      )}
    >
      <Icon size={size} />
    </button>
  );
}
