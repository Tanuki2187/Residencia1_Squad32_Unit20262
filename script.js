/* Portal Attento — funções compartilhadas, dados demonstrativos e módulos por página. */
'use strict';
/*
 * ==========================================================
 * SCRIPT UNIFICADO
 * ==========================================================
 * Organização do arquivo:
 
    Compartilhados; 
    Sidebar e aparência; 
    Configurações; 
    Login; 
    Unidades; 
    Dashboard; 
    Salas; 
    Financeiro; Conveniência; Inicialização. 
 
  Cada módulo fica dentro da sua própria function (...)() para que
  as variáveis não briguem entre si, e só roda se a página tiver o
  elemento principal dela (senão sai com return).
 */
/* ==========================================================
  RECURSOS COMPARTILHADOS
========================================================== */

// Salas de referência compartilhadas por Unidades, Salas, Financeiro e Dashboard.
var salasIniciais = [
    { id: "01", nome: "Onda", unidade: "Unidade 1", status: "Ocupada",      profissional: "Dr. Carlos Silva",   horario: "08:00 - 12:00" },
    { id: "02", nome: "Areia", unidade: "Unidade 1", status: "Disponível",   profissional: "",                   horario: "Próxima: 14:00" },
    { id: "03", nome: "Brisa", unidade: "Unidade 1", status: "Reservada",    profissional: "Dra. Mariana Costa", horario: "10:00 - 14:00" },
    { id: "04", nome: "Duna", unidade: "Unidade 2", status: "Ocupada",      profissional: "Dr. João Pereira",   horario: "08:00 - 12:00" },
    { id: "05", nome: "Maré", unidade: "Unidade 2", status: "Disponível",   profissional: "",                   horario: "Próxima: 13:00" },
    { id: "06", nome: "Costa", unidade: "Unidade 2", status: "Indisponível", profissional: "",                   horario: "Manutenção" },
    { id: "07", nome: "Mar", unidade: "Unidade 1", status: "Disponível", profissional: "", horario: "" },
    { id: "08", nome: "Estrela", unidade: "Unidade 1", status: "Disponível", profissional: "", horario: "" }
 ];

// Pagamentos de exemplo associados às salas por identificador.
var pagamentosIniciais = [
    { profissional: "Dr. Carlos Silva",   salaId: "01", valor: 1200, vencimento: "10/09/2026", pagamento: "10/09/2026", status: "Pago" },
    { profissional: "Dra. Mariana Costa", salaId: "03", valor: 950,  vencimento: "15/09/2026", pagamento: "",           status: "Pendente" },
    { profissional: "Dr. Roberto Lima",   salaId: "04", valor: 1400, vencimento: "20/09/2026", pagamento: "18/09/2026", status: "Pago" },
    { profissional: "Dra. Ana Souza",     salaId: "06", valor: 1100, vencimento: "25/09/2026", pagamento: "",           status: "Pendente" },
    { profissional: "Dr. Felipe Alves",   salaId: "02", valor: 980,  vencimento: "28/09/2026", pagamento: "",           status: "Em atraso" }
  ];

// Catálogo inicial usado na Conveniência e nos indicadores do Dashboard.
var produtosIniciais = [
    { id: 1, nome: "Cápsula de Café",   preco: 2.00,  estoque: 38, icone: "☕" },
    { id: 2, nome: "Cappuccino",        preco: 5.00,  estoque: 24, icone: "☕" },
    { id: 3, nome: "Biscoito",          preco: 2.00,  estoque: 31, icone: "🍪" },
    { id: 4, nome: "Caixa de Café",     preco: 40.00, estoque: 7,  icone: "📦" },
    { id: 5, nome: "Barra de Proteína", preco: 6.00,  estoque: 18, icone: "🍫" },
    { id: 6, nome: "Chocolate",         preco: 2.00,  estoque: 22, icone: "🍫" }
  ];

//Consumos de exemplo que compõem o histórico inicial da Conveniência.
var consumosIniciais = [
    { profissional: "Josy",       produto: "Cápsula de Café",   quantidade: 2, data: "15/07/2026", status: "Pago" },
    { profissional: "Elisangela", produto: "Cappuccino",        quantidade: 1, data: "03/07/2026", status: "Pago" },
    { profissional: "Beatriz",    produto: "Biscoito",          quantidade: 5, data: "07/07/2026", status: "Pago" },
    { profissional: "Pedro",      produto: "Barra de Proteína", quantidade: 5, data: "14/01/2026", status: "Pendente" }
  ];

//Relação entre os identificadores internos e os nomes das unidades.
var nomesDasUnidades = { 'Unidade 1': 'Jardim Europa', 'Unidade 2': 'Horizonte Jardins' };

// 16/11/2026 — Localiza um elemento pelo identificador usado no HTML.
function porId(id) { return document.getElementById(id); }

// 16/11/2026 — Uniformiza textos para buscas sem distinção entre acentos e maiúsculas.
function normalizar(texto) { return String(texto || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

// 16/11/2026 — Obtém a data local no formato aceito pelos campos de data.
function hojeISO(data) {
  data = data || new Date();
  return data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0') + '-' + String(data.getDate()).padStart(2, '0');
}

// Converte datas brasileiras para o formato ano-mês-dia.
function paraISO(data) { return data && data.includes('/') ? data.split('/').reverse().join('-') : (data || ''); }

// Apresenta uma data no formato brasileiro.
function dataBR(data) { return data ? paraISO(data).split('-').reverse().join('/') : 'Sem data'; }

// Formata valores monetários em reais.
function formatarDinheiro(valor) { return Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}); }

// Protege textos inseridos em trechos de HTML gerados pelo JavaScript.
function escapar(texto) { return String(texto == null ? '' : texto).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Converte o identificador interno no nome exibido da unidade.
function nomeUnidade(unidade) { return nomesDasUnidades[unidade] || unidade; }

// Determina se o pagamento está pago, pendente ou em atraso.
function statusPagamento(pagamento, hoje) {
  if (pagamento.pagamento || pagamento.status === 'Pago') return 'Pago';
  return paraISO(pagamento.vencimento) < (hoje || hojeISO()) ? 'Em atraso' : 'Pendente';
}

// Seleciona registros no intervalo de datas, incluindo seus limites.
function filtrarPeriodo(lista, inicio, fim, campo) {
  if (inicio && fim && inicio > fim) throw new Error('A data inicial deve ser anterior ou igual à data final.');
  return lista.filter(item => { var data = paraISO(item[campo]); return (!inicio || data >= inicio) && (!fim || data <= fim); });
}

//Ordena uma cópia dos registros pelo critério escolhido.
function ordenarLista(lista, ordem, campos) {
  var descendente = ordem.endsWith('-desc');
  var campo = campos[ordem.replace('-desc', '')] || campos.nome;
  return lista.slice().sort((a, b) => {
    var va = typeof campo === 'function' ? campo(a) : a[campo];
    var vb = typeof campo === 'function' ? campo(b) : b[campo];
    var valor = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR', {numeric:true, sensitivity:'base'});
    return descendente ? -valor : valor;
  });
}

// Combina as salas iniciais com edições locais e migra os nomes antigos.
function carregarSalas() {
  return salasIniciais.map(inicial => {
    var sala = Object.assign({}, inicial);
    try {
      var salvo = JSON.parse(localStorage.getItem('attento.sala.' + inicial.id));
      if (salvo) {
        Object.assign(sala, salvo);
        // Atualiza os nomes da versão antiga uma única vez, preservando futuras edições.
        if (salvo._versaoNomes !== 1) {
          sala.nome = inicial.nome;
          sala._versaoNomes = 1;
          try { localStorage.setItem('attento.sala.' + inicial.id, JSON.stringify(sala)); } catch {}
        }
      }
    } catch { /* Usa o dado inicial. */ }
    sala.id = inicial.id;
    return sala;
  });
}

// 16/11/2026 — Cria os dados iniciais de produtos e consumos com preço histórico.
function criarDadosConveniencia() {
  var produtos = produtosIniciais.map(p => Object.assign({}, p));
  var movimentacoes = consumosIniciais.map((m, i) => {
    var produto = produtos.find(p => p.nome === m.produto);
    return Object.assign({}, m, {id:i + 1, produtoId:produto.id, precoUnitario:produto.preco, data:paraISO(m.data)});
  });
  return {produtos, movimentacoes, proximoProduto:7, proximoConsumo:5};
}

// 16/11/2026 — Relaciona cada pagamento à sala atual e calcula sua situação.
function obterPagamentos(salas, hoje) {
  return pagamentosIniciais.map(p => {
    var sala = salas.find(s => s.id === p.salaId);
    return Object.assign({}, p, {sala:sala ? sala.nome : 'Sala não encontrada', unidade:sala ? sala.unidade : '', status:statusPagamento(p, hoje)});
  });
}

// 16/11/2026 — Chave que identifica os dados temporários da aba no sessionStorage.
var chaveConveniencia = 'attento.conveniencia.v1';

// 16/11/2026 — Recupera os dados da sessão da aba ou usa os exemplos iniciais.
function carregarConveniencia() {
  try {
    var salvo = JSON.parse(sessionStorage.getItem(chaveConveniencia));
    if (salvo && salvo.versao === 1 && Array.isArray(salvo.produtos) && Array.isArray(salvo.movimentacoes) && Number.isInteger(salvo.proximoProduto) && Number.isInteger(salvo.proximoConsumo)) return salvo;
  } catch { /* Usa os dados iniciais se a sessão não estiver disponível. */ }
  return Object.assign(criarDadosConveniencia(), {versao:1});
}

// 16/11/2026 — Grava a Conveniência na sessão da aba e informa se a gravação funcionou.
function salvarConveniencia(dados) {
  try { sessionStorage.setItem(chaveConveniencia, JSON.stringify(Object.assign({}, dados, {versao:1}))); return true; }
  catch { return false; }
}

// 16/11/2026 — Aplica somente valores válidos dos filtros recebidos pela URL.
function aplicarParametrosFiltros(ids) {
  var parametros = new URLSearchParams(window.location.search);
  Object.entries(ids).forEach(([parametro, id]) => {
    var select = porId(id), valor = parametros.get(parametro);
    if (valor && Array.from(select.options).some(op=>op.value===valor)) select.value=valor;
  });
}

// 16/11/2026 — Mantém os filtros selecionados representados na URL da página.
function atualizarUrlFiltros(ids) {
  var url = new URL(window.location.href);
  Object.entries(ids).forEach(([parametro,id])=>{
    var valor=porId(id).value;
    if(valor==='todas'||valor==='todos')url.searchParams.delete(parametro);else url.searchParams.set(parametro,valor);
  });
  try { window.history.replaceState(null,'',url.href); } catch { /* Filtros continuam funcionando em arquivos locais. */ }
}

// 16/11/2026 — Exibe por alguns segundos a confirmação de uma ação.
function notificar(mensagem) {
  var caixa = porId('mensagensSistema');
  if (!caixa) return;
  clearTimeout(temporizadorMensagem);
  caixa.textContent = mensagem;
  temporizadorMensagem = setTimeout(() => { caixa.textContent = ''; }, 6500);
}

// 16/11/2026 — Mostra ou limpa uma mensagem de erro próxima ao formulário.
function mostrarErro(id, mensagem) {
  var elemento = porId(id);
  elemento.textContent = mensagem || '';
  elemento.hidden = !mensagem;
}

// 16/11/2026 — Abre um modal e guarda o controle ao qual o foco deve retornar.
function abrirDialogo(dialogo, origem) {
  dialogo._origem = origem || document.activeElement;
  dialogo._chaveFoco = dialogo._origem && dialogo._origem.dataset ? dialogo._origem.dataset.foco : null;
  if (typeof dialogo._preparar === 'function') dialogo._preparar();
  dialogo.showModal();
}

// 16/11/2026 — Padroniza o fechamento dos modais e o retorno de foco.
function iniciarDialogos() {
  document.querySelectorAll('dialog').forEach(dialogo => {
    dialogo.addEventListener('click', evento => {
      if (evento.target !== dialogo) return;
      var r = dialogo.getBoundingClientRect();
      if (evento.clientX < r.left || evento.clientX > r.right || evento.clientY < r.top || evento.clientY > r.bottom) solicitarFechamento(dialogo, 'cancelar');
    });
    dialogo.addEventListener('cancel', evento => { if(dialogo._podeFechar){evento.preventDefault();solicitarFechamento(dialogo,'cancelar');} });
    dialogo.addEventListener('close', () => {
      var destino = dialogo._origem;
      if ((!destino || !destino.isConnected) && dialogo._chaveFoco) {
        destino = Array.from(document.querySelectorAll('[data-foco]')).find(e => e.dataset.foco === dialogo._chaveFoco);
      }
      if (!destino || !destino.isConnected || destino.closest('[hidden]')) destino = porId('btnNovoProduto') || porId('btnUsuario') || document.querySelector('main h1');
      if (destino) destino.focus();
    });
  });
  document.addEventListener('click', evento => {
    var fechar = evento.target.closest('[data-fechar]');
    if (fechar) solicitarFechamento(porId(fechar.dataset.fechar),'cancelar');
  });
  [['btnConfiguracoes','dialogConfiguracoes'], ['btnUsuario','dialogUsuario']].forEach(par => {
    var botao = porId(par[0]);
    if (botao) botao.addEventListener('click', () => abrirDialogo(porId(par[1]), botao));
  });
}

// 16/11/2026 — Solicita confirmação antes de executar uma exclusão.
function confirmarAcao(mensagem, origem, opcoes) {
  var dialogo = porId('dialogConfirmacao');
  opcoes=opcoes||{};
  var titulo=porId('dialogConfirmacaoTitulo'),acao=dialogo.querySelector?dialogo.querySelector('button[value="confirmar"]'):null;
  if(titulo)titulo.textContent=opcoes.titulo||'Confirmar exclusão';
  if(acao)acao.textContent=opcoes.acao||'Excluir';
  porId('textoConfirmacao').textContent = mensagem;
  dialogo.returnValue = 'cancelar';
  return new Promise(resolve => {
    dialogo.addEventListener('close', () => resolve(dialogo.returnValue === 'confirmar'), {once:true});
    abrirDialogo(dialogo, origem);
  });
}

// 16/11/2026 — Cria os controles de restauração e descarte de uma exclusão.
function oferecerDesfazer(mensagem, desfazer, atualizar) {
  var linha = document.createElement('div');
  linha.className = 'acao-desfazer';
  var texto = document.createElement('span'); texto.textContent = mensagem;
  var botao = document.createElement('button'); botao.type = 'button'; botao.textContent = 'Desfazer exclusão';
  var dispensar = document.createElement('button'); dispensar.type = 'button'; dispensar.textContent = 'Dispensar'; dispensar.setAttribute('aria-label', 'Dispensar aviso: ' + mensagem);
  botao.addEventListener('click', () => {
    try { desfazer(); atualizar(); linha.remove(); notificar('Exclusão desfeita.'); (porId('btnNovoProduto') || porId('btnUsuario')).focus(); }
    catch (erro) { notificar(erro.message); }
  });
  dispensar.addEventListener('click', () => { linha.remove(); (porId('btnNovoProduto') || porId('btnUsuario')).focus(); });
  linha.append(texto, botao, dispensar);
  porId('acoesDesfazer').appendChild(linha);
  botao.focus();
}

// 16/11/2026 — Descreve o intervalo atualmente considerado nas consultas.
function mostrarPeriodo(lista, campo) {
  var inicio = porId('dataInicio').value, fim = porId('dataFim').value;
  var datas = lista.map(item => paraISO(item[campo])).filter(Boolean).sort();
  var texto = inicio || fim ? 'Período considerado: ' + (inicio ? dataBR(inicio) : 'sem limite inicial') + ' a ' + (fim ? dataBR(fim) : 'sem limite final') : 'Todo o período';
  if (!inicio && !fim && datas.length) texto += ': ' + dataBR(datas[0]) + ' a ' + dataBR(datas[datas.length - 1]);
  porId('periodoConsiderado').textContent = texto + (campo === 'vencimento' ? ' • por vencimento.' : ' • por data do consumo.');
}

// 16/11/2026 — Verifica se as datas inicial e final formam um intervalo válido.
function intervaloValido() {
  var valido = !porId('dataInicio').value || !porId('dataFim').value || porId('dataInicio').value <= porId('dataFim').value;
  mostrarErro('erroPeriodo', valido ? '' : 'A data inicial deve ser anterior ou igual à data final.');
  return valido;
}

// 16/11/2026 — Monta o texto com a quantidade filtrada e o total de registros.
function textoContagem(qtd, total, nome) { return qtd + ' de ' + total + ' ' + nome + ' encontrados.'; }

// 16/11/2026 — Atualiza o módulo quando seus campos de filtro são alterados.
function escutarFiltros(ids, atualizar) { ids.forEach(id => porId(id).addEventListener(id.startsWith('campo') || id.startsWith('busca') ? 'input' : 'change', atualizar)); }


// 16/11/2026 — Identifica o perfil local usado pelos cabeçalhos e pelo modal de usuário.
var chaveUsuario = 'attento.usuario.v1';

// 16/11/2026 — Valida e normaliza o nome e a foto antes da persistência local.
function validarPerfil(perfil) {
  var nome = String(perfil.nome || '').trim().replace(/\s+/g, ' ');
  if (!nome || nome.length > 80) throw new Error('Informe um nome com até 80 caracteres.');
  var foto = perfil.foto || '';
  if (typeof foto !== 'string' || foto.length > 400000 || (foto && !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(foto))) throw new Error('Selecione uma foto JPG, PNG ou WebP válida.');
  return {nome, foto};
}

// 16/11/2026 — Recupera um perfil válido ou utiliza o nome inicial do portal.
function carregarUsuario() {
  try { var perfil = JSON.parse(localStorage.getItem(chaveUsuario)); if (perfil) return validarPerfil(perfil); } catch {}
  return {nome:'João Gabriel', foto:''};
}

// 16/11/2026 — Calcula as iniciais apresentadas quando não há fotografia.
function iniciaisUsuario(nome) {
  return nome.trim().split(/\s+/).slice(0, 2).map(parte=>Array.from(parte)[0]).join('').toLocaleUpperCase('pt-BR');
}

// 16/11/2026 — Lê a preferência de tema; a ausência de escolha acompanha o dispositivo.
function carregarTema() {
  try { var tema=localStorage.getItem('temaPreferencia'); return ['light','dark'].includes(tema)?tema:'system'; } catch { return 'system'; }
}

// 16/11/2026 — Salva perfil e aparência juntos e tenta reverter uma gravação incompleta.
function salvarConfiguracoes(perfil, tema) {
  perfil=validarPerfil(perfil);
  if (!['light','dark','system'].includes(tema)) throw new Error('Selecione um tema válido.');
  var anteriorPerfil,anteriorTema,leituraConcluida=false;
  try {
    anteriorPerfil=localStorage.getItem(chaveUsuario);anteriorTema=localStorage.getItem('temaPreferencia');leituraConcluida=true;
    localStorage.setItem(chaveUsuario,JSON.stringify(perfil));
    localStorage.setItem('temaPreferencia',tema);
  } catch {
    if(leituraConcluida)try{
      if(anteriorPerfil===null)localStorage.removeItem(chaveUsuario);else localStorage.setItem(chaveUsuario,anteriorPerfil);
      if(anteriorTema===null)localStorage.removeItem('temaPreferencia');else localStorage.setItem('temaPreferencia',anteriorTema);
    }catch{}
    throw new Error('Não foi possível salvar as configurações. Verifique o armazenamento do navegador e tente novamente.');
  }
  return perfil;
}

// 16/11/2026 — Restaura somente a categoria escolhida, preservando perfil e preferências.
function restaurarDados(tipo) {
  if(!['salas','conveniencia'].includes(tipo))throw new Error('Categoria de restauração inválida.');
  var armazenamento=tipo==='salas'?localStorage:sessionStorage;
  var chaves=tipo==='salas'?salasIniciais.map(s=>'attento.sala.'+s.id):[chaveConveniencia];
  var anteriores=chaves.map(chave=>[chave,armazenamento.getItem(chave)]);
  try {chaves.forEach(chave=>armazenamento.removeItem(chave));}
  catch(erro){anteriores.forEach(([chave,valor])=>{try{if(valor!==null)armazenamento.setItem(chave,valor);}catch{}});throw erro;}
}

// 16/11/2026 — Monta o chamado local sem inventar envio, protocolo ou atendimento remoto.
function gerarTextoChamado(dados, usuario, data) {
  var assunto=String(dados.assunto||'').trim(),descricao=String(dados.descricao||'').trim();
  var categorias=['Erro de funcionamento','Dúvida de uso','Sugestão de melhoria','Outro'];
  if(!assunto||assunto.length>120)throw new Error('Informe um assunto com até 120 caracteres.');
  if(!descricao||descricao.length>3000)throw new Error('Descreva o problema em até 3.000 caracteres.');
  if(!categorias.includes(dados.categoria))throw new Error('Selecione uma categoria válida.');
  return ['ATTENTO — SOLICITAÇÃO DE SUPORTE TÉCNICO','Gerado em: '+(data||new Date()).toLocaleString('pt-BR'),'Solicitante: '+usuario.nome,'Categoria: '+dados.categoria,'Assunto: '+assunto,'','Descrição:',descricao,'','Arquivo gerado localmente. Encaminhe este arquivo à equipe de suporte.'].join('\r\n');
}

// 16/11/2026 — Solicita descarte de alterações antes de fechar um formulário modificado.
function confirmarDescarte() {
  var dialogo=porId('dialogDescartar');dialogo.returnValue='continuar';
  return new Promise(resolve=>{dialogo.addEventListener('close',()=>resolve(dialogo.returnValue==='descartar'),{once:true});abrirDialogo(dialogo);});
}

// 16/11/2026 — Respeita a proteção contra descarte nos botões, no fundo e na tecla Esc.
async function solicitarFechamento(dialogo, valor) {
  if(dialogo._solicitandoFechamento)return;
  dialogo._solicitandoFechamento=true;
  try {if(!dialogo._podeFechar||await dialogo._podeFechar())dialogo.close(valor||'cancelar');}
  finally{dialogo._solicitandoFechamento=false;}
}

/* ==========================================================
   16/11/2026 — SIDEBAR E APARÊNCIA
========================================================== */

// 16/11/2026 — Aplica o tema escolhido e controla o seletor de aparência.
function iniciarAparencia() {
  var botao=porId('btnTema'),menu=porId('menuTema');if(!botao)return;
  var sistema=window.matchMedia('(prefers-color-scheme: dark)'),preferencia=carregarTema();
  // 16/11/2026 — Aplica as cores do tema e marca a opção de aparência selecionada.
  // 16/11/2026 — Aplica a preferência compartilhada entre Configurações e o atalho da sidebar.
  function aplicar(){document.body.classList.toggle('dark',preferencia==='dark'||preferencia==='system'&&sistema.matches);document.querySelectorAll('.theme-option').forEach(op=>{op.classList.toggle('active',op.dataset.theme===preferencia);op.setAttribute('aria-pressed',String(op.dataset.theme===preferencia));});}
  // 16/11/2026 — Fecha o seletor de aparência e atualiza seu estado acessível.
  function fechar(){menu.hidden=true;botao.setAttribute('aria-expanded','false');}
  botao.addEventListener('click',()=>{menu.hidden=!menu.hidden;botao.setAttribute('aria-expanded',String(!menu.hidden));});
  document.querySelectorAll('.theme-option').forEach(op=>op.addEventListener('click',()=>{preferencia=op.dataset.theme;try{localStorage.setItem('temaPreferencia',preferencia);}catch{notificar('Tema aplicado. Não foi possível salvar a preferência.');}aplicar();fechar();botao.focus();}));
  document.addEventListener('click',evento=>{if(!evento.target.closest('.theme-selector'))fechar();});
  document.addEventListener('keydown',evento=>{if(evento.key==='Escape'&&!menu.hidden){fechar();botao.focus();}});
  sistema.addEventListener('change',()=>{if(preferencia==='system')aplicar();});
  document.addEventListener('attento:preferencias',()=>{preferencia=carregarTema();aplicar();});
  window.addEventListener('storage',()=>{preferencia=carregarTema();aplicar();});
  window.addEventListener('pageshow',()=>{preferencia=carregarTema();aplicar();});
  aplicar();
}

// 16/11/2026 — Controla o recolhimento da sidebar e o menu acessível no celular.
function iniciarSidebar() {
  var menu=porId('menuLateral'),botao=porId('btnRecolherMenu');if(!menu||!botao)return;
  var chave='attento.sidebar.recolhida',recolhida=window.matchMedia('(max-width: 900px)').matches;
  try{var salvo=localStorage.getItem(chave);if(salvo!==null)recolhida=salvo==='true';}catch{}
  // 16/11/2026 — Atualiza o estado visual e acessível da sidebar recolhida.
  function atualizar(){menu.classList.toggle('recolhida',recolhida);botao.setAttribute('aria-expanded',String(!recolhida));var rotulo=recolhida?'Expandir menu':'Recolher menu';botao.setAttribute('aria-label',rotulo);botao.title=rotulo;}
  botao.addEventListener('click',()=>{recolhida=!recolhida;atualizar();try{localStorage.setItem(chave,String(recolhida));}catch{}});atualizar();
  var pequeno=window.matchMedia('(max-width: 700px)'),aberto=false;
  var abrir=porId('btnMenuMovel'),fechar=porId('btnFecharMenuMovel'),fundo=porId('fundoMenuMovel');
  // 16/11/2026 — Atualiza o menu móvel, o fundo e os elementos que podem receber foco.
  function atualizarMovel(){
    if(!pequeno.matches)aberto=false;
    document.body.classList.toggle('menu-movel-aberto',pequeno.matches&&aberto);
    menu.inert=pequeno.matches&&!aberto;
    menu.setAttribute('aria-hidden',String(pequeno.matches&&!aberto));
    var principal=document.querySelector('main');if(principal)principal.inert=pequeno.matches&&aberto;
    if(abrir)abrir.setAttribute('aria-expanded',String(pequeno.matches&&aberto));
    if(fundo)fundo.hidden=!pequeno.matches||!aberto;
  }
  // 16/11/2026 — Fecha o menu móvel e devolve o foco ao botão que o abre.
  function fecharMovel(){aberto=false;atualizarMovel();if(abrir)abrir.focus();}
  if(abrir)abrir.addEventListener('click',()=>{aberto=true;atualizarMovel();if(fechar)fechar.focus();});
  if(fechar)fechar.addEventListener('click',fecharMovel);
  if(fundo)fundo.addEventListener('click',fecharMovel);
  document.addEventListener('keydown',evento=>{if(evento.key==='Escape'&&aberto&&!document.querySelector('dialog[open]'))fecharMovel();});
  menu.addEventListener('keydown',evento=>{
    if(evento.key!=='Tab'||!pequeno.matches||!aberto)return;
    var itens=Array.from(menu.querySelectorAll('a[href],button:not([disabled])')).filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));
    var primeiro=itens[0],ultimo=itens[itens.length-1];
    if(evento.shiftKey&&document.activeElement===primeiro){evento.preventDefault();ultimo.focus();}
    else if(!evento.shiftKey&&document.activeElement===ultimo){evento.preventDefault();primeiro.focus();}
  });
  pequeno.addEventListener('change',atualizarMovel);atualizarMovel();
}


/* ==========================================================
   16/11/2026 — CONFIGURAÇÕES
   Aparência, perfil, restauração e solicitação local de suporte.
========================================================== */

// 16/11/2026 — Atualiza nome, iniciais e foto em todos os pontos de identificação da página.
function atualizarUsuarioInterface() {
  var usuario=carregarUsuario();
  document.querySelectorAll('[data-nome-usuario]').forEach(e=>e.textContent=usuario.nome);
  document.querySelectorAll('[data-saudacao-usuario]').forEach(e=>e.textContent='Olá, '+usuario.nome+'!');
  document.querySelectorAll('.usuario-botao .avatar,[data-foto-usuario]').forEach(e=>{
    e.replaceChildren();
    if(usuario.foto){var imagem=document.createElement('img');imagem.src=usuario.foto;imagem.alt=e.hasAttribute('data-foto-usuario')?'Foto de '+usuario.nome:'';e.appendChild(imagem);}
    else e.textContent=iniciaisUsuario(usuario.nome);
  });
}

// 16/11/2026 — Prepara os quatro recursos do modal e mantém alterações pendentes protegidas.
function iniciarConfiguracoes() {
  var dialogo=porId('dialogConfiguracoes');if(!dialogo)return;
  var formulario=porId('formConfiguracoes'),foto='',snapshot='',fotoProcessando=false,sequenciaFoto=0;
  var suporte=porId('dialogSuporte'),formSuporte=porId('formSuporte'),snapshotSuporte='';

  // 16/11/2026 — Representa o preenchimento atual para identificar alterações não salvas.
  function estado(){return JSON.stringify({nome:porId('configNome').value,tema:porId('configTema').value,foto});}

  // 16/11/2026 — Mostra a prévia da fotografia ou as iniciais do nome em edição.
  function atualizarPrevia(){
    var previa=porId('configFotoPreview');previa.replaceChildren();
    if(foto){var img=document.createElement('img');img.src=foto;img.alt='Prévia da foto do usuário';previa.appendChild(img);}
    else previa.textContent=iniciaisUsuario(porId('configNome').value||'Usuário');
    porId('btnRemoverFoto').disabled=!foto;
  }

  // 16/11/2026 — Reabre Configurações com os valores persistidos, descartando rascunhos anteriores.
  function preparar(){
    var usuario=carregarUsuario();sequenciaFoto++;fotoProcessando=false;porId('btnSalvarConfiguracoes').disabled=false;
    formulario.reset();porId('configNome').value=usuario.nome;porId('configTema').value=carregarTema();foto=usuario.foto;
    mostrarErro('erroConfiguracoes','');porId('resultadoRestauracao').textContent='';atualizarPrevia();snapshot=estado();
  }
  dialogo._preparar=preparar;
  dialogo._podeFechar=()=>estado()===snapshot&&!fotoProcessando?true:confirmarDescarte();
  dialogo.addEventListener('close',()=>{sequenciaFoto++;fotoProcessando=false;});
  porId('configNome').addEventListener('input',atualizarPrevia);
  porId('btnRemoverFoto').addEventListener('click',()=>{sequenciaFoto++;fotoProcessando=false;porId('btnSalvarConfiguracoes').disabled=false;foto='';porId('configFoto').value='';atualizarPrevia();});

  // 16/11/2026 — Valida e reduz a imagem escolhida antes de armazená-la como foto de perfil.
  porId('configFoto').addEventListener('change',()=>{
    var arquivo=porId('configFoto').files[0];if(!arquivo)return;
    sequenciaFoto++;fotoProcessando=false;porId('btnSalvarConfiguracoes').disabled=false;
    mostrarErro('erroConfiguracoes','');
    if(!['image/jpeg','image/png','image/webp'].includes(arquivo.type)||arquivo.size>2*1024*1024){mostrarErro('erroConfiguracoes','Escolha uma imagem JPG, PNG ou WebP de até 2 MB.');porId('configFoto').value='';return;}
    var versao=++sequenciaFoto;fotoProcessando=true;porId('btnSalvarConfiguracoes').disabled=true;
    var url=URL.createObjectURL(arquivo),imagem=new Image();
    imagem.onload=()=>{
      try{
        if(versao!==sequenciaFoto||!dialogo.open)return;
        var escala=Math.min(1,256/Math.max(imagem.naturalWidth,imagem.naturalHeight));
        var canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(imagem.naturalWidth*escala));canvas.height=Math.max(1,Math.round(imagem.naturalHeight*escala));
        canvas.getContext('2d').drawImage(imagem,0,0,canvas.width,canvas.height);
        var novaFoto=canvas.toDataURL('image/webp',0.85);validarPerfil({nome:porId('configNome').value||'Usuário',foto:novaFoto});foto=novaFoto;atualizarPrevia();
      }catch{if(versao===sequenciaFoto)mostrarErro('erroConfiguracoes','Não foi possível processar a foto. Escolha outra imagem.');}
      finally{URL.revokeObjectURL(url);if(versao===sequenciaFoto){fotoProcessando=false;porId('btnSalvarConfiguracoes').disabled=false;}}
    };
    imagem.onerror=()=>{URL.revokeObjectURL(url);if(versao===sequenciaFoto){fotoProcessando=false;porId('btnSalvarConfiguracoes').disabled=false;mostrarErro('erroConfiguracoes','Não foi possível abrir essa imagem. Escolha outro arquivo.');}};
    imagem.src=url;
  });
  formulario.addEventListener('submit',evento=>{
    evento.preventDefault();if(fotoProcessando)return;
    try{salvarConfiguracoes({nome:porId('configNome').value,foto},porId('configTema').value);}
    catch(erro){mostrarErro('erroConfiguracoes',erro.message);return;}
    snapshot=estado();atualizarUsuarioInterface();document.dispatchEvent(new CustomEvent('attento:preferencias'));dialogo.close('salvo');notificar('Configurações salvas.');
  });

  // 16/11/2026 — Confirma a restauração isolada e recarrega os módulos com os dados iniciais.
  async function restaurar(tipo,origem){
    if(estado()!==snapshot||fotoProcessando){if(!await confirmarDescarte())return;preparar();}
    var descricao=tipo==='salas'?'Os nomes, unidades, status, profissionais e horários editados das salas serão substituídos pelos valores iniciais.':'Os produtos, estoques e consumos da sessão serão substituídos pelos valores iniciais.';
    if(!await confirmarAcao(descricao+' A página será recarregada.',origem,{titulo:'Restaurar '+(tipo==='salas'?'salas':'Conveniência'),acao:'Restaurar'}))return;
    try{restaurarDados(tipo);}catch{mostrarErro('erroConfiguracoes','Não foi possível restaurar os dados. Verifique o armazenamento do navegador e tente novamente.');return;}
    porId('resultadoRestauracao').textContent='Dados restaurados. Recarregando a página…';
    porId('btnRestaurarSalas').disabled=true;porId('btnRestaurarConveniencia').disabled=true;
    setTimeout(()=>window.location.reload(),700);
  }
  porId('btnRestaurarSalas').addEventListener('click',evento=>restaurar('salas',evento.currentTarget));
  porId('btnRestaurarConveniencia').addEventListener('click',evento=>restaurar('conveniencia',evento.currentTarget));

  // 16/11/2026 — Compara o rascunho do chamado para proteger o texto ainda não exportado.
  function estadoSuporte(){return JSON.stringify({assunto:porId('suporteAssunto').value,categoria:porId('suporteCategoria').value,descricao:porId('suporteDescricao').value});}
  suporte._preparar=()=>{formSuporte.reset();mostrarErro('erroSuporte','');porId('resultadoSuporte').textContent='';snapshotSuporte=estadoSuporte();};
  suporte._podeFechar=()=>estadoSuporte()===snapshotSuporte?true:confirmarDescarte();
  porId('btnAbrirChamado').addEventListener('click',evento=>abrirDialogo(suporte,evento.currentTarget));
  formSuporte.addEventListener('submit',evento=>{
    evento.preventDefault();var agora=new Date(),texto;
    try{texto=gerarTextoChamado({assunto:porId('suporteAssunto').value,categoria:porId('suporteCategoria').value,descricao:porId('suporteDescricao').value},carregarUsuario(),agora);}
    catch(erro){mostrarErro('erroSuporte',erro.message);return;}
    var url;
    try{
      url=URL.createObjectURL(new Blob(['\uFEFF'+texto],{type:'text/plain;charset=utf-8'}));
      var link=document.createElement('a');link.href=url;link.download='chamado-attento-'+hojeISO(agora)+'-'+String(agora.getHours()).padStart(2,'0')+String(agora.getMinutes()).padStart(2,'0')+String(agora.getSeconds()).padStart(2,'0')+'.txt';document.body.appendChild(link);link.click();link.remove();
    }catch{mostrarErro('erroSuporte','Não foi possível gerar o arquivo. Tente novamente.');return;}
    finally{if(url)setTimeout(()=>URL.revokeObjectURL(url),1000);}
    mostrarErro('erroSuporte','');snapshotSuporte=estadoSuporte();porId('resultadoSuporte').textContent='Download solicitado. Encaminhe o arquivo à equipe de suporte; ele não foi enviado automaticamente.';
  });
  atualizarUsuarioInterface();
  window.addEventListener('pageshow',atualizarUsuarioInterface);
  window.addEventListener('storage',atualizarUsuarioInterface);
}

/* ==========================================================
 LOGIN
========================================================== */

// Alterna a visibilidade da senha e abre o aviso de recuperação.
function iniciarLogin() {
  var botao=porId('btnMostrarSenha');if(!botao)return;
  botao.addEventListener('click',()=>{var senha=porId('senhaLogin'),mostrar=senha.type==='password';senha.type=mostrar?'text':'password';botao.textContent=mostrar?'Ocultar':'Mostrar';botao.setAttribute('aria-pressed',String(mostrar));botao.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha');});
  porId('recuperarSenha').addEventListener('click',evento=>{evento.preventDefault();abrirDialogo(porId('dialogRecuperacao'),evento.currentTarget);});
}


/* ==========================================================
  UNIDADES
========================================================== */

// 16/11/2026 — Carrega as contagens, a busca e a ordenação dos cards de unidades.
function iniciarUnidades() {
  var cards = Array.from(document.querySelectorAll('.unidade-card[data-unidade]'));
  if (!cards.length) return;
  var salas = carregarSalas();
  cards.forEach(card => {
    var lista = salas.filter(s => s.unidade === card.dataset.unidade);
    card.querySelector('[data-total-salas]').textContent = lista.length;
    [['ocupadas','Ocupada'], ['disponiveis','Disponível'], ['reservadas','Reservada'], ['indisponiveis','Indisponível']].forEach(par => {card.querySelector('[data-salas-' + par[0] + ']').textContent = lista.filter(s => s.status === par[1]).length;});
  });
  // 16/11/2026 — Atualiza a ordem, a visibilidade e a contagem das unidades.
  function atualizar() {
    var lista = cards.filter(card => normalizar(card.querySelector('h2').textContent + ' ' + card.querySelector('.unidade-endereco').textContent).includes(normalizar(porId('buscaUnidades').value)));
    cards.forEach(card => { card.hidden = !lista.includes(card); });
    lista = ordenarLista(lista, porId('ordenacaoUnidades').value, {nome:c=>c.querySelector('h2').textContent, salas:c=>Number(c.querySelector('[data-total-salas]').textContent)});
    lista.forEach(card => card.parentNode.appendChild(card));
    porId('contadorUnidades').textContent = textoContagem(lista.length, cards.length, 'unidades');
    porId('vazioUnidades').hidden = lista.length > 0;
  }
  escutarFiltros(['buscaUnidades','ordenacaoUnidades'], atualizar);
  porId('limparUnidades').addEventListener('click', () => { porId('buscaUnidades').value = ''; porId('ordenacaoUnidades').value = 'nome'; atualizar(); });
  atualizar();
}


/* ==========================================================
   16/11/2026 — DASHBOARD
========================================================== */

// 16/11/2026 — Calcula os indicadores do dashboard a partir das fontes compartilhadas.
function resumirOperacao(salas, pagamentos, conveniencia) {
  return {
    total:salas.length,
    ocupadas:salas.filter(s=>s.status==='Ocupada').length,
    disponiveis:salas.filter(s=>s.status==='Disponível').length,
    reservadas:salas.filter(s=>s.status==='Reservada').length,
    indisponiveis:salas.filter(s=>s.status==='Indisponível').length,
    recebido:pagamentos.filter(p=>p.status==='Pago').reduce((s,p)=>s+p.valor,0),
    pendentes:pagamentos.filter(p=>p.status!=='Pago').length,
    atrasados:pagamentos.filter(p=>p.status==='Em atraso').length,
    estoqueBaixo:conveniencia.produtos.filter(p=>p.estoque>0&&p.estoque<=5).length,
    semEstoque:conveniencia.produtos.filter(p=>p.estoque===0).length
  };
}

// 16/11/2026 — Renderiza os indicadores e listas do painel usando dados compartilhados.
function iniciarDashboard() {
  if (!porId('agendaDashboard')) return;
  // 16/11/2026 — Recalcula os indicadores e reconstrói as listas do dashboard.
  function atualizar() {
    var salas=carregarSalas(),pagamentos=obterPagamentos(salas),conveniencia=carregarConveniencia();
    var resumo=resumirOperacao(salas,pagamentos,conveniencia);
    [['kpiTotalSalas',resumo.total],['kpiOcupadas',resumo.ocupadas],['kpiDisponiveis',resumo.disponiveis],['kpiRecebido',formatarDinheiro(resumo.recebido)],['kpiPendentes',resumo.pendentes]].forEach(par=>porId(par[0]).textContent=par[1]);
    porId('kpiOutrosStatus').textContent=resumo.reservadas+' reservadas • '+resumo.indisponiveis+' indisponíveis';
    porId('kpiOcupacao').textContent=(resumo.total?Math.round(resumo.ocupadas/resumo.total*100):0)+'% do total';
    porId('kpiAtrasados').textContent=resumo.atrasados+' em atraso';
    var agenda=porId('agendaDashboard');agenda.replaceChildren();
    ordenarLista(salas,'unidade',{unidade:s=>nomeUnidade(s.unidade)+' '+s.nome}).forEach(sala=>{
      var item=document.createElement('div');item.className='agenda-item';
      item.innerHTML=`<span class="room fw-bold">${escapar(sala.nome)}</span><span class="unit">${escapar(nomeUnidade(sala.unidade))}</span><span class="status-pill status-${normalizar(sala.status)}">${escapar(sala.status)}</span><span class="time">${escapar(sala.horario||'Sem horário definido')}</span><span class="doctor">${escapar(sala.profissional||'Sem profissional')}</span>`;
      agenda.appendChild(item);
    });
    var lista=porId('pendenciasDashboard');lista.replaceChildren();
    [
      [resumo.atrasados+' pagamentos em atraso','Vencidos e ainda não quitados','financeiro.html?status=Em%20atraso'],
      [resumo.disponiveis+' salas disponíveis','Disponibilidade nas duas unidades','salas.html?status=Dispon%C3%ADvel'],
      [resumo.estoqueBaixo+' produtos com estoque baixo','Entre 1 e 5 unidades no estoque','conveniencia.html?estoque=baixo'],
      [resumo.semEstoque+' produtos sem estoque','Itens indisponíveis para consumo','conveniencia.html?estoque=indisponivel']
    ].forEach(([titulo,descricao,href])=>{
      var item=document.createElement('a');item.className='pendencia-item acompanhamento-link';item.href=href;
      item.innerHTML=`<div class="p-content"><span class="p-title">${escapar(titulo)}</span><span class="p-desc">${escapar(descricao)}</span></div><span aria-hidden="true">→</span>`;
      lista.appendChild(item);
    });
  }
  atualizar();
  window.addEventListener('pageshow',atualizar);
  window.addEventListener('storage',atualizar);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)atualizar();});
}


/* ==========================================================
   16/11/2026 — SALAS
========================================================== */

// 16/11/2026 — Monta os cards, aplica filtros e coordena a edição persistida das salas.
function iniciarSalas() {
  if (!porId('listaDeSalas')) return;
  var salas = carregarSalas();
  aplicarParametrosFiltros({unidade:'filtroUnidade',status:'filtroStatus'});
  var formulario = porId('formEditarSalas'), campos = formulario.elements, dialogo = porId('dialogEditarSalas');
  ['unidade','status'].forEach(nome => { Array.from(porId(nome === 'unidade' ? 'filtroUnidade' : 'filtroStatus').options).slice(1).forEach(op => campos[nome].add(op.cloneNode(true))); });
  // 16/11/2026 — Identifica a sala escolhida no formulário de edição.
  function selecionada() { return salas.find(s => s.id === campos.sala.value); }
  // 16/11/2026 — Carrega status, profissional e horário da sala escolhida e limpa os erros.
  function preencherDados() { var sala = selecionada(); ['status','profissional','horario'].forEach(k => campos[k].value = sala ? sala[k] : ''); mostrarErro('erroEditarSalas', ''); }
  // 16/11/2026 — Lista em "Nome da sala" apenas as salas da unidade escolhida, mantendo a sala atual quando possível.
  function listarSalasDaUnidade() {
    var atual = campos.sala.value, lista = ordenarLista(salas.filter(s => s.unidade === campos.unidade.value), 'nome', {nome:'nome'});
    campos.sala.replaceChildren();
    lista.forEach(s => campos.sala.add(new Option(s.nome, s.id)));
    if (!lista.length) { var vazio = new Option('Nenhuma sala nesta unidade', ''); vazio.disabled = true; campos.sala.add(vazio); }
    campos.sala.value = lista.some(s => s.id === atual) ? atual : (lista[0] ? lista[0].id : '');
    preencherDados();
  }
  // 16/11/2026 — Abre o formulário já na unidade filtrada na página, quando houver uma.
  function preencher() { if (porId('filtroUnidade').value !== 'todas') campos.unidade.value = porId('filtroUnidade').value; listarSalasDaUnidade(); }
  // 16/11/2026 — Atualiza os cards e a contagem das salas conforme os filtros.
  function atualizar() {
    atualizarUrlFiltros({unidade:'filtroUnidade',status:'filtroStatus'});
    var lista = salas.filter(s => normalizar(s.nome).includes(normalizar(porId('campoBusca').value)) && (porId('filtroUnidade').value === 'todas' || s.unidade === porId('filtroUnidade').value) && (porId('filtroStatus').value === 'todos' || s.status === porId('filtroStatus').value));
    lista = ordenarLista(lista, porId('ordenacao').value, {nome:'nome',unidade:s=>nomeUnidade(s.unidade),status:'status'});
    var grade = porId('listaDeSalas'); grade.replaceChildren();
    lista.forEach(sala => {
      var frag = porId('modeloCard').content.cloneNode(true);
      frag.querySelector('.card-nome').textContent = sala.nome;
      frag.querySelector('.card-unidade').textContent = nomeUnidade(sala.unidade);
      frag.querySelector('.card-status').className = 'card-status status-' + normalizar(sala.status);
      frag.querySelector('.texto-status').textContent = sala.status;
      frag.querySelector('.card-profissional').textContent = sala.profissional || 'Sem profissional';
      frag.querySelector('.card-horario').textContent = sala.horario || 'Sem horário definido';
      frag.querySelector('.card-menu').remove();
      var detalhes = frag.querySelector('.botao-detalhes'); detalhes.dataset.foco = 'sala-' + sala.id;
      detalhes.addEventListener('click', () => {
        porId('textoDetalhesSala').textContent = [sala.nome,nomeUnidade(sala.unidade),sala.status,sala.profissional || 'Sem profissional',sala.horario || 'Sem horário definido'].join('\n');
        abrirDialogo(porId('dialogDetalhesSala'), detalhes);
      });
      grade.appendChild(frag);
    });
    if (!lista.length) grade.appendChild(porId('modeloVazio').content.cloneNode(true));
    porId('contadorResultados').textContent = textoContagem(lista.length, salas.length, 'salas');
  }
  porId('btnEditarSalas').addEventListener('click', evento => { preencher(); abrirDialogo(dialogo, evento.currentTarget); });
  campos.unidade.addEventListener('change', listarSalasDaUnidade);
  campos.sala.addEventListener('change', preencherDados);
  porId('btnCancelarEdicaoSala').addEventListener('click', () => dialogo.close('cancelar'));
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    var sala = selecionada();
    if (!sala) { mostrarErro('erroEditarSalas', 'Escolha uma sala da unidade selecionada.'); return; }
    // 16/11/2026 — Nome e unidade não são editados aqui; são mantidos para preservar o registro da sala.
    var alteracoes = {nome: sala.nome, unidade: sala.unidade, _versaoNomes: 1};
    ['status','profissional','horario'].forEach(k => alteracoes[k] = campos[k].value.trim());
    try { localStorage.setItem('attento.sala.' + sala.id, JSON.stringify(alteracoes)); }
    catch { mostrarErro('erroEditarSalas', 'Não foi possível salvar. Verifique se o navegador permite o armazenamento local e tente novamente.'); return; }
    Object.assign(sala, alteracoes);
    atualizar(); dialogo.close(); notificar('Sala atualizada.');
  });
  escutarFiltros(['campoBusca','filtroUnidade','filtroStatus','ordenacao'], atualizar);
  porId('btnLimparFiltros').addEventListener('click', () => {porId('campoBusca').value='';porId('filtroUnidade').value='todas';porId('filtroStatus').value='todos';porId('ordenacao').value='nome';atualizar();});
  atualizar();
}


/* ==========================================================
   16/11/2026 — FINANCEIRO
========================================================== */

// 16/11/2026 — Filtra pagamentos, atualiza indicadores e exporta os resultados em CSV.
function iniciarFinanceiro() {
  if (!porId('listaDePagamentos')) return;
  var naTela = [];
  aplicarParametrosFiltros({status:'filtroStatus',unidade:'filtroUnidade'});
  // 16/11/2026 — Atualiza pagamentos, totais, período e contagem de resultados.
  function atualizar() {
    if (!intervaloValido()) { porId('btnExportar').disabled = true; return; }
    porId('btnExportar').disabled = false;
    atualizarUrlFiltros({status:'filtroStatus',unidade:'filtroUnidade'});
    var pagamentos = obterPagamentos(carregarSalas());
    var lista = filtrarPeriodo(pagamentos, porId('dataInicio').value, porId('dataFim').value, 'vencimento');
    lista = lista.filter(p => normalizar(p.profissional).includes(normalizar(porId('campoBusca').value)) && (porId('filtroUnidade').value === 'todas' || p.unidade === porId('filtroUnidade').value) && (porId('filtroStatus').value === 'todos' || p.status === porId('filtroStatus').value));
    naTela = ordenarLista(lista, porId('ordenacao').value, {nome:'profissional', data:p=>paraISO(p.vencimento),valor:'valor'});
    var corpo = porId('listaDePagamentos'); corpo.replaceChildren();
    naTela.forEach(p => {
      var frag = porId('modeloLinha').content.cloneNode(true);
      ['profissional','unidade','sala','valor','vencimento','pagamento'].forEach(k => {frag.querySelector('.col-' + k).textContent = k === 'valor' ? formatarDinheiro(p[k]) : k === 'unidade' ? nomeUnidade(p[k]) : p[k] || '—';});
      frag.querySelector('.linha-status').className = 'linha-status ' + ({'Pago':'status-pago','Pendente':'status-pendente','Em atraso':'status-atraso'}[p.status]);
      frag.querySelector('.texto-status').textContent = p.status; corpo.appendChild(frag);
    });
    if (!naTela.length) corpo.appendChild(porId('modeloVazio').content.cloneNode(true));
    var recebido = naTela.filter(p=>p.status==='Pago').reduce((s,p)=>s+p.valor,0), total = naTela.reduce((s,p)=>s+p.valor,0);
    porId('valorRecebido').textContent = formatarDinheiro(recebido); porId('valorPendente').textContent = formatarDinheiro(total-recebido); porId('valorPrevisto').textContent = formatarDinheiro(total);
    porId('contadorResultados').textContent = textoContagem(naTela.length, pagamentos.length, 'pagamentos'); mostrarPeriodo(pagamentos,'vencimento');
  }
  escutarFiltros(['campoBusca','filtroUnidade','filtroStatus','ordenacao','dataInicio','dataFim'], atualizar);
  porId('btnLimparFiltros').addEventListener('click', () => { ['campoBusca','dataInicio','dataFim'].forEach(id=>porId(id).value='');porId('filtroUnidade').value='todas';porId('filtroStatus').value='todos';porId('ordenacao').value='data';atualizar(); });
  porId('btnExportar').addEventListener('click', () => {
    var linhas = [['Profissional','Unidade','Sala','Valor','Vencimento','Pagamento','Status']].concat(naTela.map(p=>[p.profissional,nomeUnidade(p.unidade),p.sala,p.valor.toFixed(2).replace('.',','),p.vencimento,p.pagamento || '',p.status]));
    var conteudo = '\uFEFF' + linhas.map(l=>l.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
    var url = URL.createObjectURL(new Blob([conteudo], {type:'text/csv;charset=utf-8'})); var link=document.createElement('a');link.href=url;link.download='pagamentos.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notificar('Exportação iniciada com os pagamentos filtrados.');
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
  atualizar();
}


/* ==========================================================
   16/11/2026 — CONVENIÊNCIA
========================================================== */

// 16/11/2026 — Valida o consumo, reduz o estoque e guarda o preço praticado.
function registrarConsumo(dados, entrada) {
  var produto = dados.produtos.find(p => p.id === Number(entrada.produtoId));
  if (!produto) throw new Error('Selecione um produto disponível no catálogo.');
  if (!entrada.profissional.trim()) throw new Error('Informe o nome do profissional.');
  if (!Number.isInteger(entrada.quantidade) || entrada.quantidade < 1) throw new Error('Informe uma quantidade inteira maior que zero.');
  if (entrada.quantidade > produto.estoque) throw new Error('Estoque disponível: ' + produto.estoque + '. Informe até essa quantidade.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entrada.data)) throw new Error('Informe a data do consumo.');
  var consumo = {id:dados.proximoConsumo++, profissional:entrada.profissional.trim(), produtoId:produto.id, produto:produto.nome, quantidade:entrada.quantidade, precoUnitario:produto.preco, data:entrada.data, status:'Pendente'};
  produto.estoque -= entrada.quantidade;
  dados.movimentacoes.unshift(consumo);
  return consumo;
}

// 16/11/2026 — Remove um produto sem apagar o histórico e prepara a restauração.
function excluirProduto(dados, id) {
  var indice = dados.produtos.findIndex(p => p.id === id);
  if (indice < 0) return null;
  var produto = dados.produtos.splice(indice, 1)[0];
  return function () { dados.produtos.splice(Math.min(indice, dados.produtos.length), 0, produto); };
}

// 16/11/2026 — Remove um consumo, recompõe o estoque e prepara a restauração validada.
function excluirConsumo(dados, id) {
  var indice = dados.movimentacoes.findIndex(m => m.id === id);
  if (indice < 0) return null;
  var consumo = dados.movimentacoes.splice(indice, 1)[0];
  var produto = dados.produtos.find(p => p.id === consumo.produtoId);
  if (produto) produto.estoque += consumo.quantidade;
  return function () {
    if (produto) {
      if (!dados.produtos.includes(produto)) throw new Error('Restaure primeiro o produto excluído para desfazer este consumo.');
      if (produto.estoque < consumo.quantidade) throw new Error('Não há estoque suficiente para restaurar este consumo.');
      produto.estoque -= consumo.quantidade;
    }
    dados.movimentacoes.splice(Math.min(indice, dados.movimentacoes.length), 0, consumo);
  };
}

/* Mensagens, diálogos nativos e retorno de foco. */
var temporizadorMensagem;

// 16/11/2026 — Coordena o catálogo, os consumos, os filtros e as exclusões reversíveis.
function iniciarConveniencia() {
  if (!porId('listaDeProdutos')) return;
  var dados = carregarConveniencia();
  aplicarParametrosFiltros({estoque:'filtroStatus'});
  // 16/11/2026 — Atualiza o seletor de produtos com o estoque disponível.
  function atualizarSelect() {
    var select=porId('produtoConsumo'), antes=select.value;select.replaceChildren();
    dados.produtos.forEach(p=>select.add(new Option(p.nome+' — '+p.estoque+' un.',String(p.id))));
    if (dados.produtos.some(p=>String(p.id)===antes)) select.value=antes;
  }
  // 16/11/2026 — Prepara o formulário de consumo e seleciona o produto de origem.
  function abrirConsumo(id, origem) {
    porId('formConsumo').reset();atualizarSelect();
    if (id) porId('produtoConsumo').value=String(id);
    porId('dataConsumo').value=hojeISO();mostrarErro('erroConsumo','');abrirDialogo(porId('modalConsumo'),origem);
  }
  // 16/11/2026 — Renderiza os produtos conforme busca, estoque e ordenação.
  function desenharProdutos() {
    atualizarUrlFiltros({estoque:'filtroStatus'});
    var lista=dados.produtos.filter(p=>{
      var filtro=porId('filtroStatus').value;
      return normalizar(p.nome).includes(normalizar(porId('campoBusca').value)) && (filtro==='todos'||filtro==='disponivel'&&p.estoque>5||filtro==='baixo'&&p.estoque>0&&p.estoque<=5||filtro==='indisponivel'&&p.estoque===0);
    });
    lista=ordenarLista(lista,porId('ordenacao').value,{nome:'nome',preco:'preco',estoque:'estoque'});
    var grade=porId('listaDeProdutos');grade.replaceChildren();
    lista.forEach(p=>{
      var card=document.createElement('div');card.className='card-produto';
      var status=p.estoque===0?'Sem estoque':p.estoque<=5?'Estoque baixo':'Disponível';var classe=p.estoque===0?'estoque-indisponivel':p.estoque<=5?'estoque-baixo':'estoque-disponivel';
      card.innerHTML=`<div class="produto-imagem" aria-hidden="true">${escapar(p.icone)}</div><div class="produto-informacoes"><div class="produto-topo"><h3>${escapar(p.nome)}</h3><div class="menu-produto-container"><button type="button" class="btn-menu-produto" aria-label="Opções de ${escapar(p.nome)}" aria-expanded="false" data-foco="produto-${p.id}">⋮</button><div class="dropdown-produto"><button type="button" class="opcao-editar">Editar</button><button type="button" class="opcao-excluir">Excluir</button></div></div></div><p class="produto-preco">${formatarDinheiro(p.preco)}</p><div class="produto-estoque"><span class="${classe}">${status}</span><span class="quantidade-estoque">${p.estoque} un.</span></div><button type="button" class="botao-consumir" data-foco="consumir-${p.id}" ${p.estoque===0?'disabled':''}>Registrar consumo</button></div>`;
      var menu=card.querySelector('.btn-menu-produto'),dropdown=card.querySelector('.dropdown-produto');
      menu.addEventListener('click',()=>{var aberto=dropdown.classList.contains('aberto');fecharMenusProdutos();dropdown.classList.toggle('aberto',!aberto);menu.setAttribute('aria-expanded',String(!aberto));});
      card.querySelector('.opcao-editar').addEventListener('click',()=>{
        fecharMenusProdutos();porId('editIdProduto').value=p.id;porId('editNomeProduto').value=p.nome;porId('editPrecoProduto').value=p.preco;porId('editQuantidadeProduto').value=p.estoque;mostrarErro('erroEditarProduto','');abrirDialogo(porId('modalEditarProduto'),menu);
      });
      card.querySelector('.opcao-excluir').addEventListener('click',async()=>{
        fecharMenusProdutos();if (!await confirmarAcao('Excluir o produto “'+p.nome+'”? Os consumos anteriores serão preservados.',menu)) return;
        var desfazer=excluirProduto(dados,p.id);if(!desfazer)return;atualizar();notificar('Produto excluído. Você pode desfazer abaixo.');oferecerDesfazer('Produto excluído: '+p.nome,desfazer,atualizar);
      });
      var consumir=card.querySelector('.botao-consumir');consumir.addEventListener('click',()=>abrirConsumo(p.id,consumir));grade.appendChild(card);
    });
    if(!lista.length){var vazio=document.createElement('p');vazio.textContent='Nenhum produto encontrado.';grade.appendChild(vazio);}
    porId('contadorProdutos').textContent=textoContagem(lista.length,dados.produtos.length,'produtos');
  }
  // 16/11/2026 — Renderiza os consumos e recalcula os totais do período escolhido.
  function desenharConsumos() {
    if(!intervaloValido()) return;
    var lista=filtrarPeriodo(dados.movimentacoes,porId('dataInicio').value,porId('dataFim').value,'data');
    lista=ordenarLista(lista,porId('ordenacaoConsumos').value,{data:'data',valor:m=>m.precoUnitario*m.quantidade});
    var corpo=porId('listaMovimentacoes');corpo.replaceChildren();
    lista.forEach(m=>{
      var linha=document.createElement('tr');linha.innerHTML=`<td>${escapar(m.profissional)}</td><td>${escapar(m.produto)}</td><td>${m.quantidade}</td><td>${dataBR(m.data)}</td><td>${formatarDinheiro(m.precoUnitario*m.quantidade)}</td><td><span class="status ${m.status==='Pago'?'pago':'pendente'}">${m.status}</span></td><td><button type="button" class="btn-excluir" data-foco="consumo-${m.id}" aria-label="Excluir consumo de ${escapar(m.profissional)}">Excluir</button></td>`;
      var excluir=linha.querySelector('.btn-excluir');excluir.addEventListener('click',async()=>{
        if(!await confirmarAcao('Excluir o consumo de '+m.quantidade+' × '+m.produto+' registrado para '+m.profissional+'?',excluir))return;
        var desfazer=excluirConsumo(dados,m.id);if(!desfazer)return;atualizar();notificar('Consumo excluído. Você pode desfazer abaixo.');oferecerDesfazer('Consumo excluído: '+m.produto+' — '+m.profissional,desfazer,atualizar);
      });corpo.appendChild(linha);
    });
    if(!lista.length){var linha=document.createElement('tr');linha.innerHTML='<td colspan="7">Nenhum consumo encontrado neste período.</td>';corpo.appendChild(linha);}
    porId('totalItens').textContent=lista.reduce((s,m)=>s+m.quantidade,0);porId('totalVendido').textContent=formatarDinheiro(lista.reduce((s,m)=>s+m.quantidade*m.precoUnitario,0));porId('contadorConsumos').textContent=textoContagem(lista.length,dados.movimentacoes.length,'consumos');mostrarPeriodo(dados.movimentacoes,'data');
  }
  // 16/11/2026 — Persiste os dados da aba e atualiza catálogo, estoque e consumos.
  function atualizar() {
    salvarConveniencia(dados);
    atualizarSelect();desenharProdutos();desenharConsumos();
    porId('totalProdutos').textContent=dados.produtos.length;porId('estoqueBaixo').textContent=dados.produtos.filter(p=>p.estoque>0&&p.estoque<=5).length;
  }
  // 16/11/2026 — Valida nome, preço, estoque e duplicidade de um produto.
  function validarProduto(nome,preco,estoque,id) {
    if(!nome.trim())return 'Informe o nome do produto.';
    if(!Number.isFinite(preco)||preco<0)return 'Informe um preço válido, maior ou igual a zero.';
    if(!Number.isInteger(estoque)||estoque<0)return 'Informe um estoque inteiro maior ou igual a zero.';
    if(dados.produtos.some(p=>p.id!==id&&normalizar(p.nome)===normalizar(nome)))return 'Já existe um produto com esse nome.';
    return '';
  }
  porId('btnNovoProduto').addEventListener('click',evento=>{porId('formProduto').reset();mostrarErro('erroProduto','');abrirDialogo(porId('modalProduto'),evento.currentTarget);});
  porId('formProduto').addEventListener('submit',evento=>{
    evento.preventDefault();var nome=porId('nomeProduto').value.trim(),preco=Number(porId('precoProduto').value),estoque=Number(porId('quantidadeProduto').value),erro=validarProduto(nome,preco,estoque);
    if(erro){mostrarErro('erroProduto',erro);return;}
    dados.produtos.push({id:dados.proximoProduto++,nome,preco,estoque,icone:'▣'});atualizar();porId('modalProduto').close();notificar('Produto cadastrado.');
  });
  porId('formEditarProduto').addEventListener('submit',evento=>{
    evento.preventDefault();var id=Number(porId('editIdProduto').value),nome=porId('editNomeProduto').value.trim(),preco=Number(porId('editPrecoProduto').value),estoque=Number(porId('editQuantidadeProduto').value),erro=validarProduto(nome,preco,estoque,id);
    if(erro){mostrarErro('erroEditarProduto',erro);return;}
    var produto=dados.produtos.find(p=>p.id===id);if(!produto){mostrarErro('erroEditarProduto','Produto não encontrado.');return;}
    Object.assign(produto,{nome,preco,estoque});atualizar();porId('modalEditarProduto').close();notificar('Produto atualizado.');
  });
  porId('btnNovoConsumo').addEventListener('click',evento=>abrirConsumo(null,evento.currentTarget));
  porId('formConsumo').addEventListener('submit',evento=>{
    evento.preventDefault();try{registrarConsumo(dados,{profissional:porId('profissionalConsumo').value,produtoId:porId('produtoConsumo').value,quantidade:Number(porId('quantidadeConsumo').value),data:porId('dataConsumo').value});}
    catch(erro){mostrarErro('erroConsumo',erro.message);return;}
    atualizar();porId('modalConsumo').close();notificar('Consumo registrado.');
  });
  escutarFiltros(['campoBusca','filtroStatus','ordenacao'],desenharProdutos);
  escutarFiltros(['dataInicio','dataFim','ordenacaoConsumos'],desenharConsumos);
  porId('btnLimparFiltros').addEventListener('click',()=>{porId('campoBusca').value='';porId('filtroStatus').value='todos';porId('ordenacao').value='nome';desenharProdutos();});
  porId('btnLimparPeriodo').addEventListener('click',()=>{porId('dataInicio').value='';porId('dataFim').value='';porId('ordenacaoConsumos').value='data-desc';desenharConsumos();});
  // 16/11/2026 — Fecha os menus de ações e atualiza seu estado acessível.
  function fecharMenusProdutos(){document.querySelectorAll('.dropdown-produto.aberto').forEach(d=>d.classList.remove('aberto'));document.querySelectorAll('.btn-menu-produto').forEach(b=>b.setAttribute('aria-expanded','false'));}
  document.addEventListener('click',evento=>{if(!evento.target.closest('.menu-produto-container'))fecharMenusProdutos();});
  document.addEventListener('keydown',evento=>{if(evento.key==='Escape'){var aberto=document.querySelector('.dropdown-produto.aberto');if(aberto){aberto.previousElementSibling.focus();fecharMenusProdutos();}}});
  atualizar();
}


/* ==========================================================
   16/11/2026 — INICIALIZAÇÃO E INTEGRAÇÃO
========================================================== */

// 16/11/2026 — Inicializa os recursos presentes na página depois que o HTML está disponível.
function iniciarPortal() {
  iniciarDialogos();iniciarSidebar();iniciarAparencia();iniciarLogin();iniciarUnidades();iniciarSalas();iniciarFinanceiro();iniciarConveniencia();iniciarDashboard();iniciarConfiguracoes();
}

// 16/11/2026 — Aguarda o carregamento do HTML antes de iniciar a interface.
if (typeof document !== 'undefined') {
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciarPortal,{once:true});else iniciarPortal();
}

// 16/11/2026 — Disponibiliza a lógica para testes locais sem exigir o navegador.
if (typeof module !== 'undefined' && module.exports) module.exports={hojeISO,paraISO,dataBR,statusPagamento,filtrarPeriodo,ordenarLista,normalizar,carregarSalas,criarDadosConveniencia,registrarConsumo,excluirProduto,excluirConsumo,iniciarPortal,obterPagamentos,carregarConveniencia,salvarConveniencia,resumirOperacao,aplicarParametrosFiltros,validarPerfil,carregarUsuario,iniciaisUsuario,carregarTema,salvarConfiguracoes,restaurarDados,gerarTextoChamado};
