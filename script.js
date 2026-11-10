/*
 * ==========================================================
 * SCRIPT UNIFICADO
 * ==========================================================
 * Organização do arquivo:
 *
 *   1. COMPARTILHADO  -> funções usadas por mais de uma página
 *   2. SALAS          -> salas.html
 *   3. FINANCEIRO     -> financeiro.html
 *   4. CONVENIÊNCIA   -> página de produtos/consumo
 *
 * Cada módulo fica dentro da sua própria function (...)() para que
 * as variáveis não briguem entre si, e só roda se a página tiver o
 * elemento principal dela (senão sai com return).
 */


/* ==========================================================
   1. COMPARTILHADO
   Funções e elementos usados por mais de uma página.
========================================================== */

// Elementos de filtro que existem (com o mesmo id) em várias páginas.
// Em páginas que não têm o elemento, o valor fica null.
var campoBusca = document.getElementById("campoBusca");
var filtroUnidade = document.getElementById("filtroUnidade");
var filtroStatus = document.getElementById("filtroStatus");

/*
 * Formata um número como dinheiro em reais.
 * Ex.: 1200 -> "R$ 1.200,00".
 * Com semCentavos = true: 1200 -> "R$ 1.200" (usado no Financeiro).
 */
function formatarDinheiro(valor, semCentavos) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: semCentavos ? 0 : 2,
    maximumFractionDigits: semCentavos ? 0 : 2
  });
}

/*
 * Recebe o texto de um status (de sala ou de pagamento) e devolve
 * o nome da classe CSS correspondente. Evita comparar texto com
 * acento em vários lugares do código.
 */
var CLASSES_DE_STATUS = {
  // Salas
  "Ocupada": "status-ocupada",
  "Disponível": "status-disponivel",
  "Reservada": "status-reservada",
  "Indisponível": "status-indisponivel",
  // Financeiro
  "Pago": "status-pago",
  "Pendente": "status-pendente",
  "Em atraso": "status-atraso"
};

function classeDoStatus(status) {
  return CLASSES_DE_STATUS[status] || "";
}

/*
 * Mostra a mensagem de "nada encontrado" copiando o template
 * (<template id="modeloVazio">) que fica no HTML.
 */
function mostrarVazio(container) {
  var modeloVazio = document.getElementById("modeloVazio");
  container.appendChild(modeloVazio.content.cloneNode(true));
}


/* ==========================================================
   2. SALAS (salas.html)
========================================================== */
(function () {
  // só roda na página de salas
  if (!document.getElementById("listaDeSalas")) return;

  // O ID fixo identifica cada sala mesmo após mudar o nome ou a unidade.
  var salas = [
    { id: "01", nome: "Sala 01", unidade: "Unidade 1", status: "Ocupada",      profissional: "Dr. Carlos Silva",   horario: "08:00 - 12:00" },
    { id: "02", nome: "Sala 02", unidade: "Unidade 1", status: "Disponível",   profissional: "",                   horario: "Próxima: 14:00" },
    { id: "03", nome: "Sala 03", unidade: "Unidade 1", status: "Reservada",    profissional: "Dra. Mariana Costa", horario: "10:00 - 14:00" },
    { id: "04", nome: "Sala 04", unidade: "Unidade 2", status: "Ocupada",      profissional: "Dr. João Pereira",   horario: "08:00 - 12:00" },
    { id: "05", nome: "Sala 05", unidade: "Unidade 2", status: "Disponível",   profissional: "",                   horario: "Próxima: 13:00" },
    { id: "06", nome: "Sala 06", unidade: "Unidade 2", status: "Indisponível", profissional: "",                   horario: "Manutenção" }
  ];

  // Elementos da página
  var listaDeSalas = document.getElementById("listaDeSalas");
  var modelo = document.getElementById("modeloCard");

  // Elementos do formulário de edição
  var btnEditarSalas = document.getElementById("btnEditarSalas");
  var dialogEditarSalas = document.getElementById("dialogEditarSalas");
  var formEditarSalas = document.getElementById("formEditarSalas");
  var campos = formEditarSalas.elements;
  var erroEditarSalas = document.getElementById("erroEditarSalas");
  var prefixoSala = "attento.sala.";

  /*
   * Inicialização dos dados: recupera as edições salvas no navegador
   * (cada sala tem uma chave própria no localStorage) e preenche
   * os selects do formulário de edição.
   */
  salas.forEach(function (sala) {
    try {
      var dadosSalvos = JSON.parse(localStorage.getItem(prefixoSala + sala.id));
      Object.assign(sala, dadosSalvos);
    } catch {
      // Mantém os dados iniciais se não for possível ler a edição salva.
    }

    campos.sala.add(new Option(sala.nome + " — " + sala.unidade, sala.id));
  });

  // Usa as mesmas opções dos filtros, sem a opção de exibir todos.
  Array.from(filtroUnidade.options).slice(1).forEach(function (opcao) {
    campos.unidade.add(opcao.cloneNode(true));
  });
  Array.from(filtroStatus.options).slice(1).forEach(function (opcao) {
    campos.status.add(opcao.cloneNode(true));
  });

  /*
   * Monta os cards na tela a partir da lista recebida.
   * Cada card é uma cópia do template escondido no HTML.
   */
  function desenharSalas(lista) {

    listaDeSalas.innerHTML = ""; // limpa tudo antes de desenhar de novo

    if (lista.length === 0) {
      mostrarVazio(listaDeSalas);
      return;
    }

    // forEach (e não for + var) para cada card guardar a SUA sala
    lista.forEach(function (sala) {

      var card = modelo.content.cloneNode(true);

      card.querySelector(".card-nome").textContent = sala.nome;
      card.querySelector(".card-unidade").textContent = sala.unidade;

      // a cor vai só no card-status, a bolinha e o texto herdam ela
      card.querySelector(".card-status").className =
        "card-status " + classeDoStatus(sala.status);
      card.querySelector(".texto-status").textContent = sala.status;

      // se não tiver profissional/horário, mostra um tracinho no lugar
      card.querySelector(".card-profissional").textContent =
        sala.profissional ? "👤 " + sala.profissional : "-- --";
      card.querySelector(".card-horario").textContent =
        sala.horario ? "🕒 " + sala.horario : "-- --";

      // por enquanto "ver detalhes" só mostra um alerta
      // (lugar certo para depois abrir um modal de verdade)
      card.querySelector(".botao-detalhes").addEventListener("click", function () {
        alert(
          "Detalhes da " + sala.nome + "\n" +
          "Unidade: " + sala.unidade + "\n" +
          "Status: " + sala.status
        );
      });

      listaDeSalas.appendChild(card);
    });
  }

  /*
   * Junta os 3 filtros (busca + unidade + status)
   * e redesenha a lista de salas.
   */
  function aplicarFiltros() {
    var texto = campoBusca.value.toLowerCase();
    var unidadeEscolhida = filtroUnidade.value;
    var statusEscolhido = filtroStatus.value;

    var salasFiltradas = salas.filter(function (sala) {
      var bateComTexto = sala.nome.toLowerCase().includes(texto);
      var bateComUnidade = unidadeEscolhida === "todas" || sala.unidade === unidadeEscolhida;
      var bateComStatus = statusEscolhido === "todos" || sala.status === statusEscolhido;

      return bateComTexto && bateComUnidade && bateComStatus;
    });

    desenharSalas(salasFiltradas);
  }

  campoBusca.addEventListener("input", aplicarFiltros);
  filtroUnidade.addEventListener("change", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  /*
   * Devolve a sala escolhida no select do formulário de edição,
   * localizando-a pelo ID.
   */
  function salaSelecionada() {
    return salas.find(function (sala) {
      return sala.id === campos.sala.value;
    });
  }

  /*
   * Carrega os dados da sala escolhida nos campos do formulário
   * e esconde qualquer mensagem de erro anterior.
   */
  function preencherFormulario() {
    var sala = salaSelecionada();
    campos.nome.value = sala.nome;
    campos.unidade.value = sala.unidade;
    campos.status.value = sala.status;
    campos.profissional.value = sala.profissional;
    campos.horario.value = sala.horario;
    erroEditarSalas.hidden = true;
  }

  btnEditarSalas.addEventListener("click", function () {
    preencherFormulario();
    dialogEditarSalas.showModal();
  });

  campos.sala.addEventListener("change", preencherFormulario);

  // Cancelar fecha a janela e descarta os dados digitados
  document.getElementById("btnCancelarEdicaoSala").addEventListener("click", function () {
    dialogEditarSalas.close();
  });

  /*
   * Salva a edição no navegador (localStorage) e só então atualiza
   * a sala, o select do formulário e reaplica os filtros.
   * Se o navegador não permitir salvar, mostra o erro e não altera nada.
   */
  formEditarSalas.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var sala = salaSelecionada();
    var alteracoes = {
      nome: campos.nome.value.trim(),
      unidade: campos.unidade.value,
      status: campos.status.value,
      profissional: campos.profissional.value.trim(),
      horario: campos.horario.value.trim()
    };

    try {
      localStorage.setItem(prefixoSala + sala.id, JSON.stringify(alteracoes));
    } catch {
      erroEditarSalas.textContent = "Não foi possível salvar as alterações neste navegador.";
      erroEditarSalas.hidden = false;
      return;
    }

    Object.assign(sala, alteracoes);
    campos.sala.selectedOptions[0].textContent = sala.nome + " — " + sala.unidade;
    dialogEditarSalas.close();
    aplicarFiltros();
  });

  // o menu lateral não precisa de JS: os itens já são links no HTML

  // Inicialização: mostra as salas com os dados salvos e filtros atuais
  aplicarFiltros();
})();


/* ==========================================================
   3. FINANCEIRO (financeiro.html)
========================================================== */
(function () {
  // só roda na página de financeiro
  if (!document.getElementById("listaDePagamentos")) return;

  var pagamentos = [
    { profissional: "Dr. Carlos Silva",   unidade: "Unidade 1", sala: "Sala 01", valor: 1200, vencimento: "10/09/2026", pagamento: "10/09/2026", status: "Pago" },
    { profissional: "Dra. Mariana Costa", unidade: "Unidade 1", sala: "Sala 03", valor: 950,  vencimento: "15/09/2026", pagamento: "",           status: "Pendente" },
    { profissional: "Dr. Roberto Lima",   unidade: "Unidade 2", sala: "Sala 07", valor: 1400, vencimento: "20/09/2026", pagamento: "18/09/2026", status: "Pago" },
    { profissional: "Dra. Ana Souza",     unidade: "Unidade 2", sala: "Sala 12", valor: 1100, vencimento: "25/09/2026", pagamento: "",           status: "Pendente" },
    { profissional: "Dr. Felipe Alves",   unidade: "Unidade 1", sala: "Sala 05", valor: 980,  vencimento: "28/09/2026", pagamento: "",           status: "Em atraso" }
  ];

  // Elementos da página
  var listaDePagamentos = document.getElementById("listaDePagamentos");
  var modelo = document.getElementById("modeloLinha");
  var valorRecebido = document.getElementById("valorRecebido");
  var valorPendente = document.getElementById("valorPendente");
  var valorPrevisto = document.getElementById("valorPrevisto");
  var btnExportar = document.getElementById("btnExportar");

  // guarda o que está aparecendo na tabela, para exportar a mesma coisa
  var pagamentosNaTela = pagamentos;

  /*
   * Soma os valores da lista e mostra nos 3 cards do topo:
   * recebido (Pago), pendente (Pendente + Em atraso) e previsto (total).
   */
  function calcularResumo(lista) {
    var recebido = 0;
    var pendente = 0;

    lista.forEach(function (pagamento) {
      if (pagamento.status === "Pago") {
        recebido += pagamento.valor;
      } else {
        // "Pendente" e "Em atraso" ainda não foram pagos
        pendente += pagamento.valor;
      }
    });

    valorRecebido.textContent = formatarDinheiro(recebido, true);
    valorPendente.textContent = formatarDinheiro(pendente, true);
    valorPrevisto.textContent = formatarDinheiro(recebido + pendente, true);
  }

  /*
   * Monta as linhas da tabela a partir da lista recebida,
   * copiando o template de linha que fica escondido no HTML.
   */
  function desenharPagamentos(lista) {

    listaDePagamentos.innerHTML = ""; // limpa tudo antes de desenhar de novo

    if (lista.length === 0) {
      mostrarVazio(listaDePagamentos);
      return;
    }

    lista.forEach(function (pagamento) {

      var linha = modelo.content.cloneNode(true);

      linha.querySelector(".col-profissional").textContent = pagamento.profissional;
      linha.querySelector(".col-unidade").textContent = pagamento.unidade;
      linha.querySelector(".col-sala").textContent = pagamento.sala;
      linha.querySelector(".col-valor").textContent = formatarDinheiro(pagamento.valor, true);
      linha.querySelector(".col-vencimento").textContent = pagamento.vencimento;

      // se ainda não pagou, mostra um tracinho no lugar da data
      linha.querySelector(".col-pagamento").textContent =
        pagamento.pagamento ? pagamento.pagamento : "--";

      // a cor vai só na linha-status, a bolinha e o texto herdam ela
      var linhaStatus = linha.querySelector(".linha-status");
      linhaStatus.className = "linha-status " + classeDoStatus(pagamento.status);
      linha.querySelector(".texto-status").textContent = pagamento.status;

      listaDePagamentos.appendChild(linha);
    });
  }

  /*
   * Junta os 3 filtros (busca por profissional + unidade + status),
   * atualiza o resumo e redesenha a tabela.
   */
  function aplicarFiltros() {
    var texto = campoBusca.value.toLowerCase();
    var unidadeEscolhida = filtroUnidade.value;
    var statusEscolhido = filtroStatus.value;

    pagamentosNaTela = pagamentos.filter(function (pagamento) {
      var bateComTexto = pagamento.profissional.toLowerCase().includes(texto);
      var bateComUnidade = unidadeEscolhida === "todas" || pagamento.unidade === unidadeEscolhida;
      var bateComStatus = statusEscolhido === "todos" || pagamento.status === statusEscolhido;

      return bateComTexto && bateComUnidade && bateComStatus;
    });

    calcularResumo(pagamentosNaTela);
    desenharPagamentos(pagamentosNaTela);
  }

  campoBusca.addEventListener("input", aplicarFiltros);
  filtroUnidade.addEventListener("change", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  /*
   * Exporta o que está na tabela como planilha (.csv).
   * Usa ";" como separador (Excel em português) e BOM no começo
   * para o Excel entender os acentos.
   */
  btnExportar.addEventListener("click", function () {
    var linhas = ["Profissional;Unidade;Sala;Valor;Vencimento;Pagamento;Status"];

    pagamentosNaTela.forEach(function (pagamento) {
      linhas.push([
        pagamento.profissional,
        pagamento.unidade,
        pagamento.sala,
        pagamento.valor,
        pagamento.vencimento,
        pagamento.pagamento ? pagamento.pagamento : "--",
        pagamento.status
      ].join(";"));
    });

    var arquivo = new Blob(["\uFEFF" + linhas.join("\n")], { type: "text/csv;charset=utf-8" });

    var link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = "pagamentos.csv";
    link.click();

    // libera o arquivo da memória depois que o download começou
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
  });

  // o menu lateral não precisa de JS: os itens já são links no HTML

  // Inicialização: desenha tudo assim que a página carrega
  aplicarFiltros();
})();


/* ==========================================================
   4. CONVENIÊNCIA (página de produtos e consumo)
========================================================== */
(function () {
  // só roda na página de produtos
  if (!document.getElementById("listaDeProdutos")) return;

  /*
   * DADOS MOCKADOS DO PROTÓTIPO
   *
   * Aqui deixamos somente alguns produtos para a tela ter conteúdo.
   * Depois, no backend, esses dados podem vir de uma API/banco de dados.
   */
  var produtos = [
    { id: 1, nome: "Cápsula de Café",   preco: 2.00,  estoque: 38, icone: "☕" },
    { id: 2, nome: "Cappuccino",        preco: 5.00,  estoque: 24, icone: "☕" },
    { id: 3, nome: "Biscoito",          preco: 2.00,  estoque: 31, icone: "🍪" },
    { id: 4, nome: "Caixa de Café",     preco: 40.00, estoque: 7,  icone: "📦" },
    { id: 5, nome: "Barra de Proteína", preco: 6.00,  estoque: 18, icone: "🍫" },
    { id: 6, nome: "Chocolate",         preco: 2.00,  estoque: 22, icone: "🍫" }
  ];

  /*
   * Não precisamos cadastrar uma lista enorme de profissionais.
   * Para o protótipo, o nome é digitado no momento do consumo.
   *
   * Depois:
   * backend/API -> profissionais -> select de profissionais.
   *
   * Algumas movimentações pequenas servem apenas para a tela não ficar vazia.
   */
  var movimentacoes = [
    { profissional: "Josy",       produto: "Cápsula de Café",   quantidade: 2, data: "15/07/2026", status: "Pago" },
    { profissional: "Elisangela", produto: "Cappuccino",        quantidade: 1, data: "03/07/2026", status: "Pago" },
    { profissional: "Beatriz",    produto: "Biscoito",          quantidade: 5, data: "07/07/2026", status: "Pago" },
    { profissional: "Pedro",      produto: "Barra de Proteína", quantidade: 5, data: "14/01/2026", status: "Pendente" }
  ];

  // Elementos da página
  var listaDeProdutos = document.getElementById("listaDeProdutos");
  var listaMovimentacoes = document.getElementById("listaMovimentacoes");

  var modalProduto = document.getElementById("modalProduto");
  var modalConsumo = document.getElementById("modalConsumo");

  var formProduto = document.getElementById("formProduto");
  var formConsumo = document.getElementById("formConsumo");

  var produtoConsumo = document.getElementById("produtoConsumo");


  /* -----------------------------
     PRODUTOS
  ----------------------------- */

  /* Devolve a classe CSS do estoque (indisponível, baixo ou disponível). */
  function classeDoEstoque(estoque) {
    if (estoque === 0) return "estoque-indisponivel";
    if (estoque <= 5) return "estoque-baixo";
    return "estoque-disponivel";
  }

  /* Devolve o texto exibido para o nível de estoque. */
  function textoDoEstoque(estoque) {
    if (estoque === 0) return "Sem estoque";
    if (estoque <= 5) return "Estoque baixo";
    return "Disponível";
  }

  /*
   * Monta os cards de produto a partir da lista recebida
   * e liga os botões "Registrar consumo" de cada card.
   */
  function desenharProdutos(lista) {

    listaDeProdutos.innerHTML = "";

    if (lista.length === 0) {
      listaDeProdutos.innerHTML =
        '<p class="sem-resultados">Nenhum produto encontrado.</p>';
      return;
    }

    for (var i = 0; i < lista.length; i++) {

      var produto = lista[i];

      var card = document.createElement("div");
      card.className = "card-produto";

      card.innerHTML = `
        <div class="produto-imagem">
          ${produto.icone}
        </div>

        <div class="produto-informacoes">

          <div class="produto-topo">
            <h3>${produto.nome}</h3>
          </div>

          <p class="produto-preco">${formatarDinheiro(produto.preco)}</p>

          <div class="produto-estoque">
            <span class="bolinha-estoque ${classeDoEstoque(produto.estoque)}"></span>
            <span class="${classeDoEstoque(produto.estoque)}">
              ${textoDoEstoque(produto.estoque)}
            </span>

            <span class="quantidade-estoque">
              ${produto.estoque} un.
            </span>
          </div>

          <button class="botao-consumir"
                  data-produto="${produto.nome}">
            Registrar consumo
          </button>

        </div>
      `;

      listaDeProdutos.appendChild(card);
    }

    adicionarEventosDosBotoesDeConsumo();
  }

  /*
   * Liga cada botão "Registrar consumo" ao modal de consumo,
   * já selecionando o produto do card clicado.
   */
  function adicionarEventosDosBotoesDeConsumo() {

    var botoes = document.querySelectorAll(".botao-consumir");

    botoes.forEach(function (botao) {

      botao.addEventListener("click", function () {

        produtoConsumo.value = botao.getAttribute("data-produto");

        abrirModal(modalConsumo);

      });

    });
  }

  /*
   * Preenche o select de produtos do modal de consumo
   * com todos os produtos cadastrados.
   */
  function atualizarSelectProdutos() {

    produtoConsumo.innerHTML = "";

    for (var i = 0; i < produtos.length; i++) {

      var option = document.createElement("option");

      option.value = produtos[i].nome;
      option.textContent = produtos[i].nome;

      produtoConsumo.appendChild(option);
    }
  }


  /* -----------------------------
     FILTROS
  ----------------------------- */

  /*
   * Aplica a busca por nome e o filtro de estoque,
   * redesenha os produtos e atualiza o contador.
   */
  function aplicarFiltros() {

    var texto = campoBusca.value.toLowerCase();
    var status = filtroStatus.value;

    var produtosFiltrados = produtos.filter(function (produto) {

      var bateComTexto = produto.nome.toLowerCase().includes(texto);

      var bateComStatus = true;

      if (status === "disponivel") {
        bateComStatus = produto.estoque > 5;
      }

      if (status === "baixo") {
        bateComStatus = produto.estoque > 0 && produto.estoque <= 5;
      }

      if (status === "indisponivel") {
        bateComStatus = produto.estoque === 0;
      }

      return bateComTexto && bateComStatus;

    });

    desenharProdutos(produtosFiltrados);

    document.getElementById("contadorProdutos").textContent =
      produtosFiltrados.length +
      (produtosFiltrados.length === 1 ? " produto" : " produtos");
  }

  campoBusca.addEventListener("input", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);


  /* -----------------------------
     RESUMO
  ----------------------------- */

  /*
   * Atualiza os cards de resumo: total de produtos, itens consumidos,
   * valor total consumido e quantidade de produtos com estoque baixo.
   */
  function atualizarResumo() {

    document.getElementById("totalProdutos").textContent = produtos.length;

    var totalItens = 0;
    var totalVendido = 0;

    for (var i = 0; i < movimentacoes.length; i++) {

      var movimentacao = movimentacoes[i];

      var produto = produtos.find(function (item) {
        return item.nome === movimentacao.produto;
      });

      if (produto) {
        totalItens += movimentacao.quantidade;
        totalVendido += produto.preco * movimentacao.quantidade;
      }
    }

    document.getElementById("totalItens").textContent = totalItens;

    document.getElementById("totalVendido").textContent =
      formatarDinheiro(totalVendido);

    var produtosComEstoqueBaixo = produtos.filter(function (produto) {
      return produto.estoque <= 5;
    });

    document.getElementById("estoqueBaixo").textContent =
      produtosComEstoqueBaixo.length;
  }


  /* -----------------------------
     MOVIMENTAÇÕES
  ----------------------------- */

  /*
   * Monta a tabela de movimentações (consumos registrados),
   * com valor calculado e botão de excluir em cada linha.
   */
  function desenharMovimentacoes() {

    listaMovimentacoes.innerHTML = "";

    for (var i = 0; i < movimentacoes.length; i++) {

      var movimentacao = movimentacoes[i];

      var produto = produtos.find(function (item) {
        return item.nome === movimentacao.produto;
      });

      var valor = produto ? produto.preco * movimentacao.quantidade : 0;

      var linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${movimentacao.profissional}</td>
        <td>${movimentacao.produto}</td>
        <td>${movimentacao.quantidade}</td>
        <td>${movimentacao.data}</td>
        <td>${formatarDinheiro(valor)}</td>
        <td>
          <span class="status ${movimentacao.status.toLowerCase()}">
            ${movimentacao.status}
          </span>
        </td>
        <td>
          <button class="btn-excluir" data-indice="${i}" title="Excluir consumo">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      `;

      listaMovimentacoes.appendChild(linha);
    }

    // transforma os <i data-lucide> em ícones (uma vez, depois do laço)
    if (window.lucide) lucide.createIcons();
  }

  /*
   * Exclui um consumo ao clicar na lixeira: pede confirmação,
   * devolve a quantidade ao estoque e atualiza a tela.
   */
  listaMovimentacoes.addEventListener("click", function (evento) {

    var botao = evento.target.closest(".btn-excluir");

    if (!botao) return;

    var indice = Number(botao.getAttribute("data-indice"));

    if (confirm("Deseja realmente excluir este consumo?")) {

      var consumo = movimentacoes[indice];

      var produto = produtos.find(function (item) {
        return item.nome === consumo.produto;
      });

      if (produto) {
        produto.estoque += consumo.quantidade;
      }

      movimentacoes.splice(indice, 1);

      desenharMovimentacoes();
      atualizarResumo();
      aplicarFiltros();
    }
  });


  /* -----------------------------
     MODAIS
  ----------------------------- */

  /* Abre um modal adicionando a classe "aberto". */
  function abrirModal(modal) {
    modal.classList.add("aberto");
  }

  /* Fecha um modal removendo a classe "aberto". */
  function fecharModal(modal) {
    modal.classList.remove("aberto");
  }

  // Botões com [data-fechar="idDoModal"] fecham o modal indicado
  document.querySelectorAll("[data-fechar]").forEach(function (botao) {

    botao.addEventListener("click", function () {

      fecharModal(document.getElementById(botao.getAttribute("data-fechar")));

    });

  });

  // Clicar no fundo escuro (fora da caixa) também fecha o modal
  document.querySelectorAll(".modal-fundo").forEach(function (modal) {

    modal.addEventListener("click", function (evento) {

      if (evento.target === modal) {
        fecharModal(modal);
      }

    });

  });


  /* -----------------------------
     CADASTRAR PRODUTO
  ----------------------------- */

  document.getElementById("btnNovoProduto")
    .addEventListener("click", function () {

      abrirModal(modalProduto);

    });

  /*
   * Cadastra um novo produto a partir do formulário,
   * fecha o modal e atualiza select, resumo e lista.
   */
  formProduto.addEventListener("submit", function (evento) {

    evento.preventDefault();

    var nome = document.getElementById("nomeProduto").value;
    var preco = Number(document.getElementById("precoProduto").value);
    var estoque = Number(document.getElementById("quantidadeProduto").value);

    produtos.push({
      id: produtos.length + 1,
      nome: nome,
      preco: preco,
      estoque: estoque,
      icone: "▣"
    });

    formProduto.reset();

    fecharModal(modalProduto);

    atualizarSelectProdutos();
    atualizarResumo();
    aplicarFiltros();

  });


  /* -----------------------------
     REGISTRAR CONSUMO
  ----------------------------- */

  document.getElementById("btnNovoConsumo")
    .addEventListener("click", function () {

      abrirModal(modalConsumo);

    });

  /*
   * Registra um consumo: baixa o estoque, adiciona a movimentação
   * (como "Pendente") no topo da tabela e atualiza a tela.
   */
  formConsumo.addEventListener("submit", function (evento) {

    evento.preventDefault();

    var profissional = document.getElementById("profissionalConsumo").value;
    var produtoNome = produtoConsumo.value;
    var quantidade = Number(document.getElementById("quantidadeConsumo").value);
    var data = document.getElementById("dataConsumo").value;

    var produto = produtos.find(function (item) {
      return item.nome === produtoNome;
    });

    if (!produto) return;

    /*
     * No protótipo, atualizamos o estoque apenas para
     * visualizar a interação.
     *
     * Depois essa alteração será responsabilidade do backend.
     */
    produto.estoque = Math.max(0, produto.estoque - quantidade);

    movimentacoes.unshift({
      profissional: profissional,
      produto: produtoNome,
      quantidade: quantidade,
      data: data.split("-").reverse().join("/"),
      status: "Pendente"
    });

    formConsumo.reset();

    fecharModal(modalConsumo);

    desenharMovimentacoes();
    atualizarResumo();
    aplicarFiltros();

  });


  /* -----------------------------
     INICIALIZAÇÃO
  ----------------------------- */

  // Data de hoje como padrão no formulário de consumo
  document.getElementById("dataConsumo").value =
    new Date().toISOString().split("T")[0];

  atualizarSelectProdutos();
  desenharMovimentacoes();
  atualizarResumo();
  aplicarFiltros(); // já desenha os produtos e o contador
})();
