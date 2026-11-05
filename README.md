# BPMN Academy 🎓

> Plataforma interativa para aprender, interpretar e construir diagramas de processos de negócio com **BPMN 2.0**.

Aplicação web completa, responsiva e sem backend — todo o progresso fica salvo no `localStorage` do navegador.

## ✨ Funcionalidades

- **🎓 Página inicial (Get Started)** — landing em `/` apresentando a plataforma, com identidade visual, símbolos em destaque e CTA principal para o dashboard
- **📊 Dashboard** — visão geral do progresso, nível, sequência de estudo e próximos passos sugeridos (em `/dashboard`)
- **🛤️ Trilha de aprendizado** — 7 módulos e 29 lições, do básico à aplicação prática, com diagramas comentados
- **🧩 Biblioteca de símbolos** — 40 símbolos BPMN 2.0 organizados em abas por categoria (eventos, atividades, gateways, conexões, pools/raias, artefatos), com pesquisa, filtro de não vistos e enquadramento proporcional dos símbolos nos cards
- **📁 Exemplos de processos** — 8 processos reais completos e comentados (compra, contratação, atendimento, aprovação etc.)
- **🧪 Laboratório BPMN** — 10 desafios nos 4 modos de jogo:
  - **Montar** — construa o diagrama a partir do zero com uma paleta de símbolos
  - **Corrigir** — diagramas com problemas intencionais validados pelas regras da notação
  - **Identificar** — reconheça os elementos clicando no diagrama
  - **Simular** — execute o fluxo escolhendo os caminhos nas decisões e veja o token percorrer o processo
- **❓ Quiz** — 100 questões em 8 categorias e 3 dificuldades, com explicação por questão e desempenho por categoria
- **🏆 Gamificação** — XP, 5 níveis, 8 conquistas, sequência de dias e histórico de atividades

## 🎯 Validação de diagramas

O laboratório valida diagramas contra as regras da notação BPMN 2.0 (ex.: exatamente um evento de início, atividades com fluxo de entrada e saída, gateways de divisão com mais de um ramo etc.), atribuindo pontuação e apontando correções específicas — sem depender de servidor.

## 🛠️ Stack tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) (App Router) | 15.5 | Framework e rotas |
| [React](https://react.dev) | 19.3 | UI |
| [TypeScript](https://www.typescriptlang.org) | 5.9 (strict) | Tipagem |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Estilos (tema claro/escuro por classe `dark`) |
| [React Flow](https://reactflow.dev) | 12.12 | Renderização e edição de diagramas |
| [Lucide](https://lucide.dev) | 1.66 | Ícones |
| Inter (`next/font`) | — | Tipografia global (variável `--font-sans`) |

## 🚀 Como rodar

Requisitos: [Node.js](https://nodejs.org) 18.18+.

```bash
# 1. Instalar dependências
npm install

# 2. Desenvolvimento (http://localhost:3000)
npm run dev

# 3. Build de produção
npm run build
npm start
```

## 📁 Estrutura do projeto

```
.
├── app/                    # Rotas (App Router)
│   ├── page.tsx            # Landing page (Get Started) em /
│   ├── icon.svg            # Favicon/identidade da marca
│   ├── layout.tsx          # Layout raiz (tipografia global, tema)
│   ├── (app)/              # Área da plataforma (shell + progresso)
│   │   ├── layout.tsx      # AppShell com sidebar/menu e ProgressProvider
│   │   ├── dashboard/      # Dashboard
│   │   ├── trilha/         # Trilha de aprendizado (+ [moduleId])
│   │   ├── simbolos/       # Biblioteca de símbolos
│   │   ├── exemplos/       # Exemplos de processos (+ [id])
│   │   ├── laboratorio/    # Desafios do jogo (+ [challengeId])
│   │   ├── quiz/           # Quiz de conhecimentos
│   │   └── conquistas/     # Gamificação e progresso
│   └── globals.css         # Variáveis de tema, tipografia e utilitários
├── components/
│   ├── layout/             # Shell da aplicação (sidebar, menu mobile) e ThemeToggle
│   ├── bpmn/               # Glifos e visualização de diagramas (React Flow)
│   ├── dashboard/          # Blocos de conteúdo (texto, diagramas, comparações)
│   ├── game/               # Paleta de símbolos e painel de validação
│   ├── quiz/               # Runner do quiz
│   └── ui/                 # Primitivas (Button, Card, Modal…), marca (Logo),
│                           # Neon Edge Button e Fluid Orb
├── data/                   # Conteúdo central: símbolos, módulos, exemplos, quiz, desafios
├── lib/                    # Regras puras: validação, simulação, progresso, store
└── types/                  # Contratos de tipos de todo o domínio
```

**Princípios adotados**

- Conteúdo e regras separados da UI (`data/` + `lib/` são puros, sem React)
- Sem backend: progresso, tema e conquistas em `localStorage` (`bpmn-academy:progress:v2`)
- Hidratação segura: leitura do storage apenas após a montagem (sem mismatch de SSR)
- Acessibilidade: contraste validado por Lighthouse (1.0), `aria-label` nos controles interativos
- Configurações visuais centralizadas: tipografia (`--font-sans`), identidade (marca/favicon) e tema em pontos únicos de alteração
- Modais renderizados via portal (`document.body`), imunes a ancestrais com `transform`/animação
- Overlays integrados ao histórico via `useHistoryDismiss`: o "voltar" do navegador/celular fecha modal e drawer (sem navegar), e fechar pelo X/Esc/backdrop limpa a entrada — sem entradas órfãs no histórico

## 📱 Responsividade

- **Desktop (≥1024px):** sidebar fixa com navegação completa; landing e biblioteca aproveitam a largura disponível
- **Mobile:** header compacto com botão de menu que abre um drawer com overlay (fechável por toque fora, X, Esc ou pelo botão "voltar" nativo); abas da biblioteca com rolagem horizontal; bottom-sheet para modais; tap targets ≥32px e texto ≥11px
- Tema claro/escuro com persistência e pré-aplicação via script anti-flashing
- Símbolos BPMN sempre enquadrados proporcionalmente, sem corte em nenhuma largura de tela

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
