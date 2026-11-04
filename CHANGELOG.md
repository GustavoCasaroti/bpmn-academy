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
