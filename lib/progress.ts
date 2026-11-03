import type {
  Achievement,
  Level,
  QuizAttempt,
  UserProgress,
} from "@/types";

/**
 * Regras de gamificação — funções puras, sem acesso à UI ou ao localStorage.
 * Nenhum ponto é aleatório: tudo deriva de conclusões e desempenho.
 */

export const XP_RULES = {
  lesson: 40,
  module: 120,
  symbolView: 5,
  challengeBase: 60,
  quizPerCorrect: 6,
  quizCompletionBonus: 25,
  perfectQuizBonus: 50,
} as const;

export const LEVELS: Level[] = [
  {
    level: 1,
    name: "Iniciante",
    minXp: 0,
    description: "Primeiros passos na notação BPMN.",
  },
  {
    level: 2,
    name: "Explorador de processos",
    minXp: 400,
    description: "Já reconhece eventos, atividades e gateways.",
  },
  {
    level: 3,
    name: "Analista BPMN",
    minXp: 1000,
    description: "Interpreta e constrói processos com confiança.",
  },
  {
    level: 4,
    name: "Especialista em processos",
    minXp: 2000,
    description: "Domina regras de notação e boas práticas.",
  },
  {
    level: 5,
    name: "Mestre BPMN",
    minXp: 3200,
    description: "Referência em modelagem e correção de processos.",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-lesson",
    name: "Primeiro passo",
    description: "Concluiu a primeira lição da trilha.",
    icon: "book",
    xpReward: 30,
  },
  {
    id: "symbol-master",
    name: "Bibliotecário de símbolos",
    description: "Explorou a biblioteca completa de símbolos BPMN.",
    icon: "layers",
    xpReward: 80,
  },
  {
    id: "first-challenge",
    name: "Desafiante",
    description: "Concluiu o primeiro desafio do laboratório.",
    icon: "target",
    xpReward: 50,
  },
  {
    id: "streak-3",
    name: "Em sequência",
    description: "Concluiu atividades em 3 dias seguidos.",
    icon: "flame",
    xpReward: 100,
  },
  {
    id: "quiz-ace",
    name: "Nota máxima",
    description: "Tirou 100% em um quiz com ao menos 10 questões.",
    icon: "trophy",
    xpReward: 120,
  },
  {
    id: "module-fundamentos",
    name: "Fundamentos dominados",
    description: "Concluiu todas as lições do módulo Fundamentos.",
    icon: "check",
    xpReward: 60,
  },
  {
    id: "challenge-collector",
    name: "Colecionador de desafios",
    description: "Concluiu 5 desafios do laboratório.",
    icon: "medal",
    xpReward: 150,
  },
  {
    id: "path-complete",
    name: "Trilha concluída",
    description: "Concluiu todos os módulos da trilha de aprendizado.",
    icon: "star",
    xpReward: 300,
  },
];

export function levelFromXp(xp: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function nextLevel(xp: number): Level | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null;
}

/** Progresso (0-100) entre o nível atual e o próximo. */
export function levelProgress(xp: number): number {
  const current = levelFromXp(xp);
  const next = nextLevel(xp);
  if (!next) return 100;
  const span = next.minXp - current.minXp;
  if (span <= 0) return 100;
  return Math.round(((xp - current.minXp) / span) * 100);
}

export function xpForQuiz(attempt: Pick<QuizAttempt, "correct" | "total" | "score">): number {
  const base = attempt.correct * XP_RULES.quizPerCorrect + XP_RULES.quizCompletionBonus;
  return attempt.score === 100 && attempt.total >= 10
    ? base + XP_RULES.perfectQuizBonus
    : base;
}

/** Avaliação final do desempenho no quiz (0-100). */
export function quizPerformance(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
  if (totalQuestions === 0) return 0;
  return Math.round((totalCorrect / totalQuestions) * 100);
}

export function averageScore(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  return Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length);
}

export function bestScore(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0;
  return Math.max(...attempts.map((a) => a.score));
}

/** Métricas agregadas do usuário para o dashboard. */
export interface ProgressStats {
  xp: number;
  level: Level;
  levelPct: number;
  next: Level | null;
  lessonsDone: number;
  lessonsTotal: number;
  modulesDone: number;
  modulesTotal: number;
  challengesDone: number;
  challengesTotal: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  quizPerformance: number;
  streak: number;
  overallPct: number;
}

export function computeStats(
  progress: UserProgress,
  totals: {
    lessons: number;
    modules: number;
    challenges: number;
    achievements: number;
  }
): ProgressStats {
  const lessonsDone = progress.completedLessons.length;
  const modulesDone = progress.completedModules.length;
  const challengesDone = Object.keys(progress.challenges).length;
  const achievementsUnlocked = progress.achievements.length;

  const lessonsPct = totals.lessons ? lessonsDone / totals.lessons : 0;
  const modulesPct = totals.modules ? modulesDone / totals.modules : 0;
  const challengesPct = totals.challenges
    ? challengesDone / totals.challenges
    : 0;

  const overallPct = Math.round(
    (lessonsPct * 0.4 + modulesPct * 0.3 + challengesPct * 0.3) * 100
  );

  return {
    xp: progress.xp,
    level: levelFromXp(progress.xp),
    levelPct: levelProgress(progress.xp),
    next: nextLevel(progress.xp),
    lessonsDone,
    lessonsTotal: totals.lessons,
    modulesDone,
    modulesTotal: totals.modules,
    challengesDone,
    challengesTotal: totals.challenges,
    achievementsUnlocked,
    achievementsTotal: totals.achievements,
    quizPerformance: quizPerformance(progress.quizAttempts),
    streak: progress.streak,
    overallPct,
  };
}

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/** Conquistas elegíveis dado o estado atual (retorna recém-desbloqueadas). */
export function evaluateAchievements(
  progress: UserProgress,
  totals: {
    symbols: number;
    challenges: number;
    lessonsInFundamentos: number;
    lessons: number;
  }
): string[] {
  const unlocked = new Set(progress.achievements);
  const unlockedNow: string[] = [];
  const challengeCount = Object.keys(progress.challenges).length;
  const best = bestScore(progress.quizAttempts);

  const conditions: Record<string, boolean> = {
    "first-lesson": progress.completedLessons.length >= 1,
    "symbol-master": progress.visitedSymbols.length >= totals.symbols,
    "first-challenge": challengeCount >= 1,
    "streak-3": progress.streak >= 3,
    "quiz-ace":
      best === 100 &&
      progress.quizAttempts.some((a) => a.total >= 10 && a.score === 100),
    "module-fundamentos": progress.completedModules.includes("mod-fundamentos"),
    "challenge-collector": challengeCount >= Math.min(5, totals.challenges),
    "path-complete":
      progress.completedModules.length >= 7 && totals.lessons > 0,
  };

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (conditions[achievement.id]) unlockedNow.push(achievement.id);
  }

  return unlockedNow;
}
