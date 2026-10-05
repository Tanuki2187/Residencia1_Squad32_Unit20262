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

  if (lista.length === 0) {
    listaDeSalas.innerHTML = "<p>Nenhuma sala encontrada com esse filtro.</p>";
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

// -------------------------------------------------------
// MENU LATERAL
// -------------------------------------------------------
var itensDoMenu = document.querySelectorAll(".menu-item");

// páginas que já existem e o caminho até elas (a partir desse index.html)
// é só ir colocando aqui as próximas telas (agenda.html, etc)
var enderecosDasPaginas = {
  financeiros: "financeiro.html"
};

itensDoMenu.forEach(function (item) {
  item.addEventListener("click", function () {

    var pagina = item.getAttribute("data-pagina");

    // já estamos em salas, então não faz nada
    if (pagina === "salas") return;

    // se a página existe, vai pra ela
    if (enderecosDasPaginas[pagina]) {
      window.location.href = enderecosDasPaginas[pagina];
      return;
    }

    // as outras ainda são só um aviso
    alert("A página \"" + pagina + "\" nao foi atribuida ainda");
  });
});

// desenha a lista assim que a página carrega
desenharSalas(salas);