# BPMN Academy 🎓

> Plataforma interativa para aprender, interpretar e construir diagramas de processos de negócio com **BPMN 2.0**.

Aplicação web completa, responsiva e sem backend — todo o progresso fica salvo no `localStorage` do navegador.

## ✨ Funcionalidades

- **📊 Dashboard** — visão geral do progresso, nível, sequência de estudo e próximos passos sugeridos
- **🛤️ Trilha de aprendizado** — 7 módulos e 29 lições, do básico à aplicação prática, com diagramas comentados
- **🧩 Biblioteca de símbolos** — 40 símbolos BPMN 2.0 (eventos, atividades, gateways, conexões, artefatos) com filtro por categoria
- **📁 Exemplos de processos** — 8 processos reais completos e comentados (compra, contratação, atendimento, aprovação etc.)
- **🧪 Laboratório BPMN** — 10 desafios nos 4 modos de jogo:
  - **Montar** — construa o diagrama a partir do zero com uma paleta de símbolos
  - **Corrigir** — diagramas com problemas intencionais validados pelas regras da notação
  - **Identificar** — reconheça os elementos clicando no diagrama
  - **Simular** — execute o fluxo escolhendo os caminhos nas decisões e veja o token percorrer o processo
- **❓ Quiz** — 30 questões em 8 categorias e 3 dificuldades, com explicação por questão e desempenho por categoria
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
│   ├── page.tsx            # Dashboard
│   ├── trilha/             # Trilha de aprendizado (+ [moduleId])
│   ├── simbolos/           # Biblioteca de símbolos
│   ├── exemplos/           # Exemplos de processos (+ [id])
│   ├── laboratorio/        # Desafios do jogo (+ [challengeId])
│   ├── quiz/               # Quiz de conhecimentos
│   └── conquistas/         # Gamificação e progresso
├── components/
│   ├── layout/             # Shell da aplicação (sidebar, menu mobile, tema)
│   ├── bpmn/               # Glifos e visualização de diagramas (React Flow)
│   ├── dashboard/          # Blocos de conteúdo (texto, diagramas, comparações)
│   ├── game/               # Paleta de símbolos e painel de validação
│   ├── quiz/               # Runner do quiz
│   └── ui/                 # Primitivas (Button, Card, ProgressBar, Stat…)
├── data/                   # Conteúdo central: símbolos, módulos, exemplos, quiz, desafios
├── lib/                    # Regras puras: validação, simulação, progresso, store
├── types/                  # Contratos de tipos de todo o domínio
└── app/globals.css         # Variáveis de tema (claro/escuro)
```

**Princípios adotados**

- Conteúdo e regras separados da UI (`data/` + `lib/` são puros, sem React)
- Sem backend: progresso, tema e conquistas em `localStorage` (`bpmn-academy:progress:v2`)
- Hidratação segura: leitura do storage apenas após a montagem (sem mismatch de SSR)
- Acessibilidade: contraste validado por Lighthouse (1.0), `aria-label` nos controles interativos

## 📱 Responsividade

- **Desktop (≥1024px):** sidebar fixa com navegação completa
- **Mobile:** header compacto com botão de menu que abre um drawer com overlay
- Tema claro/escuro com persistência e pré-aplicação via script anti-flashing

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
