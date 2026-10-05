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

  if (lista.length === 0) {
    listaDePagamentos.innerHTML =
      "<tr><td colspan=\"7\">Nenhum pagamento encontrado com esse filtro.</td></tr>";
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

  // o "﻿" (BOM) no começo é pro excel entender os acentos
  // (escrito assim porque o caractere invisível some fácil ao editar o arquivo)
  var arquivo = new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8" });

  var link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "pagamentos.csv";
  link.click();

  // libera o arquivo da memória depois que o download começou
  setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
});

// -------------------------------------------------------
// MENU LATERAL
// -------------------------------------------------------
var itensDoMenu = document.querySelectorAll(".menu-item");

// páginas que já existem e o caminho até elas (a partir desse financeiro.html)
// é só ir colocando aqui as próximas telas
var enderecosDasPaginas = {
  salas: "index.html"
};

itensDoMenu.forEach(function (item) {
  item.addEventListener("click", function () {

    var pagina = item.getAttribute("data-pagina");

    // já estamos no financeiro, então não faz nada
    if (pagina === "financeiros") return;

    // se a página existe, vai pra ela
    if (enderecosDasPaginas[pagina]) {
      window.location.href = enderecosDasPaginas[pagina];
      return;
    }

    // as outras ainda são só um aviso
    alert("A página \"" + pagina + "\" nao foi atribuida ainda");
  });
});

// desenha tudo assim que a página carrega
aplicarFiltros();
