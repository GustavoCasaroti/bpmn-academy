/**
 * Tipos centrais da plataforma BPMN Academy.
 * Todo o conteúdo (dados) e toda a UI compartilham estes contratos.
 */

/* ------------------------------------------------------------------ */
/* 1. Símbolos BPMN                                                    */
/* ------------------------------------------------------------------ */

export type SymbolCategory =
  | "event"
  | "activity"
  | "gateway"
  | "connection"
  | "structure"
  | "artifact";

export type EventPhase = "start" | "intermediate" | "end";

/**
 * Marcadores internos dos eventos (BPMN 2.0).
 * A forma dos eventos é sempre circular; o marcador interno diferencia o tipo.
 */
export type EventMarker =
  | "none"
  | "message"
  | "timer"
  | "error"
  | "escalation"
  | "cancel"
  | "compensation"
  | "conditional"
  | "signal"
  | "link"
  | "multiple"
  | "parallelMultiple"
  | "terminate";

/** Tipos de tarefa conforme o ícone no canto superior esquerdo. */
export type TaskType =
  | "none"
  | "user"
  | "service"
  | "manual"
  | "send"
  | "receive"
  | "script"
  | "businessRule";

export type ActivityKind =
  | "task"
  | "subProcess"
  | "expandedSubProcess"
  | "callActivity";

export type GatewayType =
  | "exclusive"
  | "parallel"
  | "inclusive"
  | "eventBased"
  | "complex";

export type ConnectionType =
  | "sequence"
  | "message"
  | "association"
  | "dataInput"
  | "dataOutput";

export type StructureKind = "pool" | "lane" | "participant" | "milestone";

export type ArtifactKind =
  | "dataObject"
  | "dataStore"
  | "group"
  | "textAnnotation";

/** Como o símbolo deve ser desenhado (forma oficial BPMN 2.0). */
export type BpmnSymbolRender =
  | { kind: "event"; phase: EventPhase; marker?: EventMarker }
  | { kind: "task"; taskType?: TaskType }
  | { kind: "activity"; activity: ActivityKind; taskType?: TaskType }
  | { kind: "gateway"; gateway: GatewayType }
  | { kind: "connection"; connection: ConnectionType }
  | { kind: "structure"; structure: StructureKind }
  | { kind: "artifact"; artifact: ArtifactKind };

export interface BpmnSymbol {
  id: string;
  category: SymbolCategory;
  namePt: string;
  nameEn: string;
  /** Explicação simples (1 a 2 frases). */
  summary: string;
  /** Qual é a finalidade do símbolo. */
  purpose: string;
  /** Quando utilizar. */
  whenToUse: string;
  /** Exemplo prático de uso. */
  example: string;
  /** Erros comuns de utilização. */
  commonErrors: string[];
  /** Termos de pesquisa. */
  keywords: string[];
  /** Como desenhar o símbolo. */
  render: BpmnSymbolRender;
  /** Mini-diagrama mostrando o símbolo aplicado em um processo real. */
  miniExample?: {
    caption: string;
    diagram: BpmnDiagram;
    highlightNodeIds: string[];
  };
}

export interface SymbolCategoryInfo {
  id: SymbolCategory;
  name: string;
  description: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/* 2. Diagramas BPMN (modelo de dados independente de UI)              */
/* ------------------------------------------------------------------ */

export type NodeKind =
  | "start"
  | "intermediate"
  | "end"
  | "task"
  | "subProcess"
  | "expandedSubProcess"
  | "callActivity"
  | "gateway"
  | "pool"
  | "lane"
  | "dataObject"
  | "dataStore"
  | "group"
  | "annotation";

export interface BpmnNodeData {
  label?: string;
  /** Eventos */
  phase?: EventPhase;
  marker?: EventMarker;
  /** Atividades */
  taskType?: TaskType;
  activity?: ActivityKind;
  /** Gateway */
  gateway?: GatewayType;
  /** Estrutura */
  poolName?: string;
  laneName?: string;
  /** Artefatos */
  artifactKind?: ArtifactKind;
  /** Destaque para modos de identificação/simulação */
  correctAnswer?: string;
}

export interface BpmnNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** Refers ao pool ao qual o nó pertence (validação de fluxo entre pools). */
  poolId?: string;
  laneId?: string;
  data: BpmnNodeData;
}

export type EdgeKind = "sequence" | "message" | "association";

export interface BpmnEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeKind;
  label?: string;
}

export interface BpmnDiagram {
  nodes: BpmnNode[];
  edges: BpmnEdge[];
}

/* ------------------------------------------------------------------ */
/* 3. Validação de processos                                           */
/* ------------------------------------------------------------------ */

export type ValidationIssueCode =
  | "no-start"
  | "multiple-starts"
  | "no-end"
  | "start-without-outgoing"
  | "end-without-incoming"
  | "end-with-outgoing"
  | "isolated-node"
  | "task-without-incoming"
  | "task-without-outgoing"
  | "gateway-without-incoming"
  | "gateway-single-path"
  | "gateway-without-labels"
  | "exclusive-without-decision-labels"
  | "sequence-between-pools"
  | "disconnected-path"
  | "cycle-back-to-start"
  | "missing-required-symbol"
  | "empty-diagram"
  | "message-flow-to-self"
  | "parallel-with-decision"
  | "task-as-decision"
  | "orphan-message-flow";

export type ValidationSeverity = "error" | "warning" | "success";

export interface ValidationIssue {
  code: ValidationIssueCode;
  severity: ValidationSeverity;
  /** Título curto do problema. */
  title: string;
  /** Explicação detalhada do problema. */
  detail: string;
  /** Como corrigir. */
  hint: string;
  /** IDs dos elementos envolvidos (para destaque visual). */
  nodeIds: string[];
}

export interface ValidationResult {
  valid: boolean;
  score: number; // 0..100
  issues: ValidationIssue[];
}

/* ------------------------------------------------------------------ */
/* 4. Simulação de processos                                           */
/* ------------------------------------------------------------------ */

export interface SimulationOption {
  label: string;
  edgeId: string;
  /** Texto exibido ao final deste caminho. */
  outcome?: string;
}

export interface SimulationDecision {
  nodeId: string;
  question: string;
  options: SimulationOption[];
}

export interface SimulationConfig {
  startNodeId: string;
  decisions: SimulationDecision[];
  endings: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* 5. Exemplos de processos                                            */
/* ------------------------------------------------------------------ */

export interface ProcessStep {
  index: number;
  title: string;
  text: string;
  nodeIds: string[];
}

export interface ProcessExample {
  id: string;
  title: string;
  category: string;
  difficulty: "facil" | "medio" | "avancado";
  /** Problema que o processo resolve. */
  problem: string;
  /** Descrição do cenário. */
  scenario: string;
  diagram: BpmnDiagram;
  /** Explicação passo a passo do fluxo. */
  steps: ProcessStep[];
  /** IDs dos símbolos utilizados. */
  symbolsUsed: string[];
  /** Justificativa das decisões e gateways. */
  decisions: { node: string; text: string }[];
  simulation?: SimulationConfig;
}

/* ------------------------------------------------------------------ */
/* 6. Desafios (Laboratório BPMN)                                      */
/* ------------------------------------------------------------------ */

export type ChallengeMode = "build" | "fix" | "identify" | "simulate";

export type ChallengeDifficulty = "facil" | "medio" | "avancado";

export interface KnownIssue {
  id: string;
  title: string;
  explanation: string;
  fix: string;
}

export interface IdentifyQuestion {
  nodeId: string;
  question: string;
  options: string[];
  correctOptionId: string;
  explanation: string;
}

export interface Challenge {
  id: string;
  mode: ChallengeMode;
  title: string;
  situation: string;
  difficulty: ChallengeDifficulty;
  moduleId: string;
  xp: number;
  /** Desafio só aparece após concluir estes módulos. */
  unlockAfter: string[];

  /* Modo "Monte o processo" */
  requiredSymbols?: string[];
  /** Número mínimo de tarefas esperadas. */
  minTasks?: number;
  minEndEvents?: number;
  /** Condição (gateway) obrigatória com pelo menos 2 saídas rotuladas. */
  requireDecision?: boolean;

  /* Modo "Corrija o processo" */
  initialDiagram?: BpmnDiagram;
  knownIssues?: KnownIssue[];
  /** Códigos de problema que existem no diagrama inicial. O desafio é
   *  considerado resolvido quando nenhum deles persiste e não há novos erros. */
  expectedIssueCodes?: ValidationIssueCode[];

  /* Modo "Identifique os símbolos" */
  identifyDiagram?: BpmnDiagram;
  identifyQuestions?: IdentifyQuestion[];

  /* Modo "Simulação" */
  simulation?: SimulationConfig;

  /** Solução de referência (usada em feedback e no modo fix). */
  solution?: BpmnDiagram;

  feedback: {
    success: string;
    hints: string[];
  };
}

/* ------------------------------------------------------------------ */
/* 7. Quiz                                                             */
/* ------------------------------------------------------------------ */

export type QuizCategory =
  | "fundamentos"
  | "eventos"
  | "atividades"
  | "gateways"
  | "conexoes"
  | "pools"
  | "interpretacao"
  | "pratica";

export type QuizDifficulty = "facil" | "intermediario" | "avancado";

export type QuestionType = "mcq" | "truefalse" | "symbol" | "diagram";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  type: QuestionType;
  statement: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  /** Tipo "symbol": exibe este símbolo. */
  symbolId?: string;
  /** Tipo "diagram": exibe este diagrama. */
  diagram?: BpmnDiagram;
  /** IDs de nós a destacar no diagrama da questão. */
  highlightNodeIds?: string[];
}

export interface QuizAttempt {
  id: string;
  startedAt: number;
  finishedAt: number;
  correct: number;
  total: number;
  score: number; // percentual 0..100
  xp: number;
  byCategory: Record<string, { correct: number; total: number }>;
  questionIds: string[];
}

/* ------------------------------------------------------------------ */
/* 8. Trilha de aprendizado                                            */
/* ------------------------------------------------------------------ */

export type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "callout";
      tone: "info" | "tip" | "warning";
      title: string;
      text: string;
    }
  | { type: "bullets"; items: string[] }
  | { type: "symbolCards"; symbolIds: string[] }
  | { type: "diagram"; diagram: BpmnDiagram; caption: string; highlightNodeIds?: string[] }
  | {
      type: "comparison";
      header: [string, string];
      rows: { label: string; a: string; b: string }[];
    }
  | { type: "steps"; items: { title: string; text: string }[] };

export interface ModuleLesson {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface LearningModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  /** Nome do ícone Lucide usado na UI. */
  icon: string;
  summary: string;
  lessons: ModuleLesson[];
  challengeIds: string[];
  quizCategories: QuizCategory[];
  /** Módulos que precisam ser concluídos antes. */
  unlockAfter: string[];
}

/* ------------------------------------------------------------------ */
/* 9. Gamificação                                                      */
/* ------------------------------------------------------------------ */

export interface Level {
  level: number;
  name: string;
  minXp: number;
  description: string;
}

export type AchievementIcon =
  | "trophy"
  | "star"
  | "flame"
  | "target"
  | "book"
  | "layers"
  | "zap"
  | "medal"
  | "check"
  | "brain";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: AchievementIcon;
  xpReward: number;
}

export type ActivityType =
  | "lesson"
  | "module"
  | "challenge"
  | "quiz"
  | "symbol"
  | "page";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  label: string;
  at: number;
  xp: number;
}

export interface ChallengeProgress {
  challengeId: string;
  completedAt: number;
  score: number;
  attempts: number;
  xp: number;
}

export interface UserProgress {
  version: number;
  xp: number;
  completedLessons: string[]; // `${moduleId}::${lessonId}`
  completedModules: string[];
  challenges: Record<string, ChallengeProgress>;
  quizAttempts: QuizAttempt[];
  achievements: string[];
  visitedSymbols: string[];
  activity: ActivityEntry[];
  streak: number;
  lastActiveDay: string; // YYYY-MM-DD
}

/* ------------------------------------------------------------------ */
/* 10. Navegação                                                       */
/* ------------------------------------------------------------------ */

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
}
