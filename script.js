// ##########################################################
// >>> INÍCIO DA PARTE INSERIDA: páginas Salas e Financeiro
// Tudo daqui até o "FIM DA PARTE INSERIDA" é o JS das páginas
// salas.html (Salas) e financeiro.html (Financeiro).
// Inserido em: 22/10/2026
//
// O que foi mudado neste arquivo:
// - adicionado este bloco no COMEÇO do arquivo. Ele precisa ficar antes
//   do código da Conveniência: aquele código procura elementos que só
//   existem na página dela (ex.: btnNovoProduto) e, nas outras páginas,
//   para com erro; se este bloco ficasse depois, não rodaria em Salas e
//   Financeiro;
// - nenhuma linha do código que já existia foi alterada.
//
// Cada página fica dentro da sua própria function (...)() pra que as
// variáveis (modelo, campoBusca, classeDoStatus...) não briguem entre si
// nem com o resto do arquivo, e só roda se a página tiver o elemento
// dela (senão sai com return) - assim não interfere nas outras páginas.
// ##########################################################

// ==========================================================
// PÁGINA SALAS (salas.html)
// ==========================================================
(function () {
  // só roda na página de salas
  if (!document.getElementById("listaDeSalas")) return;

  var salas = [
    {
      nome: "Sala 01",
      unidade: "Unidade 1",
      status: "Ocupada",
      profissional: "Dr. Carlos Silva",
      horario: "08:00 - 12:00"
    },
    {
      nome: "Sala 02",
      unidade: "Unidade 1",
      status: "Disponível",
      profissional: "",
      horario: "Próxima: 14:00"
    },
    {
      nome: "Sala 03",
      unidade: "Unidade 1",
      status: "Reservada",
      profissional: "Dra. Mariana Costa",
      horario: "10:00 - 14:00"
    },
    {
      nome: "Sala 04",
      unidade: "Unidade 2",
      status: "Ocupada",
      profissional: "Dr. João Pereira",
      horario: "08:00 - 12:00"
    },
    {
      nome: "Sala 05",
      unidade: "Unidade 2",
      status: "Disponível",
      profissional: "",
      horario: "Próxima: 13:00"
    },
    {
      nome: "Sala 06",
      unidade: "Unidade 2",
      status: "Indisponível",
      profissional: "",
      horario: "Manutenção"
    }
  ];

  // pega os elementos da página que a gente vai usar bastante
  var listaDeSalas = document.getElementById("listaDeSalas");
  var modelo = document.getElementById("modeloCard");
  var modeloVazio = document.getElementById("modeloVazio");
  var campoBusca = document.getElementById("campoBusca");
  var filtroUnidade = document.getElementById("filtroUnidade");
  var filtroStatus = document.getElementById("filtroStatus");
  var btnNovaSala = document.getElementById("btnNovaSala");

  // essa função pega o texto do status e devolve o "nome" da classe css
  // (feito assim pra não precisar ficar comparando acento e tal em vários lugares)
  function classeDoStatus(status) {
    if (status === "Ocupada") return "status-ocupada";
    if (status === "Disponível") return "status-disponivel";
    if (status === "Reservada") return "status-reservada";
    if (status === "Indisponível") return "status-indisponivel";
    return "";
  }

  // monta os cards na tela de acordo com a lista que ela recebe
  function desenharSalas(lista) {

    listaDeSalas.innerHTML = ""; // limpa tudo antes de desenhar de novo

    // a mensagem fica no html (template "modeloVazio"), aqui só copia ela
    if (lista.length === 0) {
      listaDeSalas.appendChild(modeloVazio.content.cloneNode(true));
      return;
    }

    // forEach (e não um for com var) pra cada card guardar a SUA sala;
    // com o for + var, todos os botões acabavam apontando pra última sala
    lista.forEach(function (sala) {

      // copia o "molde" de card que ta escondido no html
      var card = modelo.content.cloneNode(true);

      card.querySelector(".card-nome").textContent = sala.nome;
      card.querySelector(".card-unidade").textContent = sala.unidade;

      // a cor vai só no card-status, a bolinha e o texto herdam ela
      card.querySelector(".card-status").className =
        "card-status " + classeDoStatus(sala.status);
      card.querySelector(".texto-status").textContent = sala.status;

      // se não tiver profissional, mostra um tracinho no lugar
      card.querySelector(".card-profissional").textContent =
        sala.profissional ? "👤 " + sala.profissional : "-- --";

      card.querySelector(".card-horario").textContent = "🕒 " + sala.horario;

      // quando clicar em "ver detalhes", por enquanto só mostra um alerta
      // (aqui é o lugar certo pra depois abrir um modal de verdade)
      card.querySelector(".botao-detalhes").addEventListener("click", function () {
        // usamos "sala" preso na closure pra saber qual card foi clicado
        alert(
          "Detalhes da " + sala.nome + "\n" +
          "Unidade: " + sala.unidade + "\n" +
          "Status: " + sala.status
        );
      });

      listaDeSalas.appendChild(card);
    });
  }

  // junta os 3 filtros (busca + unidade + status) e redesenha a lista
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

  // toda vez que digitar ou trocar um filtro, atualiza a lista
  campoBusca.addEventListener("input", aplicarFiltros);
  filtroUnidade.addEventListener("change", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  // botão de cadastrar sala - por enquanto adiciona uma sala de exemplo
  // (dá pra trocar isso depois por um formulário/modal de cadastro)
  btnNovaSala.addEventListener("click", function () {
    var novaSala = {
      nome: "Sala " + (salas.length + 1).toString().padStart(2, "0"),
      unidade: "Unidade 1",
      status: "Disponível",
      profissional: "",
      horario: "Próxima: --:--"
    };

    salas.push(novaSala);
    aplicarFiltros();
  });

  // o menu lateral não precisa de JS: os itens já são links no html

  // desenha a lista assim que a página carrega
  desenharSalas(salas);
})();


// ==========================================================
// PÁGINA FINANCEIRO (financeiro.html)
// ==========================================================
(function () {
  // só roda na página de financeiro
  if (!document.getElementById("listaDePagamentos")) return;

  var pagamentos = [
    {
      profissional: "Dr. Carlos Silva",
      unidade: "Unidade 1",
      sala: "Sala 01",
      valor: 1200,
      vencimento: "10/09/2026",
      pagamento: "10/09/2026",
      status: "Pago"
    },
    {
      profissional: "Dra. Mariana Costa",
      unidade: "Unidade 1",
      sala: "Sala 03",
      valor: 950,
      vencimento: "15/09/2026",
      pagamento: "",
      status: "Pendente"
    },
    {
      profissional: "Dr. Roberto Lima",
      unidade: "Unidade 2",
      sala: "Sala 07",
      valor: 1400,
      vencimento: "20/09/2026",
      pagamento: "18/09/2026",
      status: "Pago"
    },
    {
      profissional: "Dra. Ana Souza",
      unidade: "Unidade 2",
      sala: "Sala 12",
      valor: 1100,
      vencimento: "25/09/2026",
      pagamento: "",
      status: "Pendente"
    },
    {
      profissional: "Dr. Felipe Alves",
      unidade: "Unidade 1",
      sala: "Sala 05",
      valor: 980,
      vencimento: "28/09/2026",
      pagamento: "",
      status: "Em atraso"
    }
  ];

  // pega os elementos da página que a gente vai usar bastante
  var listaDePagamentos = document.getElementById("listaDePagamentos");
  var modelo = document.getElementById("modeloLinha");
  var modeloVazio = document.getElementById("modeloVazio");
  var campoBusca = document.getElementById("campoBusca");
  var filtroUnidade = document.getElementById("filtroUnidade");
  var filtroStatus = document.getElementById("filtroStatus");
  var valorRecebido = document.getElementById("valorRecebido");
  var valorPendente = document.getElementById("valorPendente");
  var valorPrevisto = document.getElementById("valorPrevisto");
  var btnExportar = document.getElementById("btnExportar");

  // guarda o que está aparecendo na tabela, pra exportar a mesma coisa
  var pagamentosNaTela = pagamentos;

  // transforma 1200 em "R$ 1.200"
  function formatarDinheiro(valor) {
    return "R$ " + valor.toLocaleString("pt-BR");
  }

  // mesma ideia das salas: pega o status e devolve a classe css
  function classeDoStatus(status) {
    if (status === "Pago") return "status-pago";
    if (status === "Pendente") return "status-pendente";
    if (status === "Em atraso") return "status-atraso";
    return "";
  }

  // soma os valores da lista e mostra nos 3 cards lá de cima
  function calcularResumo(lista) {
    var recebido = 0;
    var pendente = 0;

    lista.forEach(function (pagamento) {
      if (pagamento.status === "Pago") {
        recebido = recebido + pagamento.valor;
      } else {
        // "Pendente" e "Em atraso" entram aqui, os dois ainda não foram pagos
        pendente = pendente + pagamento.valor;
      }
    });

    valorRecebido.textContent = formatarDinheiro(recebido);
    valorPendente.textContent = formatarDinheiro(pendente);
    valorPrevisto.textContent = formatarDinheiro(recebido + pendente);
  }

  // monta as linhas da tabela de acordo com a lista que ela recebe
  function desenharPagamentos(lista) {

    listaDePagamentos.innerHTML = ""; // limpa tudo antes de desenhar de novo

    // a linha de aviso fica no html (template "modeloVazio"), aqui só copia ela
    if (lista.length === 0) {
      listaDePagamentos.appendChild(modeloVazio.content.cloneNode(true));
      return;
    }

    lista.forEach(function (pagamento) {

      // copia o "molde" de linha que ta escondido no html
      var linha = modelo.content.cloneNode(true);

      linha.querySelector(".col-profissional").textContent = pagamento.profissional;
      linha.querySelector(".col-unidade").textContent = pagamento.unidade;
      linha.querySelector(".col-sala").textContent = pagamento.sala;
      linha.querySelector(".col-valor").textContent = formatarDinheiro(pagamento.valor);
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

  // junta os 3 filtros (busca + unidade + status) e redesenha tudo
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

  // toda vez que digitar ou trocar um filtro, atualiza a tela
  campoBusca.addEventListener("input", aplicarFiltros);
  filtroUnidade.addEventListener("change", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  // botão de exportar - baixa o que está na tabela como planilha (.csv)
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
      ].join(";")); // o excel em português separa as colunas com ";"
    });

    // o "\uFEFF" (BOM) no começo é pro excel entender os acentos
    // (escrito assim porque o caractere invisível some fácil ao editar o arquivo)
    var arquivo = new Blob(["\uFEFF" + linhas.join("\n")], { type: "text/csv;charset=utf-8" });

    var link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = "pagamentos.csv";
    link.click();

    // libera o arquivo da memória depois que o download começou
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
  });

  // o menu lateral não precisa de JS: os itens já são links no html

  // desenha tudo assim que a página carrega
  aplicarFiltros();
})();

// ##########################################################
// <<< FIM DA PARTE INSERIDA: páginas Salas e Financeiro
// ##########################################################

/*
 * DADOS MOCKADOS DO PROTÓTIPO
 *
 * Aqui deixamos somente alguns produtos para a tela ter conteúdo.
 * Depois, no backend, esses dados podem vir de uma API/banco de dados.
 */

var produtos = [
  {
    id: 1,
    nome: "Cápsula de Café",
    preco: 2.00,
    estoque: 38,
    icone: "☕"
  },
  {
    id: 2,
    nome: "Cappuccino",
    preco: 5.00,
    estoque: 24,
    icone: "☕"
  },
  {
    id: 3,
    nome: "Biscoito",
    preco: 2.00,
    estoque: 31,
    icone: "🍪"
  },
  {
    id: 4,
    nome: "Caixa de Café",
    preco: 40.00,
    estoque: 7,
    icone: "📦"
  },
  {
    id: 5,
    nome: "Barra de Proteína",
    preco: 6.00,
    estoque: 18,
    icone: "🍫"
  },
  {
    id: 6,
    nome: "Chocolate",
    preco: 2.00,
    estoque: 22,
    icone: "🍫"
  }
];

/*
 * Não precisamos cadastrar aqui uma lista enorme de profissionais.
 * Para o protótipo, o nome é digitado no momento do consumo.
 *
 * Depois:
 * backend/API -> profissionais -> select de profissionais.
 *
 * Algumas movimentações pequenas servem apenas para a tela não ficar vazia.
 */
var movimentacoes = [
  {
    profissional: "Josy",
    produto: "Cápsula de Café",
    quantidade: 2,
    data: "15/07/2026",
    status: "Pago"
  },
  {
    profissional: "Elisangela",
    produto: "Cappuccino",
    quantidade: 1,
    data: "03/07/2026",
    status: "Pago"
  },
  {
    profissional: "Beatriz",
    produto: "Biscoito",
    quantidade: 5,
    data: "07/07/2026",
    status: "Pago"
  },
  {
    profissional: "Pedro",
    produto: "Barra de Proteína",
    quantidade: 5,
    data: "14/01/2026",
    status: "Pendente"
  }
];

var listaDeProdutos = document.getElementById("listaDeProdutos");
var listaMovimentacoes = document.getElementById("listaMovimentacoes");

var campoBusca = document.getElementById("campoBusca");
var filtroStatus = document.getElementById("filtroStatus");

var modalProduto = document.getElementById("modalProduto");
var modalConsumo = document.getElementById("modalConsumo");

var formProduto = document.getElementById("formProduto");
var formConsumo = document.getElementById("formConsumo");

var produtoConsumo = document.getElementById("produtoConsumo");


/* -----------------------------
   FORMATAÇÃO
----------------------------- */

function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


/* -----------------------------
   PRODUTOS
----------------------------- */

function classeDoEstoque(estoque) {
  if (estoque === 0) return "estoque-indisponivel";
  if (estoque <= 5) return "estoque-baixo";
  return "estoque-disponivel";
}


function textoDoEstoque(estoque) {
  if (estoque === 0) return "Sem estoque";
  if (estoque <= 5) return "Estoque baixo";
  return "Disponível";
}


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
          <span class="menu-produto">⋯</span>
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


function adicionarEventosDosBotoesDeConsumo() {

  var botoes = document.querySelectorAll(".botao-consumir");

  botoes.forEach(function (botao) {

    botao.addEventListener("click", function () {

      var nomeProduto = botao.getAttribute("data-produto");

      produtoConsumo.value = nomeProduto;

      abrirModal(modalConsumo);

    });

  });
}


/* -----------------------------
   FILTROS
----------------------------- */

function aplicarFiltros() {

  var texto = campoBusca.value.toLowerCase();
  var status = filtroStatus.value;

  var produtosFiltrados = produtos.filter(function (produto) {

    var bateComTexto =
      produto.nome.toLowerCase().includes(texto);

    var bateComStatus = true;

    if (status === "disponivel") {
      bateComStatus = produto.estoque > 5;
    }

    if (status === "baixo") {
      bateComStatus =
        produto.estoque > 0 && produto.estoque <= 5;
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

function atualizarResumo() {

  document.getElementById("totalProdutos").textContent =
    produtos.length;

  var totalItens = 0;
  var totalVendido = 0;

  for (var i = 0; i < movimentacoes.length; i++) {

    var movimentacao = movimentacoes[i];

    var produto = produtos.find(function (item) {
      return item.nome === movimentacao.produto;
    });

    if (produto) {
      totalItens += movimentacao.quantidade;
      totalVendido +=
        produto.preco * movimentacao.quantidade;
    }
  }

  document.getElementById("totalItens").textContent =
    totalItens;

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

function desenharMovimentacoes() {

  listaMovimentacoes.innerHTML = "";

  for (var i = 0; i < movimentacoes.length; i++) {

    var movimentacao = movimentacoes[i];

    var produto = produtos.find(function (item) {
      return item.nome === movimentacao.produto;
    });

    var valor = produto
      ? produto.preco * movimentacao.quantidade
      : 0;

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
    `;

    listaMovimentacoes.appendChild(linha);
  }
}


/* -----------------------------
   MODAIS
----------------------------- */

function abrirModal(modal) {
  modal.classList.add("aberto");
}


function fecharModal(modal) {
  modal.classList.remove("aberto");
}


document.querySelectorAll("[data-fechar]").forEach(function (botao) {

  botao.addEventListener("click", function () {

    var idModal = botao.getAttribute("data-fechar");

    fecharModal(document.getElementById(idModal));

  });

});


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


formProduto.addEventListener("submit", function (evento) {

  evento.preventDefault();

  var nome = document.getElementById("nomeProduto").value;
  var preco = Number(document.getElementById("precoProduto").value);
  var estoque = Number(document.getElementById("quantidadeProduto").value);

  var novoProduto = {
    id: produtos.length + 1,
    nome: nome,
    preco: preco,
    estoque: estoque,
    icone: "▣"
  };

  produtos.push(novoProduto);

  formProduto.reset();

  fecharModal(modalProduto);

  atualizarSelectProdutos();
  atualizarResumo();
  aplicarFiltros();

});


/* -----------------------------
   SELECT DE PRODUTOS
----------------------------- */

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
   REGISTRAR CONSUMO
----------------------------- */

document.getElementById("btnNovoConsumo")
  .addEventListener("click", function () {

    abrirModal(modalConsumo);

  });


formConsumo.addEventListener("submit", function (evento) {

  evento.preventDefault();

  var profissional =
    document.getElementById("profissionalConsumo").value;

  var produtoNome = produtoConsumo.value;

  var quantidade =
    Number(document.getElementById("quantidadeConsumo").value);

  var data =
    document.getElementById("dataConsumo").value;

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

  produto.estoque =
    Math.max(0, produto.estoque - quantidade);

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
   MENU LATERAL
----------------------------- */

var itensDoMenu =
  document.querySelectorAll(".menu-item");

itensDoMenu.forEach(function (item) {

  item.addEventListener("click", function () {

    itensDoMenu.forEach(function (i) {
      i.classList.remove("ativo");
    });

    item.classList.add("ativo");

    var pagina =
      item.getAttribute("data-pagina");

    if (pagina !== "conveniencia") {

      alert(
        'A página "' +
        pagina +
        '" não foi atribuída ainda.'
      );

    }

  });

});


/* -----------------------------
   INICIALIZAÇÃO
----------------------------- */

document.getElementById("dataConsumo").value =
  new Date().toISOString().split("T")[0];

atualizarSelectProdutos();
desenharProdutos(produtos);
desenharMovimentacoes();
atualizarResumo();
aplicarFiltros();
