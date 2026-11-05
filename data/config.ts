import type {
  ChallengeMode,
  NavItem,
  QuizCategory,
  QuizDifficulty,
  SymbolCategory,
} from "@/types";

/** Configuração central de navegação e rótulos da interface. */

export const SITE = {
  name: "BPMN Academy",
  shortName: "BPMN",
  tagline: "Aprenda BPMN na prática",
  description:
    "Plataforma interativa para aprender, interpretar e construir diagramas de processos de negócio com BPMN 2.0.",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", description: "Seu progresso e próximos passos" },
  { href: "/trilha", label: "Trilha de aprendizado", icon: "Route", description: "7 módulos do básico à aplicação" },
  { href: "/simbolos", label: "Biblioteca de símbolos", icon: "Shapes", description: "Todos os símbolos BPMN 2.0" },
  { href: "/exemplos", label: "Exemplos de processos", icon: "Workflow", description: "8 processos completos comentados" },
  { href: "/laboratorio", label: "Laboratório BPMN", icon: "FlaskConical", description: "Monte, corrija, identifique e simule" },
  { href: "/quiz", label: "Quiz de conhecimentos", icon: "HelpCircle", description: "100 questões avaliadas" },
  { href: "/conquistas", label: "Conquistas", icon: "Trophy", description: "Medalhas, níveis e histórico" },
];

export const SYMBOL_CATEGORY_LABELS: Record<SymbolCategory, string> = {
  event: "Eventos",
  activity: "Atividades",
  gateway: "Gateways",
  connection: "Conexões",
  structure: "Raias e participantes",
  artifact: "Artefatos",
};

export const QUIZ_CATEGORY_LABELS: Record<QuizCategory, string> = {
  fundamentos: "Fundamentos",
  eventos: "Eventos",
  atividades: "Atividades",
  gateways: "Gateways",
  conexoes: "Conexões",
  pools: "Pools e Lanes",
  interpretacao: "Interpretação de diagramas",
  pratica: "Situações práticas",
};

export const QUIZ_DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  facil: "Fácil",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const CHALLENGE_MODES: Record<
  ChallengeMode,
  { label: string; short: string; description: string; icon: string }
> = {
  build: {
    label: "Monte o processo",
    short: "Montar",
    description:
      "Leia a situação-problema, escolha os símbolos certos e construa o diagrama na área de construção.",
    icon: "Plus",
  },
  fix: {
    label: "Corrija o processo",
    short: "Corrigir",
    description:
      "Um diagrama com problemas intencionais: identifique e corrija os erros de notação.",
    icon: "Pencil",
  },
  identify: {
    label: "Identifique os símbolos",
    short: "Identificar",
    description:
      "Clique nos elementos do diagrama e diga qual símbolo BPMN cada um representa.",
    icon: "Shapes",
  },
  simulate: {
    label: "Simulação de processos",
    short: "Simular",
    description:
      "Execute o fluxo escolhendo os caminhos das decisões e veja o percurso destacado.",
    icon: "Play",
  },
};

export const DIFFICULTY_TONE: Record<
  string,
  "success" | "warning" | "danger" | "neutral"
> = {
  facil: "success",
  medio: "warning",
  avancado: "danger",
  intermediario: "warning",
};
