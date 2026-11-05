# Changelog

Todas as alterações relevantes do BPMN Academy são documentadas neste arquivo.
Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## [Não publicado]

Alterações em revisão — nenhum commit realizado até o momento.

### Adicionado

#### Página inicial (Get Started)

- Nova landing page na rota principal `/`, com apresentação moderna e
  minimalista da plataforma: título convidativo, explicação objetiva de BPMN
  e do objetivo da plataforma, destaques para **símbolos**, **interpretação de
  processos** e **resolução de problemas**, além de estatísticas da plataforma
  e CTA final.
- **Neon Edge Button** (`components/ui/neon-edge-button.tsx`) instalado via
  shadcn (`Surajmaurya1/easyui/neon-edge-button`) e usado como CTA principal
  ("Começar a aprender"), navegando para `/dashboard`. A implementação
  original do componente foi preservada; a adaptação às cores da marca é feita
  apenas por props/`className` (`glow={false}` + sombra violeta) e pelo
  utilitário `.focus-ring` em `app/globals.css`.
- **Fluid Orb** (`components/ui/fluid-orb.tsx`) instalado via shadcn
  (`swamimalode07/rare-ui/fluid-orb`) e avaliado. Uso pontual e decorativo
  apenas no hero da landing (`aria-hidden`, sem interação, respeita
  `prefers-reduced-motion`, limpa recursos WebGL). Não foi adicionado em
  dashboards, cards ou indicadores para evitar poluição visual e competição
  de animações.
- Faixa de fluxo decorativa na landing com símbolos BPMN reais (início →
  tarefa → gateway → tarefa → fim) renderizados pelo próprio sistema de
  glifos.
- Cabeçalho e rodapé próprios da landing com marca, navegação para o
  dashboard e alternância de tema.

#### Quiz — expansão para 100 questões e revisão geral

- `data/quiz.ts` ampliado de **30 para 100 questões** (IDs `q-01` a `q-100`)
  em duas entregas: +10 no nível Avançado e depois +20 em **cada** nível
  (Fácil, Intermediário e Avançado). Distribuição final por nível:
  **Fácil 32, Intermediário 32, Avançado 36**; por tipo: **53 MCQ,
  22 V/F, 7 de símbolo e 18 de diagrama**; por categoria: fundamentos 16,
  gateways 15, eventos 14, atividades 14, conexões 12, interpretação 12,
  pools 9, práticas 8.
- **14 questões de diagrama para solução/leitura de fluxo adicionadas**
  (9 na primeira entrega, 5 na segunda): percurso do token em gateway
  exclusivo (`q-31`), retenção na junção paralela (`q-32`), atividade
  isolada (`q-33`), corrida no gateway baseado em eventos (`q-35`),
  fluxo de mensagem entre pools (`q-37`), leitura linear (`q-57`),
  caminho do exclusivo (`q-58`), inclusivo com duas condições (`q-78`),
  mensagem inválida dentro da mesma pool (`q-79`), objeto de dados em
  contexto (`q-87`), divisão paralela com junção exclusiva (`q-89`),
  evento de fim com saída (`q-95`), cruzamento de lanes (`q-96`) e
  evento de fronteira de temporizador (`q-99`).
- Temas novos cobrindo lacunas: OMG como publicador, evento condicional,
  sinal vs mensagem, tarefa de script, múltiplas instâncias, transação,
  compensação, escalonamento vs erro, coreografia, terminação, gateway
  complexo, fluxo padrão (default), marcos sem símbolo oficial, pool em
  caixa-preta, armazenamento de dados e grupos.
- **Revisão das 100 questões (estrutural + de conteúdo)**:
  - validação automatizada: IDs únicos, `correctOptionId` sempre presente
    nas opções, 2 opções em V/F e 4 nos demais tipos, `symbolId`s
    existentes em `data/symbols.ts`, `highlightNodeIds` presentes nos
    diagramas, arestas apontando nós válidos, zero enunciados duplicados
    e zero enunciados similares acima do limite (pares de mesmo molde
    reescritos: `q-52`, `q-70`, `q-73`, `q-93`);
  - conferência manual do par enunciado → resposta correta nas 100,
    incluindo consistência com os textos de `data/symbols.ts`.
- Referências de contagem atualizadas para 100: `data/config.ts`,
  `data/modules.ts` e `README.md`. As telas (`/`, `/quiz`, dashboard)
  usam `quizQuestions.length` e se ajustam automaticamente.

#### Integração com o botão "voltar" do navegador (mobile)

- Novo hook `components/ui/useHistoryDismiss.ts` que integra overlays
  (modal e drawer de navegação) com o histórico do navegador:
  - Ao abrir, o overlay empilha uma entrada no histórico (estado
    `__bpmnOverlay`); a pilha global (`openStack`) permite overlays
    aninhados, sempre fechando o do topo.
  - **Pressionar o "voltar" nativo do dispositivo com o overlay aberto
    fecha o overlay em vez de navegar para a página anterior** — correção
    do problema reportado na biblioteca de símbolos no mobile.
  - Fechar de forma explícita (X, Esc, backdrop) remove a entrada com
    `history.back()`, então o histórico não cresce a cada abertura e não
    ficam entradas "mortas".
  - Navegação feita com o overlay aberto (ex.: drawer → rota diferente)
    deixa uma entrada órfã, que é **pulada automaticamente** na primeira
    volta (guarda por contador `strandedOrphans` — sem depender da
    Navigation API, cujo `navigationType` o Next.js sobrescreve como
    `replace` durante o `popstate`).
- `Modal` (`components/ui/index.tsx`) e drawer do `AppShell` integrados ao
  hook via `requestClose`; backdrop trocado de `onMouseDown` para
  `onPointerDown` (mais confiável em toques).

#### Identidade visual

- Favicon `app/icon.svg` com a marca derivada da imagem de referência
  (chapéu de formatura em gradiente roxo/violeta + linha de fluxo com três
  nós), servido automaticamente pelo App Router e legível em 16px.
- `components/ui/Logo.tsx` com `BrandMark` (ícone vetorial) e `BrandLogo`
  (ícone + nome), usados na sidebar, no header mobile, no drawer e na landing
  — substituindo o bloco de texto `BPMN` que servia de logotipo.
- `components/layout/ThemeToggle.tsx`: `useTheme` e `ThemeToggle` extraídos do
  `AppShell` para reuso (shell + landing), mantendo a mesma persistência em
  `localStorage`.
- Ícones da interface padronizados na família outline (Lucide) — nenhum ícone
  genérico ou estilos misturados.

#### Tipografia

- Fonte global **Inter** (sans-serif moderna e legível) carregada via
  `next/font/google` no `app/layout.tsx`, com variável `--font-sans`
  declarada uma única vez.
- Configuração centralizada em `app/globals.css` (`--font-sans`,
  `--font-display`) com fallbacks — trocar a fonte da aplicação inteira
  acontece em um só lugar.
- Hierarquia existente (títulos, textos, botões, cards) preservada e
  aplicada sobre a nova família, sem famílias misturadas.

#### Biblioteca de símbolos (organização)

- Categorias reorganizadas em **abas** (`role="tablist"`) — Todos, Eventos,
  Atividades, Gateways, Objetos de conexão, Raias e participantes e
  Artefatos — com componente `SymbolTab` contendo `aria-selected`, contagem
  por categoria e indicador de cor.
- No desktop as abas usam a largura disponível (`max-w-7xl`); no mobile há
  rolagem horizontal (`overflow-x-auto`) com as abas sempre visíveis.
- Cards reposicionados em coluna: palco de símbolo em toda a largura do
  card, nome, nome em inglês, descrição resumida (`line-clamp-2`), selo de
  categoria e marcação de "já visitado" — acesso ao detalhe pelo próprio card
  (modal preservado).
- Toggle "Só não vistos" mantido fora do `tablist` (não é uma aba) com
  `aria-pressed`.

### Alterado

#### Quiz — limite de 35 questões por sessão e sorteio aleatório

- `components/quiz/QuizRunner.tsx`:
  - opções de quantidade passam de `5, 10, 15, 30` para
    **`5, 10, 15, 35`**, com constante `MAX_QUESTIONS = 35` — **acabou a
    opção "Todas"**: nenhum início de quiz ultrapassa 35 questões
    (teto aplicado também em `start()` via `Math.min(count,
    MAX_QUESTIONS, pool.length)`);
  - **sorteio garantido a cada início**: `start()` sempre reembaralha o
    pool com Fisher-Yates (`shuffle`) antes de cortar, então duas sessões
    com os mesmos filtros recebem seleções diferentes — inclusive no
    botão "Refazer com os mesmos filtros";
  - textos do setup atualizados: descrição explica o sorteio aleatório e o
    teto de 35, e o rodapé passa a exibir "sorteadas" em vez de
    "selecionadas".

#### Sistema de dimensionamento dos símbolos (correção principal)

- **Antes**: símbolos renderizados com tamanho fixo + `scale-*` de CSS,
  ultrapassando os limites de cards e containers (Pools, Service Task,
  Script Task, entre outros).
- **Agora**, em `components/bpmn/BpmnGlyph.tsx`:
  - `symbolIntrinsic(render)` — fonte única das dimensões intrínsecas de
    cada símbolo (eventos, tarefas, gateways, pools, artefatos, conexões).
  - `fitMaxScale(render)` — teto de ampliação por tipo (símbolos compactos
    ganham legibilidade; os extensos apenas reduzem), nunca distorcendo a
    proporção.
  - `SYMBOL_BOX` — caixas de enquadramento por contexto (`stage`, `detail`,
    `chip`, `tiny`, `micro`, `hero`).
  - `BpmnSymbolGlyph` aceita a prop `fit` e aplica enquadramento **fluido**:
    a caixa ocupa o espaço disponível limitada por `fit` e pelo teto de
    ampliação, e o SVG escala via `viewBox` + `preserveAspectRatio` —
    adaptando-se à largura real do container **sem corte, sem distorção e
    sem `overflow: hidden` indevido**.
- Marcadores internos, bordas, identificações (BPMN 2.0) e características de
  cada símbolo permanecem intactos — a alteração melhora o enquadramento,
  não o desenho.
- Call sites atualizados com as caixas adequadas:
  - `components/dashboard/ContentBlocks.tsx` → `SYMBOL_BOX.chip`
  - `components/game/SymbolPalette.tsx` → `SYMBOL_BOX.tiny`
  - `components/quiz/QuizRunner.tsx` → `SYMBOL_BOX.hero`
  - `app/(app)/exemplos/page.tsx` e `app/(app)/exemplos/[id]/page.tsx` →
    `SYMBOL_BOX.micro`
  - `app/(app)/simbolos/page.tsx` → `SYMBOL_BOX.stage` (cards) e
    `SYMBOL_BOX.detail` (modal)
- Substituídos os `scale-75`/`scale-90`/`scale-150` avulsos por este sistema.

#### Estrutura de rotas

- Rotas da área da plataforma movidas para o route group `app/(app)/`:
  - `/` (antigo dashboard) → **`/dashboard`**
  - `/trilha`, `/simbolos`, `/exemplos`, `/laboratorio`, `/quiz`,
    `/conquistas` inalteradas em URL
- Novo `app/(app)/layout.tsx` aplicando `ProgressProvider` + `AppShell` a
  todas as rotas da plataforma; a landing page fica fora do shell.
- `data/config.ts`: item de navegação "Início" → "Dashboard" (`/dashboard`),
  com destaque ativo corrigido para não considerar qualquer rota como ativa.
- `components/layout/AppShell.tsx`: usa `BrandMark` e `ThemeToggle`
  extraídos; lógica de rota ativa atualizada.

#### Build e dependências

- `components.json` criado manualmente (estilo new-york, Tailwind v3,
  aliases `@/`) para permitir `shadcn add` sem migração de Tailwind.
- `clsx` e `tailwind-merge` adicionados como dependências (exigidos pelos
  componentes shadcn). O `cn` próprio de `lib/utils.ts` foi **preservado**.
- Removido import não usado de `BpmnSymbolGlyph` em
  `app/(app)/laboratorio/[challengeId]/page.tsx`.

### Corrigido

- **Neon Edge Button da landing não girava em volta do botão** — o
  `conic-gradient` do beam terminava em um stop final **sem cor**
  (`..., 340deg, 360deg`), combinação **inválida no parse do Chromium**:
  a declaração `background` era descartada por inteiro e o beam ficava
  com `background-image: none` (a animação `rotate` "rodava" num elemento
  invisível; só o glow estático era perceptível). Diagnosticado com
  `CSS.supports` (bissecção do gradiente) e corrigido em
  `components/ui/neon-edge-button.tsx` com cor explícita em **todos**
  os stops (`rgba(255,255,255,0)` → `rgba(255,255,255,0.85)`).
  Verificado no browser: gradiente aplicado, animação `running` com o
  relógio avançando e arco visível percorrendo a borda no screenshot.
- **Neon Edge Button em tema claro** — o botão passou a ter fundo
  `bg-[#050505]` (o mesmo da superfície interior): sem isso, a base do
  anel era o fundo da página e o arco branco do neon ficava invisível
  sobre o claro (branco no branco). Agora o efeito é visível nos dois
  temas; no dark o detalhe é quase imperceptível.
- **Modal da biblioteca de símbolos não abria visivelmente** — o `position: fixed`
  do backdrop era capturado pelo `transform` mantido pela animação `fade-up` do
  wrapper da página (containing block), deixando o modal preso ao fluxo do
  documento e fora da viewport. O componente `Modal` agora é renderizado via
  `createPortal` em `document.body`, corrigindo isso em todas as páginas que
  utilizam modais.
- **Revisão mobile (responsividade)**:
  - **Overflow horizontal** em `/exemplos` e `/trilha/[moduleId]` —
    `grid-cols-1` (= `minmax(0,1fr)`) adicionado a 15 grids implícitos/
    explícitos em 4 páginas; trilhas com colunas `auto` inflavam com o
    min-content de linhas `truncate`/`flex-shrink-0`, ultrapassando a
    viewport. `min-w-0` na linha de símbolos dos cards e no aside da
    trilha.
  - **Faixa de fluxo da landing** — itens com `flex-shrink-0` e faixa em
    `flex-nowrap overflow-x-auto`: em vez de espremer os símbolos (714px
    em 311px), agora rola horizontalmente.
  - **Tap targets abaixo de 32px** — back-links, CTAs ("Ver todas",
    "Próximo passo", "Ver"), links "Ver" e controles do ReactFlow
    (32×32 via maior especificidade em `app/globals.css`); itens de 36px
    mantidos (passam WCAG AA).
  - **Texto abaixo de 11px** — labels de contagem de símbolos,
    `SymbolPalette` e badges do laboratório elevados para 11px (números
    dentro de círculos de 20px permanecem em 10px, por legibilidade
    intra-forma).
  - **Colisão de IDs de gradiente** — `BrandMark` gera IDs únicos via
    `useId()` (saneado), encerrando conflitos entre sidebar, header e
    drawer quando o mesmo gradiente é instanciado mais de uma vez.

### Validação

- `tsc --noEmit` sem erros.
- `npm run build` sem erros (12 rotas geradas, incluindo `/` e `/icon.svg`).
- Testes no navegador, sem erros de console em nenhuma rota:
  - Landing em `/` navega para `/dashboard` pelo Neon Edge Button.
  - Abas da biblioteca com contagens corretas (40/14/10/5/3/4/4).
  - **Zero overflow** medido em todos os símbolos: cards da biblioteca,
    modal de detalhe, paleta do laboratório, quiz, chips do dashboard e
    miniaturas dos exemplos.
  - Diagramas ReactFlow existentes renderizando normalmente
    (`/exemplos/ex-compra` com 12 nós; mini-exemplos nos modais).
  - Favicon servido (`/icon.svg`, `image/svg+xml`).
  - Tema claro/escuro funcional na landing e no shell.
  - Enquadramento validado em largura estreita (palco de 193px) e em
    desktop (1296px).
- **Auditoria mobile (viewport 345–360px) — 11 rotas**: zero overflow
  horizontal, zero tap targets <32px, zero textos <11px (exceto números
  em círculos, decisão registrada), marca presente em todas as rotas sem
  IDs duplicados.
- **Integração do "voltar" testada no navegador** (modal de símbolos e
  drawer, mobile e desktop):
  - "voltar" nativo com overlay aberto → fecha o overlay, **URL intacta**
    (`/simbolos`, `/dashboard`), `overflow` do body liberado.
  - X, backdrop (`pointerdown`) e Esc → fecham e removem a entrada do
    histórico (`__bpmnOverlay: false`).
  - Navegação pelo drawer → um único "voltar" cai direto na página de
    origem (órfã pulada), sem entradas mortas e sem loop no avançar.
  - Bottom-sheet do modal em mobile: colado na base, cantos arredondados,
    X de 44px, conteúdo com rolagem interna e `safe-area-inset-bottom`.
