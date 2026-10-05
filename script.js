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
   INICIALIZAÇÃO
----------------------------- */

document.getElementById("dataConsumo").value =
  new Date().toISOString().split("T")[0];

atualizarSelectProdutos();
desenharProdutos(produtos);
desenharMovimentacoes();
atualizarResumo();
aplicarFiltros();
