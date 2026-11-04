import { cn } from "@/lib/utils";

/**
 * Identidade visual BPMN Academy.
 * Marca derivada do símbolo oficial de formatura (chapéu) sobre uma linha
 * de fluxo — mesma linguagem do favicon. Vetorial, legível em 16px.
 */

interface MarkProps {
  size?: number;
  /** Inclui o fundo arredondado (usado no favicon e na barra lateral). */
  background?: boolean;
  className?: string;
  title?: string;
}

export function BrandMark({
  size = 36,
  background = true,
  className,
  title = "BPMN Academy",
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn(background && "rounded-[14px]", className)}
    >
      <defs>
        <linearGradient id="bpmn-cap-top" x1="10" y1="15" x2="54" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bpmn-cap-base" x1="22" y1="28" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="bpmn-cap-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2effe" />
          <stop offset="1" stopColor="#e7e3fd" />
        </linearGradient>
      </defs>

      {background && <rect width="64" height="64" rx="14" fill="url(#bpmn-cap-bg)" />}

      {/* Corpo do chapéu (atrás da placa) */}
      <path
        d="M23 29v7.5c0 4.1 3.4 7.5 7.5 7.5h4c4.1 0 7.5-3.4 7.5-7.5V29L32.5 34z"
        fill="url(#bpmn-cap-base)"
      />
      {/* Placa (losango) */}
      <path d="M32 15 54.5 24 32 33 9.5 24z" fill="url(#bpmn-cap-top)" />
      {/* Cordão e borla */}
      <path d="M52.5 25.5v9.5" stroke="#4338ca" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="52.5" cy="37.5" r="3.2" fill="#6d28d9" />
      <path
        d="M52.5 40.6c2.3 2.9 3.4 4.8 3.4 6.1a3.4 3.4 0 1 1-6.8 0c0-1.3 1.1-3.2 3.4-6.1z"
        fill="#6d28d9"
      />
      {/* Linha de fluxo: três nós conectados */}
      <circle cx="17" cy="55" r="3" fill="#c4b5fd" />
      <path d="M21.5 55h5.5" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="55" r="3" fill="#a855f7" />
      <path d="M36.5 55h5.5" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
      <circle cx="47" cy="55" r="3" fill="#7c3aed" />
    </svg>
  );
}

/** Marca completa: ícone + nome do site. */
export function BrandLogo({
  size = 36,
  markBackground = true,
  className,
}: {
  size?: number;
  markBackground?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={size} background={markBackground} />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        BPMN Academy
      </span>
    </span>
  );
}
