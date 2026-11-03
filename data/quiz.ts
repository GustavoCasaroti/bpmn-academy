import type { QuizQuestion } from "@/types";
import { d, e, n, ROW_BOTTOM, ROW_MAIN, ROW_TOP } from "@/data/diagram-helpers";

/**
 * 30 questões do quiz, distribuídas por categoria e dificuldade.
 * IDs: q-01 a q-30.
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
];
