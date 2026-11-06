"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { NAV_ITEMS, SITE } from "@/data/config";
import { getIcon } from "@/lib/icons";
import { levelFromXp, levelProgress, nextLevel } from "@/lib/progress";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui";
import { useHistoryDismiss } from "@/components/ui/useHistoryDismiss";
import { BrandMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

function NavList({
  pathname,
  onNavigate,
  compact = false,
}: {
  pathname: string;
  onNavigate?: (href: string) => void;
  compact?: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = getIcon(item.icon);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                : "text-ink-muted hover:bg-surface-sunk hover:text-ink"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "bg-surface-sunk text-ink-subtle group-hover:text-ink-muted"
              )}
            >
              <Icon size={16} strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{item.label}</span>
              {!compact && item.description && (
                <span className="block truncate text-xs font-normal text-ink-subtle">
                  {item.description}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function LevelCard() {
  const { progress, ready } = useProgressStore();
  const level = levelFromXp(progress.xp);
  const next = nextLevel(progress.xp);
  const pct = levelProgress(progress.xp);

  return (
    <div className="rounded-xl border border-line bg-surface-raised p-3.5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
          Nível {level.level}
        </span>
        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
          {ready ? `${progress.xp} XP` : "— XP"}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-ink">{level.name}</p>
      <ProgressBar value={pct} className="mt-2 h-1.5" />
      <p className="mt-1.5 text-xs text-ink-subtle">
        {next
          ? `${Math.max(0, next.minXp - progress.xp)} XP para ${next.name}`
          : "Nível máximo alcançado"}
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  /**
   * Histórico: "voltar" do dispositivo fecha o drawer em vez de navegar;
   * fechar pelo X/Esc/backdrop remove a entrada do histórico.
   */
  const requestClose = useHistoryDismiss(menuOpen, closeMenu);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, requestClose]);

  return (
    <div className="min-h-screen bg-surface">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-line bg-surface-raised lg:flex">
        <div className="px-5 py-5">
          <Link
            href="/"
            aria-label={`Voltar para a página inicial — ${SITE.name}`}
            className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
          >
            <BrandMark size={36} />
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              {SITE.name}
            </span>
          </Link>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
          <NavList pathname={pathname} />
        </div>

        <div className="border-t border-line px-4 py-4">
          <LevelCard />
        </div>
      </aside>

      {/* ---------- Header (mobile) ---------- */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface-raised/90 px-4 backdrop-blur lg:hidden">
        <Link
          href="/"
          aria-label={`Voltar para a página inicial — ${SITE.name}`}
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
        >
          <BrandMark size={32} />
          <span className="text-sm font-semibold text-ink">{SITE.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle className="h-10 w-10" size={18} />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-sunk"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* ---------- Drawer (mobile) ---------- */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) requestClose();
          }}
        >
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-xs flex-col bg-surface-raised shadow-pop animate-slide-in-right">
            <div className="flex items-center justify-between px-4 py-4">
              <Link
                href="/"
                aria-label={`Voltar para a página inicial — ${SITE.name}`}
                onClick={requestClose}
                className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
              >
                <BrandMark size={36} />
                <span className="text-sm font-semibold text-ink">
                  {SITE.name}
                </span>
              </Link>
              <button
                onClick={requestClose}
                aria-label="Fechar menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunk sm:h-10 sm:w-10"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
              <NavList
                pathname={pathname}
                onNavigate={(href) => {
                  // Rota diferente: a navegação fecha o drawer (o histórico
                  // é resolvido pós-navegação, sem entrada órfã pendente).
                  // Mesma rota: fecha como um fechamento explícito.
                  if (href === pathname) requestClose();
                }}
              />
            </div>
            <div className="border-t border-line px-4 py-4">
              <LevelCard />
            </div>
          </div>
        </div>
      )}

      {/* ---------- Main ---------- */}
      <div className="lg:pl-72">
        <div className="hidden h-16 items-center justify-between gap-4 border-b border-line bg-surface-raised/80 px-6 backdrop-blur lg:flex">
          <p className="text-sm text-ink-muted">{SITE.tagline}</p>
          <div className="flex items-center gap-3">
            <Link
              href="/laboratorio"
              className="text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              Laboratório
            </Link>
            <Link
              href="/quiz"
              className="text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              Quiz
            </Link>
            <ThemeToggle className="border border-line" />
          </div>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
