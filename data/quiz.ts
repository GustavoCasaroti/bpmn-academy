import type { QuizQuestion } from "@/types";
import {
  box,
  d,
  e,
  n,
  ROW_BOTTOM,
  ROW_EXTRA,
  ROW_MAIN,
  ROW_TOP,
} from "@/data/diagram-helpers";

/**
 * 100 questões do quiz, distribuídas por categoria e dificuldade.
 * IDs: q-01 a q-100.
 * Por nível: Fácil (32), Intermediário (32) e Avançado (36).
 * Por tipo: 53 MCQ, 22 V/F, 7 de símbolo e 18 de diagrama
 * (leitura/solução de fluxo).
 */

export const quizQuestions: QuizQuestion[] = [
  /* ---------------- Fundamentos ---------------- */
  {
    id: "q-01",
    category: "fundamentos",
    difficulty: "facil",
    type: "mcq",
    statement:
      "O que é BPMN (Business Process Model and Notation)?",
    options: [
      { id: "a", text: "Uma linguagem de programação para automatizar processos" },
      { id: "b", text: "Uma notação gráfica padronizada para modelar processos de negócio" },
      { id: "c", text: "Um software de monitoramento de indicadores" },
      { id: "d", text: "Um banco de dados de processos corporativos" },
    ],
    correctOptionId: "b",
    explanation:
      "BPMN é uma notação gráfica padronizada pela OMG (ISO/IEC 19510) que usa símbolos específicos para descrever atividades, eventos e decisões de um processo. Ela não é uma linguagem de programação nem uma ferramenta.",
  },
  {
    id: "q-02",
    category: "fundamentos",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "BPMN serve para documentar processos de forma padronizada e compreensível por qualquer parte interessada.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Esse é o objetivo central da notação: criar uma linguagem comum entre analistas, gestores e equipes técnicas, reduzindo ambiguidades na comunicação sobre como o trabalho é feito.",
  },
  {
    id: "q-03",
    category: "fundamentos",
    difficulty: "facil",
    type: "mcq",
    statement: "Em BPMN, o que é uma atividade?",
    options: [
      { id: "a", text: "Um ponto de decisão com duas ou mais saídas" },
      { id: "b", text: "Uma ocorrência que inicia ou encerra o fluxo" },
      { id: "c", text: "Uma unidade de trabalho executada dentro do processo" },
      { id: "d", text: "A linha que conecta dois elementos" },
    ],
    correctOptionId: "c",
    explanation:
      "A atividade (task, subprocesso ou chamada) representa o trabalho realizado. Decisões são gateways, ocorrências são eventos e as linhas são fluxos de conexão.",
  },
  {
    id: "q-04",
    category: "fundamentos",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Qual das alternativas descreve corretamente a diferença entre processo, atividade, evento e fluxo?",
    options: [
      { id: "a", text: "Processo é uma tarefa isolada; evento é o seu fim" },
      {
        id: "b",
        text: "Processo é a sequência completa; atividade é o trabalho; evento é uma ocorrência; fluxo é a ordem entre eles",
      },
      { id: "c", text: "Todos os termos são sinônimos na prática" },
      { id: "d", text: "Evento é a atividade executada por um sistema" },
    ],
    correctOptionId: "b",
    explanation:
      "O processo é o fluxo completo de trabalho. Dentro dele há atividades (o que se faz), eventos (o que acontece) e fluxos de sequência (a ordem de execução).",
  },
  {
    id: "q-05",
    category: "fundamentos",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Sobre o uso de cores em diagramas BPMN, qual afirmação está correta?",
    options: [
      { id: "a", text: "A especificação define uma cor oficial para cada símbolo" },
      {
        id: "b",
        text: "As cores são opcionais: a padronização está na forma e na semântica dos elementos, não na cor",
      },
      { id: "c", text: "Cores diferentes mudam a semântica do elemento" },
      { id: "d", text: "Diagramas oficiais devem ser sempre em preto e branco" },
    ],
    correctOptionId: "b",
    explanation:
      "BPMN 2.0 padroniza formas e significados. Cores são um recurso de leitura e estilo adotado por cada equipe — desde que não contradigam a notação, elas são bem-vindas.",
  },

  /* ---------------- Eventos ---------------- */
  {
    id: "q-06",
    category: "eventos",
    difficulty: "facil",
    type: "symbol",
    statement: "Qual é o nome correto deste símbolo?",
    symbolId: "event-start-timer",
    options: [
      { id: "a", text: "Evento de início por temporizador" },
      { id: "b", text: "Evento intermediário de mensagem" },
      { id: "c", text: "Evento de fim por erro" },
      { id: "d", text: "Gateway baseado em eventos" },
    ],
    correctOptionId: "a",
    explanation:
      "O círculo de borda fina indica evento de início e o relógio interno é o marcador de temporizador: o processo começa em um horário ou intervalo definido.",
  },
  {
    id: "q-07",
    category: "eventos",
    difficulty: "intermediario",
    type: "truefalse",
    statement: "Um evento de fim pode ter fluxos de saída para outras etapas.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "O evento de fim encerra a instância do processo: ele nunca tem saídas. Se o fluxo continua depois dele, o elemento escolhido está errado — use um evento intermediário.",
  },
  {
    id: "q-08",
    category: "eventos",
    difficulty: "facil",
    type: "mcq",
    statement: "O que diferencia visualmente um evento de início de um intermediário?",
    options: [
      { id: "a", text: "O início tem marcador interno e o intermediário não" },
      { id: "b", text: "O início tem borda fina e o intermediário tem borda dupla" },
      { id: "c", text: "O início é quadrado e o intermediário é circular" },
      { id: "d", text: "O início é maior que o intermediário" },
    ],
    correctOptionId: "b",
    explanation:
      "A regra é a mesma para todos os marcadores: borda fina = início, borda dupla = intermediário e borda grossa = fim. O marcador interno diz o tipo de ocorrência.",
  },
  {
    id: "q-09",
    category: "eventos",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Uma atividade dentro de um subprocesso pode falhar e o fluxo precisa desviar. Qual elemento usar?",
    options: [
      { id: "a", text: "Evento de fim por erro conectado após a atividade" },
      {
        id: "b",
        text: "Evento intermediário de erro anexado à atividade (evento de fronteira)",
      },
      { id: "c", text: "Gateway exclusivo com a condição 'falhou'" },
      { id: "d", text: "Evento de início por erro antes da atividade" },
    ],
    correctOptionId: "b",
    explanation:
      "Falhas são capturadas por eventos intermediários de erro anexados à borda da atividade ou dentro de um evento de subprocesso. O erro é sempre lançado por uma atividade ou subprocesso.",
  },

  /* ---------------- Atividades ---------------- */
  {
    id: "q-10",
    category: "atividades",
    difficulty: "facil",
    type: "mcq",
    statement:
      "Qual tipo de tarefa representa uma ação executada automaticamente por um sistema?",
    options: [
      { id: "a", text: "Tarefa de usuário (User Task)" },
      { id: "b", text: "Tarefa manual (Manual Task)" },
      { id: "c", text: "Tarefa de serviço (Service Task)" },
      { id: "d", text: "Tarefa de recebimento (Receive Task)" },
    ],
    correctOptionId: "c",
    explanation:
      "A tarefa de serviço, marcada pela engrenagem, é executada por um aplicativo ou integração sem intervenção humana. Usuário é pessoa no sistema; manual é trabalho fora do sistema.",
  },
  {
    id: "q-11",
    category: "atividades",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "A tarefa de recebimento (Receive Task) pausa o processo até que uma mensagem chegue.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "A seta entrando na caixa indica que o processo aguarda uma mensagem. Enquanto ela não chega, o fluxo não avança para a etapa seguinte.",
  },
  {
    id: "q-12",
    category: "atividades",
    difficulty: "facil",
    type: "symbol",
    statement: "Qual é a finalidade deste símbolo?",
    symbolId: "task-manual",
    options: [
      { id: "a", text: "Tarefa executada por um sistema automaticamente" },
      { id: "b", text: "Tarefa executada fisicamente por uma pessoa, fora de um sistema" },
      { id: "c", text: "Tarefa que envia uma mensagem ao cliente" },
      { id: "d", text: "Subprocesso que pode ser expandido" },
    ],
    correctOptionId: "b",
    explanation:
      "O ícone de mão identifica a tarefa manual: trabalho operacional como conferir carga, imprimir documento ou montar um produto, sem apoio de software.",
  },
  {
    id: "q-13",
    category: "atividades",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Qual a diferença entre um subprocesso e uma atividade de chamada (Call Activity)?",
    options: [
      { id: "a", text: "Nenhuma; são dois nomes para o mesmo elemento" },
      {
        id: "b",
        text: "O subprocesso é interno ao processo; a chamada invoca um processo externo e reutilizável, com contexto próprio",
      },
      { id: "c", text: "A chamada sempre executa em paralelo" },
      { id: "d", text: "O subprocesso não pode ter eventos de início e fim" },
    ],
    correctOptionId: "b",
    explanation:
      "O subprocesso faz parte do mesmo processo (por isso tem o '+'). A Call Activity, de borda grossa, referencia outro processo definido separadamente, com seus próprios dados — isso permite reutilização.",
  },

  /* ---------------- Gateways ---------------- */
  {
    id: "q-14",
    category: "gateways",
    difficulty: "facil",
    type: "mcq",
    statement: "O que faz um gateway paralelo (AND) no momento da divisão?",
    options: [
      { id: "a", text: "Escolhe apenas um caminho conforme a condição" },
      { id: "b", text: "Ativa todos os caminhos de saída ao mesmo tempo" },
      { id: "c", text: "Ativa um ou mais caminhos, conforme as condições" },
      { id: "d", text: "Espera o evento que chegar primeiro" },
    ],
    correctOptionId: "b",
    explanation:
      "O '+' do gateway paralelo não avalia condição nenhuma: todos os ramos são executados, e a junção paralela correspondente espera todos antes de seguir.",
  },
  {
    id: "q-15",
    category: "gateways",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Em um gateway exclusivo, todas as saídas podem ser executadas na mesma instância do processo.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "Exclusivo (XOR) significa que apenas uma saída é escolhida — as condições se excluem mutuamente. Se mais de uma pode valer ao mesmo tempo, use o gateway inclusivo.",
  },
  {
    id: "q-16",
    category: "gateways",
    difficulty: "intermediario",
    type: "symbol",
    statement: "Qual gateway é representado por este símbolo?",
    symbolId: "gateway-inclusive",
    options: [
      { id: "a", text: "Exclusivo (XOR)" },
      { id: "b", text: "Paralelo (AND)" },
      { id: "c", text: "Inclusivo (OR)" },
      { id: "d", text: "Baseado em eventos" },
    ],
    correctOptionId: "c",
    explanation:
      "O 'O' dentro do losango é o marcador do gateway inclusivo: um ou mais caminhos podem ser ativados, e a junção inclusiva sincroniza apenas os que realmente executaram.",
  },
  {
    id: "q-17",
    category: "gateways",
    difficulty: "intermediario",
    type: "mcq",
    statement: "Uma junção paralela (AND join) continua o fluxo quando:",
    options: [
      { id: "a", text: "O primeiro fluxo de entrada chega" },
      { id: "b", text: "Todos os fluxos de entrada previstos tiverem chegado" },
      { id: "c", text: "A condição de qualquer fluxo for verdadeira" },
      { id: "d", text: "O tempo máximo de espera expira" },
    ],
    correctOptionId: "b",
    explanation:
      "A junção paralela sincroniza: ela espera que todos os ramos criados pela divisão cheguem. Se faltarem ramos, o token fica preso — um erro clássico de modelagem.",
  },
  {
    id: "q-18",
    category: "gateways",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Uma compra precisa de aprovação do gestor e, quando o valor é alto, também da diretoria. Qual gateway usar?",
    options: [
      { id: "a", text: "Gateway exclusivo (XOR)" },
      { id: "b", text: "Gateway paralelo (AND)" },
      { id: "c", text: "Gateway inclusivo (OR)" },
      { id: "d", text: "Gateway complexo" },
    ],
    correctOptionId: "c",
    explanation:
      "As condições não se excluem (ambas podem ser exigidas): é o caso clássico do inclusivo, que ativa um ou mais ramos e depois os sincroniza.",
  },

  /* ---------------- Conexões ---------------- */
  {
    id: "q-19",
    category: "conexoes",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "O fluxo de sequência pode ligar elementos de duas pools diferentes.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "Fluxo de sequência existe apenas dentro da mesma pool. Entre participantes diferentes, a comunicação é representada pelo fluxo de mensagem (linha tracejada).",
  },
  {
    id: "q-20",
    category: "conexoes",
    difficulty: "intermediario",
    type: "mcq",
    statement: "Como é representado o fluxo de mensagem em um diagrama BPMN?",
    options: [
      { id: "a", text: "Linha contínua com seta preenchida" },
      { id: "b", text: "Linha tracejada com seta aberta, entre pools diferentes" },
      { id: "c", text: "Linha pontilhada sem seta" },
      { id: "d", text: "Seta dupla em losango" },
    ],
    correctOptionId: "b",
    explanation:
      "Mensagem é tracejada com ponta de seta aberta e só ocorre entre participantes. A linha pontilhada sem seta é associação, usada para ligar artefatos.",
  },
  {
    id: "q-21",
    category: "conexoes",
    difficulty: "facil",
    type: "symbol",
    statement: "Qual objeto de conexão é representado por esta linha?",
    symbolId: "flow-association",
    options: [
      { id: "a", text: "Fluxo de sequência" },
      { id: "b", text: "Fluxo de mensagem" },
      { id: "c", text: "Associação" },
      { id: "d", text: "Fluxo de dados" },
    ],
    correctOptionId: "c",
    explanation:
      "A associação é pontilhada e sem seta: ela liga anotações, objetos de dados e grupos às etapas, sem indicar ordem de execução.",
  },

  /* ---------------- Pools e Lanes ---------------- */
  {
    id: "q-22",
    category: "pools",
    difficulty: "facil",
    type: "mcq",
    statement: "O que uma raia (lane) representa em um diagrama BPMN?",
    options: [
      { id: "a", text: "Um processo independente" },
      { id: "b", text: "Uma divisão de responsabilidade dentro da pool" },
      { id: "c", text: "Uma etapa com prazo definido" },
      { id: "d", text: "Um documento de entrada do processo" },
    ],
    correctOptionId: "b",
    explanation:
      "Lanes são faixas dentro da pool que agrupam atividades por responsável ou departamento — por exemplo, Comercial, Financeiro e Logística.",
  },
  {
    id: "q-23",
    category: "pools",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Cada pool representa um participante independente (organização, departamento ou papel) envolvido na colaboração.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "A pool delimita a fronteira de um participante. Quando o processo do outro participante não interessa, ele aparece como pool em caixa-preta, trocando apenas mensagens.",
  },
  {
    id: "q-24",
    category: "pools",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Em um diagrama de colaboração com duas pools, qual a forma correta de comunicar um pedido entre elas?",
    options: [
      { id: "a", text: "Fluxo de sequência saindo da primeira pool" },
      { id: "b", text: "Associação pontilhada entre as tarefas" },
      { id: "c", text: "Fluxo de mensagem (tracejado) partindo de um elemento de uma pool até a outra" },
      { id: "d", text: "Uma lane que cruza as duas pools" },
    ],
    correctOptionId: "c",
    explanation:
      "Entre pools só é permitido fluxo de mensagem. Sequência cruza a fronteira da pool, associação liga artefatos e lanes nunca saem da sua pool.",
  },

  /* ---------------- Interpretação de diagramas ---------------- */
  {
    id: "q-25",
    category: "interpretacao",
    difficulty: "intermediario",
    type: "diagram",
    statement:
      "No diagrama, o gateway destacado é exclusivo. Se a condição 'Sim' for verdadeira, qual caminho será executado?",
    highlightNodeIds: ["gw1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Nota recebida" }),
        n("gw1", "gateway", 300, ROW_MAIN, { gateway: "exclusive", label: "Aprovada?" }),
        n("t1", "task", 540, ROW_TOP, { label: "Pagar a nota" }),
        n("t2", "task", 540, ROW_BOTTOM, { label: "Corrigir a nota" }),
        n("e1", "end", 800, ROW_TOP, { label: "Nota paga" }),
        n("e2", "end", 800, ROW_BOTTOM, { label: "Nota devolvida" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1", "Sim"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "t1", "e1"),
        e("f5", "t2", "e2"),
      ]
    ),
    options: [
      { id: "a", text: "Ambos os caminhos, em paralelo" },
      { id: "b", text: "Apenas o caminho 'Pagar a nota'" },
      { id: "c", text: "Nenhum: o processo fica aguardando" },
      { id: "d", text: "Apenas o caminho 'Corrigir a nota'" },
    ],
    correctOptionId: "b",
    explanation:
      "No gateway exclusivo apenas uma saída é escolhida. Como a saída superior está rotulada 'Sim', o token segue para 'Pagar a nota' e termina em 'Nota paga'.",
  },
  {
    id: "q-26",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "Observe o gateway paralelo destacado (divisão). O que acontece depois dele?",
    highlightNodeIds: ["gw1", "gw2"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Contrato aprovado" }),
        n("gw1", "gateway", 300, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
        n("t1", "task", 540, ROW_TOP, { label: "Preparar o posto" }),
        n("t2", "task", 540, ROW_BOTTOM, { label: "Cadastrar no sistema" }),
        n("gw2", "gateway", 780, ROW_MAIN, { gateway: "parallel", label: "Juntar" }),
        n("e1", "end", 980, ROW_MAIN, { label: "Tudo pronto" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1"),
        e("f3", "gw1", "t2"),
        e("f4", "t1", "gw2"),
        e("f5", "t2", "gw2"),
        e("f6", "gw2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "Apenas 'Preparar o posto' é executada" },
      { id: "b", text: "Escolhe-se uma das duas tarefas conforme a condição" },
      {
        id: "c",
        text: "As duas tarefas executam e a junção paralela só segue quando ambas terminarem",
      },
      { id: "d", text: "O processo termina imediatamente" },
    ],
    correctOptionId: "c",
    explanation:
      "O '+' na divisão ativa todos os ramos; o '+' na junção espera todos os ramos de entrada. Não há condição — por isso nenhuma rotulagem de saída é necessária.",
  },
  {
    id: "q-27",
    category: "interpretacao",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Em um diagrama bem formado, toda atividade precisa receber pelo menos um fluxo de entrada e ter pelo menos um de saída.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Atividades isoladas ou sem saída quebram a continuidade do fluxo: o token nunca as alcança ou nunca sai delas. Isso é um dos erros mais comuns em diagramas iniciantes.",
  },
  {
    id: "q-28",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "Qual é a função do elemento destacado no fluxo abaixo?",
    highlightNodeIds: ["i1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Cobrança emitida" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Emitir a cobrança", taskType: "send" }),
        n("i1", "intermediate", 540, ROW_MAIN, { label: "Esperar 5 dias", marker: "timer" }),
        n("t2", "task", 780, ROW_MAIN, { label: "Verificar o pagamento" }),
        n("e1", "end", 1000, ROW_MAIN, { label: "Cobrança concluída" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "i1"),
        e("f3", "i1", "t2"),
        e("f4", "t2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "Encerra o processo após cinco dias" },
      { id: "b", text: "Pausa o fluxo por uma espera de tempo antes de seguir" },
      { id: "c", text: "Divide o processo em dois caminhos alternativos" },
      { id: "d", text: "Indica uma falha no pagamento" },
    ],
    correctOptionId: "b",
    explanation:
      "Borda dupla = evento intermediário; relógio = temporizador. Ele segura o token pelo tempo definido e só libera a continuação quando a espera termina.",
  },

  /* ---------------- Situações práticas ---------------- */
  {
    id: "q-29",
    category: "pratica",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Um diagrama mostra uma tarefa com duas saídas diretas rotuladas 'Aprovado' e 'Reprovado', sem nenhum gateway. Qual a correção adequada?",
    options: [
      { id: "a", text: "Remover os rótulos das saídas" },
      {
        id: "b",
        text: "Inserir um gateway exclusivo após a tarefa e ligar as duas saídas a ele",
      },
      { id: "c", text: "Trocar as saídas por fluxo de mensagem" },
      { id: "d", text: "Transformar a tarefa em evento de fim" },
    ],
    correctOptionId: "b",
    explanation:
      "Atividades não decidem: elas executam. A decisão é modelada por um gateway (aqui exclusivo), com cada caminho rotulado pela condição que o ativa.",
  },
  {
    id: "q-30",
    category: "pratica",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "O diagrama abaixo tem um problema grave de modelagem. Qual é?",
    highlightNodeIds: ["t3"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido recebido" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Conferir o pedido" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Em estoque?" }),
        n("t2", "task", 780, ROW_TOP, { label: "Separar os itens" }),
        n("t3", "task", 780, ROW_BOTTOM, { label: "Avisar o cliente" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t3", "Não"),
      ]
    ),
    options: [
      { id: "a", text: "O evento de início está com marcador errado" },
      { id: "b", text: "A atividade destacada não tem saída e o processo não termina" },
      { id: "c", text: "O gateway paralelo está sem condições" },
      { id: "d", text: "Há dois eventos de início no mesmo processo" },
    ],
    correctOptionId: "b",
    explanation:
      "'Avisar o cliente' fica sem saída e não existe nenhum evento de fim: o fluxo morre ali. Cada caminho precisa terminar em um evento de fim com borda grossa.",
  },

  /* ---------------- Nível avançado (expansão) ---------------- */
  /* Leitura e solução de fluxo (5 com diagrama) + aprofundamento. */
  {
    id: "q-31",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "O gateway destacado é exclusivo e a saída 'Sim' leva ao ramo superior. Se 'Prioridade alta?' for verdadeira, qual é o caminho completo do token até o fim?",
    highlightNodeIds: ["gw1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Chamado aberto" }),
        n("gw1", "gateway", 300, ROW_MAIN, { gateway: "exclusive", label: "Prioridade alta?" }),
        n("t1", "task", 540, ROW_TOP, { label: "Atender com urgência" }),
        n("t2", "task", 540, ROW_BOTTOM, { label: "Entrar na fila" }),
        n("gw2", "gateway", 780, ROW_MAIN, { gateway: "exclusive", label: "Juntar" }),
        n("e1", "end", 980, ROW_MAIN, { label: "Chamado encerrado" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1", "Sim"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "t1", "gw2"),
        e("f5", "t2", "gw2"),
        e("f6", "gw2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "'Atender com urgência' → junção exclusiva → 'Chamado encerrado'" },
      { id: "b", text: "As duas tarefas executam em paralelo até a junção" },
      { id: "c", text: "'Entrar na fila' → 'Chamado encerrado'" },
      {
        id: "d",
        text: "'Atender com urgência', e depois espera o ramo inferior chegar à junção antes de seguir",
      },
    ],
    correctOptionId: "a",
    explanation:
      "No gateway exclusivo apenas um ramo é escolhido: como 'Sim' leva a 'Atender com urgência', o token segue só por ali. A junção exclusiva o libera assim que ele chega — ela não espera o outro ramo (esse papel é da junção paralela), por isso não há bloqueio.",
  },
  {
    id: "q-32",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "No diagrama, o elemento destacado é a junção do paralelo. Se 'Separar os itens' terminar antes da nota fiscal, o que ela faz com o token que chegou?",
    highlightNodeIds: ["gw2"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido aprovado" }),
        n("gw1", "gateway", 300, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
        n("t1", "task", 540, ROW_TOP, { label: "Separar os itens" }),
        n("t2", "task", 540, ROW_BOTTOM, { label: "Emitir a nota fiscal" }),
        n("gw2", "gateway", 780, ROW_MAIN, { gateway: "parallel", label: "Sincronizar" }),
        n("e1", "end", 980, ROW_MAIN, { label: "Despachar" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1"),
        e("f3", "gw1", "t2"),
        e("f4", "t1", "gw2"),
        e("f5", "t2", "gw2"),
        e("f6", "gw2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "Segue imediatamente para 'Despachar' — junções não bloqueiam" },
      {
        id: "b",
        text: "Retém o token que chegou e só continua quando 'Emitir a nota fiscal' também terminar",
      },
      { id: "c", text: "Devolve o token para a divisão e executa os dois ramos de novo" },
      { id: "d", text: "Cancela o ramo que ainda está em execução" },
    ],
    correctOptionId: "b",
    explanation:
      "A junção paralela sincroniza: ela guarda os tokens que chegam e só libera o fluxo quando todos os ramos criados pela divisão estiverem concluídos. Enquanto faltar um token, o processo não avança — e nada é cancelado nem reexecutado.",
  },
  {
    id: "q-33",
    category: "pratica",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "Executando o fluxo a partir do evento de início, o que acontece com a atividade destacada?",
    highlightNodeIds: ["t4"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Fatura recebida" }),
        n("t1", "task", 300, ROW_MAIN, { label: "Conferir a fatura" }),
        n("gw1", "gateway", 540, ROW_MAIN, { gateway: "exclusive", label: "Fatura correta?" }),
        n("t2", "task", 780, ROW_TOP, { label: "Aprovar o pagamento" }),
        n("e1", "end", 1010, ROW_TOP, { label: "Pagamento aprovado" }),
        n("t3", "task", 780, ROW_BOTTOM, { label: "Devolver ao fornecedor" }),
        n("e2", "end", 1010, ROW_BOTTOM, { label: "Fatura devolvida" }),
        n("t4", "task", 300, ROW_EXTRA, { label: "Emitir crédito" }),
        n("e3", "end", 560, ROW_EXTRA, { label: "Crédito emitido" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "t2", "Sim"),
        e("f4", "gw1", "t3", "Não"),
        e("f5", "t2", "e1"),
        e("f6", "t3", "e2"),
        e("f7", "t4", "e3"),
      ]
    ),
    options: [
      { id: "a", text: "Executa automaticamente depois que o pagamento é aprovado" },
      {
        id: "b",
        text: "Nunca é alcançada: sem fluxo de entrada, o token jamais chega até ela",
      },
      { id: "c", text: "Executa em paralelo logo após 'Conferir a fatura'" },
      { id: "d", text: "Interrompe o processo assim que a fatura chega" },
    ],
    correctOptionId: "b",
    explanation:
      "'Emitir crédito' está isolada: nenhuma aresta chega até ela, então o token que nasce no início jamais a alcança e a atividade nunca executa. Para o caminho existir, ela precisa ser ligada a um dos ramos — por exemplo, logo após a rejeição da fatura.",
  },
  {
    id: "q-34",
    category: "gateways",
    difficulty: "avancado",
    type: "mcq",
    statement: "Sobre a junção inclusiva (OR join), qual afirmação está correta?",
    options: [
      {
        id: "a",
        text: "Ela espera todos os ramos possíveis do processo, inclusive os que não foram ativados",
      },
      {
        id: "b",
        text: "Ela continua quando todos os ramos efetivamente ativados tiverem chegado, sem esperar os ramos que não executaram",
      },
      { id: "c", text: "Ela dispara assim que o primeiro token chega, como a junção exclusiva" },
      { id: "d", text: "Ela só funciona se a divisão for feita por um gateway exclusivo" },
    ],
    correctOptionId: "b",
    explanation:
      "A divisão inclusiva ativa um subconjunto de ramos; a junção correspondente sincroniza apenas os tokens realmente gerados — esperar ramos que nunca viriam travaria o processo. E ao contrário da junção exclusiva, ela não segue com um único token enquanto outros estiverem em andamento.",
  },
  {
    id: "q-35",
    category: "eventos",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "O gateway baseado em eventos destacado abre dois ramos de espera. Se a resposta do cliente chegar no2º dia, antes do prazo de 5 dias, o que acontece?",
    highlightNodeIds: ["gw1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Proposta enviada" }),
        n("gw1", "gateway", 300, ROW_MAIN, { gateway: "eventBased", label: "Aguardar retorno" }),
        n("i1", "intermediate", 540, ROW_TOP, { label: "Mensagem chegou", marker: "message" }),
        n("i2", "intermediate", 540, ROW_BOTTOM, { label: "Prazo de 5 dias", marker: "timer" }),
        n("t1", "task", 780, ROW_TOP, { label: "Registrar a resposta" }),
        n("t2", "task", 780, ROW_BOTTOM, { label: "Encerrar por silêncio" }),
        n("e1", "end", 1010, ROW_TOP, { label: "Resposta tratada" }),
        n("e2", "end", 1010, ROW_BOTTOM, { label: "Proposta expirada" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "i1"),
        e("f3", "gw1", "i2"),
        e("f4", "i1", "t1"),
        e("f5", "i2", "t2"),
        e("f6", "t1", "e1"),
        e("f7", "t2", "e2"),
      ]
    ),
    options: [
      { id: "a", text: "Os dois ramos seguem: mensagem e temporizador acontecem juntos" },
      {
        id: "b",
        text: "Apenas o ramo da mensagem segue e o ramo do temporizador é descartado",
      },
      { id: "c", text: "O gateway espera os 5 dias completos e depois registra a resposta" },
      { id: "d", text: "O fluxo trava, porque dois eventos de espera concorrentes não são permitidos" },
    ],
    correctOptionId: "b",
    explanation:
      "O gateway baseado em eventos cria ramos de espera alternativos: o primeiro evento a ocorrer vence, seu caminho é seguido e os demais são cancelados. Aqui a mensagem chegou antes do prazo, então o ramo do temporizador de 5 dias é descartado.",
  },
  {
    id: "q-36",
    category: "atividades",
    difficulty: "avancado",
    type: "mcq",
    statement: "Em BPMN, a tarefa de regra de negócio (Business Rule Task) é adequada quando:",
    options: [
      { id: "a", text: "Uma pessoa precisa preencher um formulário no sistema" },
      {
        id: "b",
        text: "Um motor de regras aplica critérios definidos e decide o desfecho automaticamente, sem intervenção humana",
      },
      { id: "c", text: "O processo precisa aguardar a chegada de uma mensagem externa" },
      { id: "d", text: "Várias tarefas idênticas são executadas em lote por uma equipe" },
    ],
    correctOptionId: "b",
    explanation:
      "A tarefa de regra de negócio (ícone de tabela) é executada por um motor de regras — ex.: política de crédito, alçada de aprovação. Formulário preenchido por pessoa é tarefa de usuário; espera de mensagem é tarefa de recebimento; lote é multi-instância, outro conceito.",
  },
  {
    id: "q-37",
    category: "conexoes",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "No diagrama, o participante 'Cliente' envia o pedido à 'Loja' pela conexão tracejada. Se essa conexão fosse trocada por fluxo de sequência, qual seria a consequência?",
    highlightNodeIds: ["t1"],
    diagram: d(
      [
        box("p1", "pool", 40, 20, 780, 150, { poolName: "Cliente" }),
        box("p2", "pool", 40, 190, 780, 170, { poolName: "Loja" }),
        n("t1", "task", 340, 105, { label: "Enviar o pedido", taskType: "send" }, { poolId: "p1" }),
        n(
          "t2",
          "task",
          340,
          250,
          { label: "Registrar o pedido", taskType: "user" },
          { poolId: "p2" }
        ),
        n("e1", "end", 620, 250, { label: "Pedido registrado" }, { poolId: "p2" }),
      ],
      [e("msg", "t1", "t2", undefined, "message"), e("f1", "t2", "e1")]
    ),
    options: [
      { id: "a", text: "Nada mudaria — sequência e mensagem são intercambiáveis entre pools" },
      {
        id: "b",
        text: "O diagrama violaria a notação: sequência só existe dentro de uma pool; entre participantes a comunicação é por fluxo de mensagem",
      },
      { id: "c", text: "Ficaria correto, desde que as duas pools fossem do mesmo departamento" },
      { id: "d", text: "A atividade 'Registrar o pedido' deixaria de existir" },
    ],
    correctOptionId: "b",
    explanation:
      "O fluxo de sequência descreve a ordem dentro de um único processo e nunca cruza a fronteira da pool. Entre participantes diferentes a única conexão permitida é o fluxo de mensagem (tracejado com seta aberta) — trocá-la por sequência invalida o diagrama.",
  },
  {
    id: "q-38",
    category: "pools",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Em um diagrama de colaboração, quando o processo do outro participante não interessa ao estudo, ele é modelado como:",
    options: [
      {
        id: "a",
        text: "Uma pool em caixa-preta, sem processo interno, comunicando-se apenas por fluxos de mensagem",
      },
      { id: "b", text: "Uma lane vazia dentro da pool principal" },
      { id: "c", text: "Um evento de fim conectado à pool principal" },
      { id: "d", text: "Uma anotação de texto ligada à pool" },
    ],
    correctOptionId: "a",
    explanation:
      "A pool em caixa-preta representa um participante conhecido, mas cujo processo é desconhecido ou irrelevante para o estudo: ela não contém fluxo interno e só troca mensagens. Lane é divisão interna de responsabilidade e nunca substitui um participante.",
  },
  {
    id: "q-39",
    category: "fundamentos",
    difficulty: "avancado",
    type: "mcq",
    statement: "Sobre a semântica de token da BPMN, qual afirmação está correta?",
    options: [
      { id: "a", text: "O token é um dado de entrada: cada variável do processo gera um token" },
      {
        id: "b",
        text: "O token representa a instância em execução percorrendo o fluxo; quando todos alcançam eventos de fim, a instância se encerra",
      },
      { id: "c", text: "Tokens só existem em diagramas que possuem pools e lanes" },
      { id: "d", text: "Um token é criado a cada gateway e destruído a cada atividade" },
    ],
    correctOptionId: "b",
    explanation:
      "O token modela a ocorrência corrente da instância: nasce no evento de início, percorre os fluxos de sequência, é multiplicado nas divisões e sincronizado nas junções. Sua chegada — e a de todos os tokens — aos eventos de fim encerra a instância.",
  },
  {
    id: "q-40",
    category: "pratica",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Num gateway exclusivo, todas as saídas são condicionais e pode ocorrer de nenhuma ser verdadeira (ex.: dados incompletos). Qual providência impede que o token fique sem caminho?",
    options: [
      { id: "a", text: "Trocar o gateway exclusivo por um paralelo, executando todas as saídas" },
      {
        id: "b",
        text: "Definir um fluxo padrão (default flow) no gateway exclusivo, acionado quando nenhuma condição é verdadeira",
      },
      { id: "c", text: "Remover as condições das saídas para que o fluxo siga sempre a primeira" },
      { id: "d", text: "Substituir o gateway por um evento de fim, encerrando a instância" },
    ],
    correctOptionId: "b",
    explanation:
      "Se nenhuma condição de saída do exclusivo é verdadeira, o token fica sem destino e o processo trava (deadlock). O fluxo padrão é justamente a saída sem condição que recebe o token nesse caso — quando qualquer outra condição vale, o padrão é ignorado.",
  },

  /* ---------------- Nível fácil (expansão 1) ---------------- */
  {
    id: "q-41",
    category: "fundamentos",
    difficulty: "facil",
    type: "mcq",
    statement: "Qual organização é responsável pela especificação BPMN?",
    options: [
      { id: "a", text: "W3C (World Wide Web Consortium)" },
      { id: "b", text: "OMG (Object Management Group)" },
      { id: "c", text: "IEEE (Institute of Electrical and Electronics Engineers)" },
      { id: "d", text: "ISO, sozinha, sem outras organizações" },
    ],
    correctOptionId: "b",
    explanation:
      "A BPMN é desenvolvida e publicada pela OMG (Object Management Group); a versão 2.0 também foi adotada como norma ISO/IEC 19510. W3C cuida da web, IEEE de eletrônica — nenhuma delas publica a notação.",
  },
  {
    id: "q-42",
    category: "fundamentos",
    difficulty: "facil",
    type: "truefalse",
    statement: "BPMN só pode ser usado para processos automatizados por software.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "BPMN descreve qualquer processo de negócio — manuais, mistos ou automatizados. A notação serve para comunicar como o trabalho acontece, independentemente de existir sistema envolvido.",
  },
  {
    id: "q-43",
    category: "fundamentos",
    difficulty: "facil",
    type: "mcq",
    statement: "Em BPMN, o que é um gateway?",
    options: [
      { id: "a", text: "Um ponto de decisão ou divisão que controla por onde o fluxo segue" },
      { id: "b", text: "Uma etapa de trabalho executada por uma pessoa" },
      { id: "c", text: "O documento de entrada do processo" },
      { id: "d", text: "A fronteira entre dois participantes" },
    ],
    correctOptionId: "a",
    explanation:
      "O gateway (losango) decide, divide ou junta fluxos de sequência. Trabalho é atividade, documento é objeto de dados e fronteira entre participantes é a borda da pool.",
  },
  {
    id: "q-44",
    category: "eventos",
    difficulty: "facil",
    type: "mcq",
    statement: "O que indica a borda grossa de um círculo de evento?",
    options: [
      { id: "a", text: "Evento de início" },
      { id: "b", text: "Evento intermediário" },
      { id: "c", text: "Evento de fim" },
      { id: "d", text: "Evento de fronteira" },
    ],
    correctOptionId: "c",
    explanation:
      "A regra das bordas: fina = início, dupla = intermediário e grossa = fim. O marcador interno diz o tipo de ocorrência; a borda diz em que fase o evento acontece.",
  },
  {
    id: "q-45",
    category: "eventos",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "Um evento intermediário fica entre etapas e o fluxo continua a partir dele.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "O evento intermediário (borda dupla) representa uma ocorrência no meio do fluxo: quando ela acontece, o token segue para a etapa seguinte — diferente do evento de fim, que não tem saída.",
  },
  {
    id: "q-46",
    category: "eventos",
    difficulty: "facil",
    type: "mcq",
    statement:
      "Qual evento inicia o processo quando uma mensagem (como um e-mail ou requisição) chega?",
    options: [
      { id: "a", text: "Evento de início por temporizador" },
      { id: "b", text: "Evento de início por mensagem" },
      { id: "c", text: "Evento de início por sinal" },
      { id: "d", text: "Evento intermediário por mensagem" },
    ],
    correctOptionId: "b",
    explanation:
      "O envelope dentro do círculo de borda fina é o marcador de mensagem: o processo só nasce quando a mensagem externa chega. Relógio é temporizador, sino é sinal e borda dupla seria intermediário.",
  },
  {
    id: "q-47",
    category: "atividades",
    difficulty: "facil",
    type: "mcq",
    statement:
      "Qual tipo de tarefa representa uma ação feita por uma pessoa dentro de um sistema (ex.: preencher um formulário)?",
    options: [
      { id: "a", text: "Tarefa de usuário (User Task)" },
      { id: "b", text: "Tarefa de serviço (Service Task)" },
      { id: "c", text: "Tarefa manual (Manual Task)" },
      { id: "d", text: "Tarefa de envio (Send Task)" },
    ],
    correctOptionId: "a",
    explanation:
      "A tarefa de usuário é executada por uma pessoa com apoio de um sistema (ícone de pessoa). Serviço é automática; manual é feita fora do sistema; envio apenas transmite uma mensagem.",
  },
  {
    id: "q-48",
    category: "atividades",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "O retângulo de atividade com o marcador '+' representa um subprocesso que pode ser expandido para ver as etapas internas.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "O '+' identifica o subprocesso: na visão principal ele aparece como uma única atividade e pode ser expandido para revelar o fluxo detalhado dentro dele.",
  },
  {
    id: "q-49",
    category: "atividades",
    difficulty: "facil",
    type: "mcq",
    statement: "O que faz uma tarefa de envio (Send Task)?",
    options: [
      { id: "a", text: "Aguarda a chegada de uma mensagem externa" },
      { id: "b", text: "Envia uma mensagem ou documento para fora da etapa atual" },
      { id: "c", text: "Executa uma rotina automática no sistema" },
      { id: "d", text: "Divide o trabalho entre duas equipes" },
    ],
    correctOptionId: "b",
    explanation:
      "A tarefa de envio (seta saindo da caixa) transmite uma mensagem — ela produz e envia. Aguardar mensagem é tarefa de recebimento; execução automática é tarefa de serviço.",
  },
  {
    id: "q-50",
    category: "gateways",
    difficulty: "facil",
    type: "mcq",
    statement: "Qual gateway escolhe exatamente um caminho de saída?",
    options: [
      { id: "a", text: "Paralelo (AND)" },
      { id: "b", text: "Inclusivo (OR)" },
      { id: "c", text: "Exclusivo (XOR)" },
      { id: "d", text: "Baseado em eventos" },
    ],
    correctOptionId: "c",
    explanation:
      "O exclusivo (X) avalia as condições e envia o token por uma única saída. O paralelo ativa todas; o inclusivo ativa uma ou mais; o baseado em eventos espera qual ocorrência chega primeiro.",
  },
  {
    id: "q-51",
    category: "gateways",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "Um gateway inclusivo pode ativar todos os caminhos de saída, desde que todas as condições sejam verdadeiras.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "O inclusivo ativa um ou mais caminhos — incluindo todos, quando todas as condições valem. O que ele NÃO faz é escolher apenas um (isso é o exclusivo).",
  },
  {
    id: "q-52",
    category: "conexoes",
    difficulty: "facil",
    type: "mcq",
    statement: "As etapas de um mesmo processo são ligadas, na ordem de execução, por:",
    options: [
      { id: "a", text: "Linha contínua com seta preenchida (fluxo de sequência)" },
      { id: "b", text: "Linha tracejada com seta aberta" },
      { id: "c", text: "Linha pontilhada sem seta" },
      { id: "d", text: "Seta dupla em losango" },
    ],
    correctOptionId: "a",
    explanation:
      "O fluxo de sequência é linha contínua com seta e mostra a ordem de execução dentro do processo. Tracejado com seta é mensagem; pontilhado sem seta é associação.",
  },
  {
    id: "q-53",
    category: "conexoes",
    difficulty: "facil",
    type: "mcq",
    statement: "Qual destes NÃO é um objeto de conexão?",
    options: [
      { id: "a", text: "Fluxo de sequência" },
      { id: "b", text: "Fluxo de mensagem" },
      { id: "c", text: "Associação" },
      { id: "d", text: "Tarefa" },
    ],
    correctOptionId: "d",
    explanation:
      "Sequência, mensagem e associação são objetos de conexão — ligam elementos. Tarefa é atividade: é um elemento de fluxo, não uma conexão.",
  },
  {
    id: "q-54",
    category: "conexoes",
    difficulty: "facil",
    type: "truefalse",
    statement:
      "A linha pontilhada sem seta (associação) indica a ordem em que as etapas devem executar.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "A associação apenas liga artefatos (anotações, objetos de dados, grupos) a etapas — ela não tem seta justamente porque não há ordem nem execução. A ordem é papel do fluxo de sequência.",
  },
  {
    id: "q-55",
    category: "pools",
    difficulty: "facil",
    type: "truefalse",
    statement: "Uma pool pode conter várias lanes.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "A pool é o participante e as lanes são as faixas de responsabilidade dentro dele — por isso é comum ver uma pool dividida em várias lanes (Comercial, Financeiro, Logística...).",
  },
  {
    id: "q-56",
    category: "pools",
    difficulty: "facil",
    type: "mcq",
    statement: "Qual destes é um exemplo de nome de lane?",
    options: [
      { id: "a", text: "Financeiro" },
      { id: "b", text: "Aprovado?" },
      { id: "c", text: "Pedido registrado" },
      { id: "d", text: "Nota fiscal em anexo" },
    ],
    correctOptionId: "a",
    explanation:
      "Lane recebe nome de responsável, papel ou departamento (Financeiro, RH, Atendente). 'Aprovado?' é rótulo de gateway, 'Pedido registrado' é rótulo de evento e nota em anexo é artefato.",
  },
  {
    id: "q-57",
    category: "interpretacao",
    difficulty: "facil",
    type: "diagram",
    statement:
      "Neste fluxo simples, qual atividade é executada logo após o evento de início?",
    highlightNodeIds: ["t1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pedido confirmado" }),
        n("t1", "task", 320, ROW_MAIN, { label: "Separar os itens" }),
        n("t2", "task", 600, ROW_MAIN, { label: "Conferir a embalagem" }),
        n("e1", "end", 860, ROW_MAIN, { label: "Pedido pronto" }),
      ],
      [e("f1", "s", "t1"), e("f2", "t1", "t2"), e("f3", "t2", "e1")]
    ),
    options: [
      { id: "a", text: "Conferir a embalagem" },
      { id: "b", text: "Separar os itens" },
      { id: "c", text: "Pedido pronto" },
      { id: "d", text: "Nenhuma — o fluxo para no início" },
    ],
    correctOptionId: "b",
    explanation:
      "O token nasce no evento de início e segue pela seta até a primeira atividade: 'Separar os itens'. Depois vem 'Conferir a embalagem' e só então o evento de fim 'Pedido pronto'.",
  },
  {
    id: "q-58",
    category: "interpretacao",
    difficulty: "facil",
    type: "diagram",
    statement:
      "O gateway destacado avalia 'Produto disponível?'. Se a resposta for 'Não', qual atividade executa?",
    highlightNodeIds: ["gw1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Chamado aberto" }),
        n("gw1", "gateway", 320, ROW_MAIN, { gateway: "exclusive", label: "Produto disponível?" }),
        n("t1", "task", 600, ROW_TOP, { label: "Separar o pedido" }),
        n("e1", "end", 860, ROW_TOP, { label: "Pedido separado" }),
        n("t2", "task", 600, ROW_BOTTOM, { label: "Avisar o cliente" }),
        n("e2", "end", 860, ROW_BOTTOM, { label: "Pedido cancelado" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1", "Sim"),
        e("f3", "gw1", "t2", "Não"),
        e("f4", "t1", "e1"),
        e("f5", "t2", "e2"),
      ]
    ),
    options: [
      { id: "a", text: "Avisar o cliente" },
      { id: "b", text: "Separar o pedido" },
      { id: "c", text: "As duas, em sequência" },
      { id: "d", text: "Nenhuma das duas" },
    ],
    correctOptionId: "a",
    explanation:
      "No gateway exclusivo o token segue apenas pelo ramo cuja condição vale: 'Não' leva ao ramo inferior, 'Avisar o cliente', terminando em 'Pedido cancelado'.",
  },
  {
    id: "q-59",
    category: "eventos",
    difficulty: "facil",
    type: "symbol",
    statement: "Qual é a identificação correta deste evento?",
    symbolId: "event-intermediate-timer",
    options: [
      { id: "a", text: "Evento de início por temporizador" },
      { id: "b", text: "Evento intermediário por temporizador" },
      { id: "c", text: "Evento de fim por temporizador" },
      { id: "d", text: "Evento intermediário por mensagem" },
    ],
    correctOptionId: "b",
    explanation:
      "Borda dupla = intermediário; relógio = temporizador. Ele segura o fluxo por um tempo definido e depois o libera — diferente do temporizador de início (borda fina), que só começa o processo.",
  },
  {
    id: "q-60",
    category: "pratica",
    difficulty: "facil",
    type: "mcq",
    statement:
      "Um processo tem muitas etapas em uma única tela, ficando difícil de ler. Qual prática melhora a legibilidade?",
    options: [
      { id: "a", text: "Agrupar etapas relacionadas em subprocessos" },
      { id: "b", text: "Remover todos os eventos de fim" },
      { id: "c", text: "Ligar todas as atividades diretamente ao início" },
      { id: "d", text: "Usar cores diferentes sem legenda em cada etapa" },
    ],
    correctOptionId: "a",
    explanation:
      "Subprocessos escondem o detalhe sob uma única atividade expansível, mantendo a visão principal limpa. Sem eventos de fim o fluxo morre; ligar tudo ao início não existe; cor sem legenda confunde.",
  },

  /* ---------------- Nível intermediário (expansão 2) ---------------- */
  {
    id: "q-61",
    category: "fundamentos",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Um diagrama que mostra a interação entre dois participantes, ligados por fluxos de mensagem, é chamado de:",
    options: [
      { id: "a", text: "Diagrama de colaboração" },
      { id: "b", text: "Diagrama de orquestração única" },
      { id: "c", text: "Subprocesso expandido" },
      { id: "d", text: "Diagrama de lanes" },
    ],
    correctOptionId: "a",
    explanation:
      "A colaboração reúne duas ou mais pools (participantes) e descreve como elas se comunicam por fluxos de mensagem. Quando existe um só participante, tem-se um processo simples, não uma colaboração.",
  },
  {
    id: "q-62",
    category: "fundamentos",
    difficulty: "intermediario",
    type: "mcq",
    statement: "O que é uma 'instância do processo'?",
    options: [
      { id: "a", text: "Uma cópia do diagrama salva em versão diferente" },
      { id: "b", text: "Uma execução específica do processo — por exemplo, aquele pedido 4521" },
      { id: "c", text: "Uma versão de teste do modelo" },
      { id: "d", text: "Uma lane que executa o processo" },
    ],
    correctOptionId: "b",
    explanation:
      "O modelo/diagrama é o desenho; cada execução real (aquele pedido, aquele chamado) é uma instância com seu próprio token percorrendo o fluxo. Várias instâncias podem rodar ao mesmo tempo.",
  },
  {
    id: "q-63",
    category: "fundamentos",
    difficulty: "intermediario",
    type: "truefalse",
    statement: "Um mesmo processo pode ter vários eventos de fim.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "É comum e válido: cada caminho do fluxo termina no evento de fim que descreve seu desfeche — por exemplo, 'Pedido aprovado' e 'Pedido cancelado' são dois fins distintos do mesmo processo.",
  },
  {
    id: "q-64",
    category: "eventos",
    difficulty: "intermediario",
    type: "mcq",
    statement: "Quando um evento condicional (conditional) é acionado?",
    options: [
      { id: "a", text: "Quando uma condição sobre dados ou estado do processo se torna verdadeira" },
      { id: "b", text: "Sempre que um tempo fixo se esgota" },
      { id: "c", text: "Quando uma mensagem externa chega" },
      { id: "d", text: "Quando uma atividade falha" },
    ],
    correctOptionId: "a",
    explanation:
      "O marcador condicional (igual de 'se') avalia uma condição de dados — quando ela passa a ser verdadeira, o evento dispara. Tempo é temporizador, mensagem é envelope e falha é raio.",
  },
  {
    id: "q-65",
    category: "eventos",
    difficulty: "intermediario",
    type: "mcq",
    statement: "Qual a diferença entre sinal (signal) e mensagem (message)?",
    options: [
      {
        id: "a",
        text: "Sinal é direto para um destinatário específico; mensagem é broadcast para todos",
      },
      {
        id: "b",
        text: "Mensagem é direta (emissor para receptor); sinal é broadcast, capturado por quem estiver atento a ele",
      },
      { id: "c", text: "São sinônimos na notação" },
      { id: "d", text: "Sinal só pode ser usado dentro de subprocessos" },
    ],
    correctOptionId: "b",
    explanation:
      "Mensagem tem destinatário definido (cliente → loja). Sinal é um comunicado difuso: um elemento emite e qualquer um que tenha um evento de captura de sinal pode reagir, até em pools diferentes.",
  },
  {
    id: "q-66",
    category: "eventos",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "O evento de fim por erro só pode ser usado dentro de um subprocesso.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Erro é uma exceção que precisa ser capturada em algum lugar (evento de fronteira ou início de subprocesso de erro). Por isso lançamento e captura de erro acontecem no escopo de um subprocesso — num processo de topo, o erro não teria onde ser tratado.",
  },
  {
    id: "q-67",
    category: "atividades",
    difficulty: "intermediario",
    type: "mcq",
    statement: "O ícone de uma página com linhas identifica qual tarefa?",
    options: [
      { id: "a", text: "Tarefa de script" },
      { id: "b", text: "Tarefa de regra de negócio" },
      { id: "c", text: "Tarefa de usuário" },
      { id: "d", text: "Tarefa de serviço" },
    ],
    correctOptionId: "a",
    explanation:
      "A página com linhas é o script: um trecho de código executado pela engine. A tabela é regra de negócio, a pessoa é usuário e a engrenagem é serviço.",
  },
  {
    id: "q-68",
    category: "atividades",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Uma atividade de múltiplas instâncias executa o mesmo trabalho várias vezes, de forma sequencial ou paralela.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "O marcador de múltiplas instâncias (círculos empilhados) indica que a atividade se repete — uma por vez (sequencial) ou várias ao mesmo tempo (paralela), como aprovar cada item de um pedido.",
  },
  {
    id: "q-69",
    category: "atividades",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Qual a diferença entre uma tarefa de recebimento (Receive Task) e um evento intermediário de mensagem?",
    options: [
      {
        id: "a",
        text: "São o mesmo elemento com nomes diferentes",
      },
      {
        id: "b",
        text: "A tarefa é uma etapa visível do processo que aguarda a mensagem; o evento é uma ocorrência instantânea, sem representar trabalho",
      },
      {
        id: "c",
        text: "A tarefa executa automaticamente; o evento espera uma pessoa",
      },
      {
        id: "d",
        text: "O evento só existe em diagramas de colaboração",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Os dois aguardam a mesma mensagem, mas com semânticas diferentes: a tarefa de recebimento é trabalho passível de medição (aparece como atividade), enquanto o evento apenas captura a ocorrência no fluxo.",
  },
  {
    id: "q-70",
    category: "gateways",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Diferentemente da junção paralela, a junção exclusiva (XOR join) libera o fluxo:",
    options: [
      { id: "a", text: "Quando todos os fluxos de entrada chegam" },
      { id: "b", text: "Assim que o primeiro fluxo de entrada chega" },
      { id: "c", text: "Quando as condições de todas as entradas são verdadeiras" },
      { id: "d", text: "Nunca — junções exclusivas bloqueiam o fluxo" },
    ],
    correctOptionId: "b",
    explanation:
      "A junção exclusiva não sincroniza: ela deixa passar o token assim que ele chega, porque em modelos corretos só existe um token nesse ponto (os ramos são alternativos). Esperar todos é papel da junção paralela.",
  },
  {
    id: "q-71",
    category: "gateways",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Uma divisão paralela deve ser fechada por uma junção paralela equivalente.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Divisão e junção precisam combinar: o '+' da divisão gera um token por ramo e o '+' da junção espera todos. Misto (dividir em paralelo e juntar em exclusivo) deixa tokens órfãos ou travados.",
  },
  {
    id: "q-72",
    category: "gateways",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Uma divisão inclusiva tem três saídas e duas condições estão verdadeiras ao mesmo tempo. O que acontece?",
    options: [
      { id: "a", text: "Apenas a primeira saída verdadeira executa, como no exclusivo" },
      { id: "b", text: "Os dois ramos cujas condições são verdadeiras executam" },
      { id: "c", text: "Os três ramos executam, independentemente das condições" },
      { id: "d", text: "O gateway trava esperando uma única condição" },
    ],
    correctOptionId: "b",
    explanation:
      "O inclusivo ativa um ou mais ramos: aqui, os dois que satisfazem a condição. Ao final, a junção inclusiva sincroniza apenas os tokens que realmente foram gerados.",
  },
  {
    id: "q-73",
    category: "gateways",
    difficulty: "intermediario",
    type: "symbol",
    statement: "Identifique o gateway mostrado no símbolo ao lado.",
    symbolId: "gateway-event-based",
    options: [
      { id: "a", text: "Exclusivo (XOR)" },
      { id: "b", text: "Baseado em eventos" },
      { id: "c", text: "Paralelo (AND)" },
      { id: "d", text: "Complexo" },
    ],
    correctOptionId: "b",
    explanation:
      "O losango com dois círculos internos é o gateway baseado em eventos: ele cria ramos de espera e deixa o primeiro evento a ocorrer decidir por onde o fluxo segue.",
  },
  {
    id: "q-74",
    category: "conexoes",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Qual conexão liga um objeto de dados (ex.: 'Nota fiscal') a uma atividade que o usa ou produz?",
    options: [
      { id: "a", text: "Fluxo de sequência" },
      { id: "b", text: "Associação simples (pontilhada sem seta)" },
      { id: "c", text: "Associação de dados (pontilhada com seta)" },
      { id: "d", text: "Fluxo de mensagem" },
    ],
    correctOptionId: "c",
    explanation:
      "A associação de dados tem seta e indica a direção da informação: sai do objeto (entrada de dados) ou chega nele (produção). A associação simples, sem seta, liga artefatos como anotações; sequência e mensagem não ligam dados.",
  },
  {
    id: "q-75",
    category: "conexoes",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "O fluxo de sequência pode cruzar entre lanes diferentes, desde que esteja dentro da mesma pool.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Lanes são divisões internas de responsabilidade: o fluxo continua o mesmo processo quando muda de faixa — apenas o responsável muda. O limite proibido é a fronteira da pool (entre participantes).",
  },
  {
    id: "q-76",
    category: "pools",
    difficulty: "intermediario",
    type: "truefalse",
    statement:
      "Uma lane pode ser subdividida em sub-lanes (lanes aninhadas).",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "É permitido aninhar: uma lane 'Comercial' pode ter sub-lanes 'Presencial' e 'Online', detalhando responsabilidades dentro do mesmo departamento sem criar uma pool nova.",
  },
  {
    id: "q-77",
    category: "pools",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Um diagrama com uma única pool contendo várias lanes descreve:",
    options: [
      { id: "a", text: "A interação por mensagens entre dois participantes" },
      { id: "b", text: "O processo interno de um único participante, dividido por responsáveis" },
      { id: "c", text: "Dois processos independentes rodando em paralelo" },
      { id: "d", text: "As versões diferentes do mesmo processo" },
    ],
    correctOptionId: "b",
    explanation:
      "Uma pool = um participante. As lanes dentro dela repartem o trabalho desse participante por papel ou departamento. Interação entre participantes exigiria uma segunda pool com fluxos de mensagem.",
  },
  {
    id: "q-78",
    category: "interpretacao",
    difficulty: "intermediario",
    type: "diagram",
    statement:
      "O gateway de divisão destacado é inclusivo. Se as condições 'Risco alto' e 'Contrato especial' forem ambas verdadeiras, o que acontece?",
    highlightNodeIds: ["gw1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Proposta recebida" }),
        n("gw1", "gateway", 320, ROW_MAIN, { gateway: "inclusive", label: "Avaliar proposta" }),
        n("t1", "task", 600, ROW_TOP, { label: "Análise financeira" }),
        n("t2", "task", 600, ROW_MAIN, { label: "Revisão jurídica" }),
        n("t3", "task", 600, ROW_BOTTOM, { label: "Cadastro direto" }),
        n("gw2", "gateway", 880, ROW_MAIN, { gateway: "inclusive", label: "Juntar" }),
        n("e1", "end", 1120, ROW_MAIN, { label: "Proposta avaliada" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1", "Risco alto"),
        e("f3", "gw1", "t2", "Contrato especial"),
        e("f4", "gw1", "t3", "Sem restrições"),
        e("f5", "t1", "gw2"),
        e("f6", "t2", "gw2"),
        e("f7", "t3", "gw2"),
        e("f8", "gw2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "Apenas o primeiro caminho verdadeiro executa, como no exclusivo" },
      {
        id: "b",
        text: "Os dois ramos com condições verdadeiras executam, e a junção inclusiva sincroniza os que chegaram",
      },
      { id: "c", text: "Os três ramos executam, sempre" },
      { id: "d", text: "O processo trava esperando definição do modelador" },
    ],
    correctOptionId: "b",
    explanation:
      "O 'O' do inclusivo ativa um ou mais ramos conforme as condições — aqui, financeira e jurídica. A junção inclusiva espera apenas os tokens gerados; 'Cadastro direto', não ativado, não atrasa nada.",
  },
  {
    id: "q-79",
    category: "conexoes",
    difficulty: "intermediario",
    type: "diagram",
    statement:
      "No diagrama, as duas atividades estão na MESMA pool ('Loja') e a conexão entre elas é um fluxo de mensagem. Essa conexão:",
    highlightNodeIds: ["t1"],
    diagram: d(
      [
        box("p1", "pool", 40, 20, 760, 150, { poolName: "Loja" }),
        n("s", "start", 130, 105, { label: "Resposta recebida" }, { poolId: "p1" }),
        n("t1", "task", 340, 105, { label: "Enviar confirmação", taskType: "send" }, { poolId: "p1" }),
        n("t2", "task", 600, 105, { label: "Registrar confirmação" }, { poolId: "p1" }),
        n("e1", "end", 745, 105, { label: "Confirmação registrada" }, { poolId: "p1" }),
      ],
      [
        e("f1", "s", "t1"),
        e("m1", "t1", "t2", undefined, "message"),
        e("f2", "t2", "e1"),
      ]
    ),
    options: [
      { id: "a", text: "Está correta — mensagens circulam entre etapas do mesmo participante" },
      {
        id: "b",
        text: "É inválida: fluxo de mensagem liga participantes diferentes; dentro da mesma pool a ligação entre etapas é fluxo de sequência",
      },
      { id: "c", text: "É válida apenas se a pool possuir lanes" },
      { id: "d", text: "Deveria ser um fluxo de dados, pois envolve uma confirmação" },
    ],
    correctOptionId: "b",
    explanation:
      "Mensagem comunica dois participantes — ela nunca acontece dentro de uma única pool. Entre 'Enviar confirmação' e 'Registrar confirmação', do mesmo processo, a ligação correta é o fluxo de sequência contínuo.",
  },
  {
    id: "q-80",
    category: "pratica",
    difficulty: "intermediario",
    type: "mcq",
    statement:
      "Uma anotação de texto está ligada por linha pontilhada sem seta a duas atividades diferentes. O que isso significa?",
    options: [
      { id: "a", text: "As duas atividades executam ao mesmo tempo" },
      { id: "b", text: "O mesmo comentário se aplica a ambas as atividades — a associação não indica ordem nem fluxo" },
      { id: "c", text: "A segunda atividade só começa quando a primeira terminar" },
      { id: "d", text: "A anotação é o documento de saída das duas" },
    ],
    correctOptionId: "b",
    explanation:
      "Associação (pontilhada, sem seta) apenas vincula o artefato aos elementos a que ele se refere. Uma anotação pode até se ligar a várias etapas — isso não cria fluxo, ordem nem paralelismo.",
  },

  /* ---------------- Nível avançado (expansão 3) ---------------- */
  {
    id: "q-81",
    category: "fundamentos",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Qual afirmação diferencia corretamente coreografia (choreography) de colaboração?",
    options: [
      {
        id: "a",
        text: "Coreografia descreve a sequência de mensagens entre participantes, sem uma pool única que execute o processo; colaboração mostra pools com seus processos internos comunicando-se",
      },
      { id: "b", text: "Colaboração mostra apenas uma pool com lanes; coreografia mostra duas" },
      { id: "c", text: "São sinônimos para o mesmo tipo de diagrama" },
      { id: "d", text: "Coreografia é o mesmo que subprocesso expandido" },
    ],
    correctOptionId: "a",
    explanation:
      "Na colaboração, cada participante tem sua pool com o processo interno, ligado por mensagens. Na coreografia, o foco é a troca em si: a sequência de mensagens entre os papéis, sem expor quem executa o quê internamente.",
  },
  {
    id: "q-82",
    category: "fundamentos",
    difficulty: "avancado",
    type: "truefalse",
    statement:
      "O evento de fim por terminação encerra todos os ramos ativos do processo, não apenas o ramo onde ele está.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "Um evento de fim comum encerra apenas o token atual — os outros ramos podem continuar. Já a terminação (borda grossa com 'x' interno) derruba a instância inteira, usada quando o desfeche invalida todo o resto (ex.: pedido cancelado).",
  },
  {
    id: "q-83",
    category: "eventos",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Um passo posterior falhou e é preciso DESFAZIR o que já foi concluído (ex.: estornar um pagamento aprovado). Qual recurso da notação?",
    options: [
      {
        id: "a",
        text: "Compensação: uma atividade ou evento que executa a ação inversa daquela já concluída",
      },
      { id: "b", text: "Um temporizador que espera a falha se resolver sozinha" },
      { id: "c", text: "Um novo evento de início que reinicia o processo do zero" },
      { id: "d", text: "Um gateway paralelo que repete a atividade original" },
    ],
    correctOptionId: "a",
    explanation:
      "Compensação é o estorno: cancelar a reserva, devolver o valor, remover o cadastro. Ela se aplica a atividades JÁ concluídas (por isso exige registrar o que foi feito) e a própria compensação não pode ser compensada.",
  },
  {
    id: "q-84",
    category: "eventos",
    difficulty: "avancado",
    type: "mcq",
    statement: "Qual a diferença entre escalonamento (escalation) e erro (error)?",
    options: [
      {
        id: "a",
        text: "Escalonamento pede atenção de um nível superior sem necessariamente interromper a atividade; erro é uma exceção que interrompe o escopo em que ocorre",
      },
      { id: "b", text: "São dois nomes para o mesmo conceito" },
      { id: "c", text: "Erro apenas informa; quem interrompe é o escalonamento" },
      { id: "d", text: "Escalonamento só existe em processos com lanes" },
    ],
    correctOptionId: "a",
    explanation:
      "Escalonamento é de negócio: avisa gerência e a atividade original pode até continuar (evento de fronteira não interrompido). Erro é exceção técnica: captura a falha e desvia/interrompe — daí a regra de só existir no escopo de um subprocesso.",
  },
  {
    id: "q-85",
    category: "atividades",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Em uma atividade de múltiplas instâncias, qual a diferença entre os modos sequencial e paralelo?",
    options: [
      {
        id: "a",
        text: "Sequencial executa uma instância por vez; paralelo dispara várias ao mesmo tempo",
      },
      { id: "b", text: "Sequencial roda em outro sistema; paralelo roda no mesmo" },
      { id: "c", text: "Paralelo exige que a atividade seja substituída por um gateway" },
      { id: "d", text: "Não existe modo sequencial no BPMN" },
    ],
    correctOptionId: "a",
    explanation:
      "A diferença é a política de execução das repetições: fila uma por vez (sequencial) ou simultâneas (paralela). O marcador de múltiplas instâncias é o mesmo; o detalhe do modo fica no detalhamento da atividade.",
  },
  {
    id: "q-86",
    category: "atividades",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "O que diferencia um subprocesso de transação (transaction) de um subprocesso comum?",
    options: [
      {
        id: "a",
        text: "Ele é atômico: conclui com sucesso ou é interrompido (cancel) e compensado — não fica pela metade",
      },
      { id: "b", text: "Ele sempre executa em paralelo com outras atividades" },
      { id: "c", text: "Ele não pode ser expandido para ver o fluxo interno" },
      { id: "d", text: "Ele aceita vários eventos de início simultâneos" },
    ],
    correctOptionId: "a",
    explanation:
      "A transação (borda dupla com portais) garante o resultado unitário: ou tudo certo, ou o cancelamento interrompe e a compensação desfaz o que já aconteceu. É o formalismo para operações que não podem parar no meio.",
  },
  {
    id: "q-87",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "No fluxo, o elemento destacado está ligado à atividade 'Gerar relatório' por uma linha pontilhada sem seta. O que ele representa?",
    highlightNodeIds: ["d1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Fim do mês" }),
        n("t1", "task", 340, ROW_MAIN, { label: "Gerar relatório", taskType: "service" }),
        n("d1", "dataObject", 340, 240, { label: "Relatório mensal" }),
        n("e1", "end", 620, ROW_MAIN, { label: "Relatório pronto" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "e1"),
        e("a1", "d1", "t1", undefined, "association"),
      ]
    ),
    options: [
      {
        id: "a",
        text: "Uma informação/documento usada ou produzida pela atividade — a ligação é associação, que não indica ordem de execução",
      },
      { id: "b", text: "Uma etapa do processo que executa em paralelo" },
      { id: "c", text: "O próximo passo do fluxo depois de 'Gerar relatório'" },
      { id: "d", text: "Um erro que interrompe a atividade" },
    ],
    correctOptionId: "a",
    explanation:
      "O retângulo com dobra no canto é objeto de dados: representa o documento/informação ('Relatório mensal'). Ele se liga à atividade por associação pontilhada sem seta — nada de sequência, que indicaria execução.",
  },
  {
    id: "q-88",
    category: "gateways",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "As saídas de um gateway baseado em eventos devem ser, na maioria dos casos:",
    options: [
      { id: "a", text: "Tarefas de usuário, para decidir o caminho" },
      {
        id: "b",
        text: "Eventos intermediários de captura (mensagem, temporizador...) ou tarefas de recebimento, que aguardam a ocorrência",
      },
      { id: "c", text: "Eventos de fim, para encerrar os ramos perdidos" },
      { id: "d", text: "Qualquer atividade, pois o gateway só inicia os ramos" },
    ],
    correctOptionId: "b",
    explanation:
      "O gateway baseado em eventos não avalia condições: ele coloca vários ramos em espera e disputa qual ocorrência chega primeiro. Cada saída, portanto, precisa ser algo capaz de capturar um evento — o primeiro a disparar vence e os demais são descartados.",
  },
  {
    id: "q-89",
    category: "gateways",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "A divisão do diagrama é paralela, mas a junção destacada é exclusivo. Por que isso é um problema?",
    highlightNodeIds: ["gw2"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Contrato aprovado" }),
        n("gw1", "gateway", 320, ROW_MAIN, { gateway: "parallel", label: "Dividir" }),
        n("t1", "task", 600, ROW_TOP, { label: "Preparar o posto" }),
        n("t2", "task", 600, ROW_BOTTOM, { label: "Cadastrar no sistema" }),
        n("gw2", "gateway", 880, ROW_MAIN, { gateway: "exclusive", label: "Juntar" }),
        n("e1", "end", 1120, ROW_MAIN, { label: "Tudo pronto" }),
      ],
      [
        e("f1", "s", "gw1"),
        e("f2", "gw1", "t1"),
        e("f3", "gw1", "t2"),
        e("f4", "t1", "gw2"),
        e("f5", "t2", "gw2"),
        e("f6", "gw2", "e1"),
      ]
    ),
    options: [
      {
        id: "a",
        text: "A junção exclusiva deixa passar o primeiro token que chegar, mesmo com o outro ramo ainda em execução — os ramos deveriam ser sincronizados por uma junção paralela",
      },
      { id: "b", text: "Gateways exclusivos não podem receber mais de uma entrada" },
      { id: "c", text: "Nada: exclusivo e paralelo são intercambiáveis em junções" },
      { id: "d", text: "O problema é a ausência de rótulos nas saídas da divisão" },
    ],
    correctOptionId: "a",
    explanation:
      "A divisão gera um token em cada ramo; a junção exclusiva, ao ver o primeiro chegar, segue em frente e encerra o processo enquanto o outro ramo ainda trabalha — tokens perdidos e resultado incompleto. O par correto é junção paralela.",
  },
  {
    id: "q-90",
    category: "gateways",
    difficulty: "avancado",
    type: "mcq",
    statement: "Quando se usa o gateway complexo?",
    options: [
      {
        id: "a",
        text: "Quando a regra de divisão/junção não é nem exclusiva, nem paralela, nem inclusiva — o comportamento é definido pelo modelador (ex.: '3 de 5' ramos)",
      },
      { id: "b", text: "Sempre que existem mais de duas condições no diagrama" },
      { id: "c", text: "Para simplificar um gateway exclusivo com muitas saídas" },
      { id: "d", text: "Nunca: o gateway complexo é proibido pela notação" },
    ],
    correctOptionId: "a",
    explanation:
      "O losango com estrela é o caso definido externamente: quando a semântica não cabe nos marcadores padrão, a regra é documentada junto ao diagrama. Por isso ele é raro — na prática, quase tudo se resolve com XOR, AND ou OR.",
  },
  {
    id: "q-91",
    category: "conexoes",
    difficulty: "avancado",
    type: "mcq",
    statement: "Qual a diferença entre objeto de dados e armazenamento de dados?",
    options: [
      {
        id: "a",
        text: "O objeto é uma informação/documento específico usado ou produzido; o armazenamento é um repositório persistente de onde dados saem e para onde chegam",
      },
      { id: "b", text: "São sinônimos — mudam apenas o nome" },
      { id: "c", text: "O objeto é uma etapa que processa dados; o armazenamento é uma lane" },
      { id: "d", text: "O armazenamento só existe em diagramas com pools" },
    ],
    correctOptionId: "a",
    explanation:
      "'Nota fiscal' é objeto de dados (um documento daquela execução); 'Banco de clientes' é armazenamento (repositório que persiste entre execuções). O primeiro nasce e morre com o processo, o segundo é consultado e atualizado.",
  },
  {
    id: "q-92",
    category: "conexoes",
    difficulty: "avancado",
    type: "truefalse",
    statement:
      "Uma associação de dados com seta partindo do armazenamento e chegando à atividade indica leitura (entrada de dados) nessa atividade.",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "a",
    explanation:
      "A seta da associação de dados marca a direção da informação: sai do repositório = a atividade lê; vai até o repositório = a atividade grava/atualiza. Sem seta, seria associação simples de artefato.",
  },
  {
    id: "q-93",
    category: "pools",
    difficulty: "avancado",
    type: "mcq",
    statement: "Qual alternativa descreve corretamente o papel das lanes?",
    options: [
      { id: "a", text: "São obrigatórias: todo diagrama precisar de pelo menos uma lane" },
      { id: "b", text: "São opcionais: a pool pode descrever o processo todo sem subdivisão" },
      { id: "c", text: "Sem lanes, a pool é automaticamente considerada caixa-preta" },
      { id: "d", text: "Só diagramas de colaboração podem usá-las" },
    ],
    correctOptionId: "b",
    explanation:
      "Lane é um recurso de organização: agrupa atividades por responsável dentro da pool. Quando o diagrama é pequeno ou há um único responsável, dispensá-las é perfeitamente válido — nada na notação as torna obrigatórias.",
  },
  {
    id: "q-94",
    category: "fundamentos",
    difficulty: "avancado",
    type: "truefalse",
    statement:
      "O BPMN 2.0 define um símbolo oficial próprio para marcos (milestones).",
    options: [
      { id: "a", text: "Verdadeiro" },
      { id: "b", text: "Falso" },
    ],
    correctOptionId: "b",
    explanation:
      "O núcleo da notação não tem símbolo de marco. Na prática, marcos são representados por um evento de fim ou intermediário rotulado (ex.: 'Contrato assinado') ou por anotação. Ferramentas podem oferecer um símbolo convencional, mas ele não é oficial.",
  },
  {
    id: "q-95",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "No diagrama, o elemento destacado recebe um fluxo de entrada e também emite um de saída. Qual é o problema?",
    highlightNodeIds: ["e1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Pagamento confirmado" }),
        n("t1", "task", 340, ROW_MAIN, { label: "Separar os itens" }),
        n("e1", "end", 620, ROW_MAIN, { label: "Separação concluída" }),
        n("t2", "task", 880, ROW_MAIN, { label: "Encaminhar para expedição" }),
      ],
      [e("f1", "s", "t1"), e("f2", "t1", "e1"), e("f3", "e1", "t2")]
    ),
    options: [
      {
        id: "a",
        text: "Ele é um evento de fim — fim não tem saída; se o fluxo continua, o elemento correto é um evento intermediário",
      },
      { id: "b", text: "Nada: eventos de fim podem continuar o fluxo" },
      { id: "c", text: "O problema é ter fluxo de entrada — fim só emite" },
      { id: "d", text: "Deveria ser substituído por um gateway exclusivo" },
    ],
    correctOptionId: "a",
    explanation:
      "O círculo de borda grossa encerra a instância: qualquer saída dele é ignorada na execução. Se 'Encaminhar para expedição' deve acontecer depois, troque por um evento intermediário (ou nem use evento ali).",
  },
  {
    id: "q-96",
    category: "interpretacao",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "No diagrama, o fluxo sai da faixa do 'Atendente' e entra na faixa do 'Supervisor' (elemento destacado). O que essa troca de faixa comunica?",
    highlightNodeIds: ["t2"],
    diagram: d(
      [
        box("p1", "pool", 40, 20, 900, 270, { poolName: "Atendimento" }),
        box("l1", "lane", 74, 50, 866, 105, { laneName: "Atendente" }, { poolId: "p1" }),
        box("l2", "lane", 74, 165, 866, 105, { laneName: "Supervisor" }, { poolId: "p1" }),
        n("s", "start", 130, 100, { label: "Chamado aberto" }, { poolId: "p1" }),
        n("t1", "task", 330, 100, { label: "Registrar chamado" }, { poolId: "p1" }),
        n("gw1", "gateway", 560, 100, { gateway: "exclusive", label: "Resolveu?" }, { poolId: "p1" }),
        n("e1", "end", 690, 100, { label: "Chamado resolvido" }, { poolId: "p1" }),
        n("t2", "task", 760, 215, { label: "Escalar ao supervisor" }, { poolId: "p1" }),
        n("e2", "end", 895, 215, { label: "Escalonado" }, { poolId: "p1" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "gw1"),
        e("f3", "gw1", "e1", "Sim"),
        e("f4", "gw1", "t2", "Não"),
        e("f5", "t2", "e2"),
      ]
    ),
    options: [
      {
        id: "a",
        text: "A responsabilidade passa para outro papel: as lanes indicam quem executa, e o fluxo continua no mesmo processo",
      },
      { id: "b", text: "Um processo termina e outro processo começa" },
      { id: "c", text: "As etapas passam a executar obrigatoriamente em paralelo" },
      { id: "d", text: "Erro de modelagem: fluxos não podem cruzar lanes" },
    ],
    correctOptionId: "a",
    explanation:
      "Lane é responsabilidade, não fronteira de processo: o token segue normalmente quando cruza a faixa — muda apenas de quem é a etapa. Cruzar pools sim seria proibido; lanes, nunca.",
  },
  {
    id: "q-97",
    category: "pratica",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Ao revisar um diagrama, 'percorrer mentalmente o fluxo com um token' desde o início é um método que ajuda a encontrar:",
    options: [
      { id: "a", text: "Apenas erros de ortografia nos rótulos" },
      {
        id: "b",
        text: "Caminhos sem evento de fim, atividades isoladas, junções que não sincronizam e decisões sem saída possível",
      },
      { id: "c", text: "Problemas de cor e de fonte do diagrama" },
      { id: "d", text: "A ordem alfabética das lanes" },
    ],
    correctOptionId: "b",
    explanation:
      "A leitura por token é a técnica clássica de validação: cada ponto em que o token fica preso, desaparece ou não tem para onde ir revela um defeito estrutural — exatamente os erros que a inspeção estática costuma deixar passar.",
  },
  {
    id: "q-98",
    category: "pratica",
    difficulty: "avancado",
    type: "mcq",
    statement:
      "Qual ordem de trabalho facilita modelar um diagrama de colaboração?",
    options: [
      {
        id: "a",
        text: "Primeiro desenhar as mensagens entre os participantes e depois inventar os processos internos",
      },
      {
        id: "b",
        text: "Primeiro definir os participantes (pools) e o fluxo de cada um; depois conectar as pools com fluxos de mensagem",
      },
      { id: "c", text: "Desenhar tudo em uma pool só e separar depois" },
      { id: "d", text: "Começar pelos eventos de fim e retroceder até o início" },
    ],
    correctOptionId: "b",
    explanation:
      "Cada pool é um processo próprio e autocontido (início → fluxo → fim). Só depois de os dois processos estarem internamente corretos é que a comunicação entre eles é desenhada — mensagens cruzadas em processos incompletos escondem falhas de ambos.",
  },
  {
    id: "q-99",
    category: "atividades",
    difficulty: "avancado",
    type: "diagram",
    statement:
      "O elemento destacado é um evento de fronteira de temporizador anexado à atividade 'Aguardar a companhia'. Se o prazo estourar:",
    highlightNodeIds: ["b1"],
    diagram: d(
      [
        n("s", "start", 80, ROW_MAIN, { label: "Reserva solicitada" }),
        n("t1", "task", 340, ROW_MAIN, { label: "Aguardar a companhia" }),
        n("b1", "intermediate", 340, 194, { label: "Prazo esgotado", marker: "timer" }),
        n("t2", "task", 580, 194, { label: "Oferecer alternativa" }),
        n("e1", "end", 700, ROW_MAIN, { label: "Reserva confirmada" }),
        n("e2", "end", 860, 194, { label: "Cliente avisado" }),
      ],
      [
        e("f1", "s", "t1"),
        e("f2", "t1", "e1"),
        e("f3", "b1", "t2"),
        e("f4", "t2", "e2"),
      ]
    ),
    options: [
      {
        id: "a",
        text: "A atividade é interrompida e o fluxo segue por 'Oferecer alternativa' — o caminho 'Reserva confirmada' não acontece mais nesta instância",
      },
      {
        id: "b",
        text: "A atividade continua normalmente e o ramo do prazo só ativa quando ela terminar",
      },
      { id: "c", text: "Todo o processo é encerrado imediatamente" },
      { id: "d", text: "O token retorna ao evento de início" },
    ],
    correctOptionId: "a",
    explanation:
      "O evento de fronteira por padrão é interrompente: ao disparar, cancela a atividade à qual está anexado e conduz o token pelo ramo de tratamento. Sem essa interrupção, o processo ficaria com dois caminhos ativos ao mesmo tempo.",
  },
  {
    id: "q-100",
    category: "fundamentos",
    difficulty: "avancado",
    type: "symbol",
    statement: "Qual é o nome deste elemento?",
    symbolId: "artifact-group",
    options: [
      { id: "a", text: "Grupo (Group)" },
      { id: "b", text: "Lane" },
      { id: "c", text: "Subprocesso expandido" },
      { id: "d", text: "Armazenamento de dados" },
    ],
    correctOptionId: "a",
    explanation:
      "O grupo é um artefato visual: contorna etapas de uma mesma fase (ex.: 'Fase de aprovação') apenas para leitura — não tem semântica de execução e não afeta o fluxo. Lane é faixa de responsabilidade, subprocesso tem fluxo interno e armazenamento é repositório.",
  },
];
