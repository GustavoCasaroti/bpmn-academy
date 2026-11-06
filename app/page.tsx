"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Shapes, Target, Workflow } from "lucide-react";
import { ThreeDButton } from "@/components/evil-buttons/3d-button";
import FluidOrb from "@/components/ui/fluid-orb";
import { BrandMark } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BpmnSymbolGlyph, SYMBOL_BOX } from "@/components/bpmn/BpmnGlyph";
import { SITE } from "@/data/config";
import { modules, totalLessons } from "@/data/modules";
import { bpmnSymbols } from "@/data/symbols";
import { processExamples } from "@/data/examples";
import { quizQuestions } from "@/data/quiz";
import type { BpmnSymbolRender } from "@/types";

/**
 * Página inicial (Get Started).
 * Apresenta a plataforma antes do dashboard; o CTA principal navega
 * para /dashboard (Neon Edge Button).
 */

const FLOW: Array<{
  render: BpmnSymbolRender;
  label: string;
  fit: { width: number; height: number };
}> = [
  {
    render: { kind: "event", phase: "start", marker: "none" },
    label: "Evento de início",
    fit: { width: 56, height: 56 },
  },
  {
    render: { kind: "task", taskType: "user" },
    label: "Tarefa de usuário",
    fit: { width: 168, height: 66 },
  },
  {
    render: { kind: "gateway", gateway: "exclusive" },
    label: "Gateway exclusivo",
    fit: { width: 66, height: 66 },
  },
  {
    render: { kind: "task", taskType: "service" },
    label: "Tarefa de serviço",
    fit: { width: 168, height: 66 },
  },
  {
    render: { kind: "event", phase: "end", marker: "none" },
    label: "Evento de fim",
    fit: { width: 56, height: 56 },
  },
];

const HIGHLIGHTS = [
  {
    icon: Shapes,
    title: "Símbolos BPMN",
    description:
      "Eventos, atividades, gateways e conexões explicados com finalidade, exemplos e erros comuns.",
    href: "/simbolos",
    cta: "Abrir a biblioteca",
  },
  {
    icon: Workflow,
    title: "Interpretação de processos",
    description:
      "Diagramas completos comentados para ler fluxos reais do início ao fim com segurança.",
    href: "/exemplos",
    cta: "Ver exemplos",
  },
  {
    icon: Target,
    title: "Resolução de problemas",
    description:
      "Identifique falhas, corrija fluxos e monte diagramas no laboratório e nos desafios.",
    href: "/laboratorio",
    cta: "Ir para o laboratório",
  },
];

const STATS = [
  { value: `${modules.length}`, label: "módulos de estudo" },
  { value: `${totalLessons}`, label: "lições guiadas" },
  { value: `${bpmnSymbols.length}`, label: "símbolos BPMN 2.0" },
  { value: `${processExamples.length}`, label: "processos comentados" },
  { value: `${quizQuestions.length}`, label: "questões de quiz" },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      {/* ---------------- Header ---------------- */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            aria-label={SITE.name}
            className="rounded-lg transition-opacity hover:opacity-80"
          >
            <BrandMark size={36} />
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-ink-muted transition hover:bg-surface-sunk hover:text-ink sm:block"
            >
              Dashboard
            </Link>
            <ThemeToggle className="h-10 w-10" size={18} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden">
          {/* Fluid Orb decorativo — uso pontual, não interativo, sem competir com o conteúdo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 select-none opacity-[0.35] dark:opacity-40 sm:-right-16 sm:-top-24"
          >
            <FluidOrb size={420} color="#8b5cf6" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                BPMN Academy · Plataforma de aprendizado
              </p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Aprenda BPMN de forma visual, prática e progressiva
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                <strong className="font-semibold text-ink">
                  BPMN (Business Process Model and Notation)
                </strong>{" "}
                é o padrão internacional para modelar processos de negócio.
                Com eventos, atividades e gateways, você transforma fluxos
                reais em diagramas claros e padronizados.
              </p>
              <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                A BPMN Academy acompanha você da teoria à aplicação: estude os
                símbolos, interprete processos completos e resolva problemas no
                laboratório interativo.
              </p>

              {/* CTA principal — 3D Button (evilbuttons) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ThreeDButton
                  onClick={() => router.push("/dashboard")}
                  className="min-h-12 text-[15px] shadow-[0_0_28px_-12px_rgba(139,92,246,0.65)]"
                >
                  Começar a aprender
                </ThreeDButton>
                <Link
                  href="/simbolos"
                  className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-ink-muted transition hover:text-ink"
                >
                  Explorar os símbolos BPMN
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Faixa de fluxo decorativa com os símbolos reais da notação */}
              <div
                aria-hidden="true"
                className="scrollbar-thin mt-12 flex flex-nowrap items-center justify-start gap-x-2 gap-y-3 overflow-x-auto rounded-2xl border border-line bg-surface-raised/70 px-4 py-5 backdrop-blur sm:flex-wrap sm:overflow-visible"
              >
                {FLOW.map((item, index) => (
                  <div key={item.label} className="flex flex-shrink-0 items-center gap-2">
                    {index > 0 && (
                      <svg
                        width="26"
                        height="10"
                        viewBox="0 0 26 10"
                        fill="none"
                        className="text-ink-subtle"
                      >
                        <path
                          d="M0 5h20m0 0-4-4m4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <BpmnSymbolGlyph
                      render={item.render}
                      label={item.label}
                      fit={item.fit}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Destaques ---------------- */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, description, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-line bg-surface-raised p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-sunk text-brand-600 dark:text-brand-400">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">
                  {title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
                  {cta}
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------- Números ---------------- */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-2xl border border-line bg-surface-raised px-4 py-6 sm:px-8">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <dt className="text-2xl font-semibold tracking-tight text-ink">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-ink-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------------- CTA final ---------------- */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface-sunk px-6 py-12 text-center">
            <BrandMark size={56} />
            <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Pronto para modelar o seu primeiro processo?
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-ink-muted sm:text-base">
              Acesse o dashboard, continue sua trilha de aprendizado e evolua
              no seu ritmo.
            </p>
            <ThreeDButton
              onClick={() => router.push("/dashboard")}
              className="min-h-12 text-[15px] shadow-[0_0_28px_-12px_rgba(139,92,246,0.65)]"
            >
              Começar a aprender
            </ThreeDButton>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
          <Link
            href="/"
            aria-label={`Voltar para a página inicial — ${SITE.name}`}
            className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-80"
          >
            <BrandMark size={28} />
            <span className="text-sm font-semibold text-ink">{SITE.name}</span>
          </Link>
          <p className="text-xs text-ink-subtle">
            {SITE.tagline} · Notação BPMN 2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
