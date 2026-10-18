# Prompts utilizados - telas Salas e Financeiro

## Salas

### CSS (style.css — parte TELA SALAS)

1. Faz o CSS de uma página de salas para um sistema chamado Attento. Quero um menu lateral azul (#2f4f9e) com os itens Início, Unidades, Salas, Agenda, Atendimento, Concorrência, Profissionais, Financeiros e Relatórios, e embaixo Configurações e Sair. O item que estiver ativo tem que ficar com fundo branco e letra azul.
2. Agora faz o topo da página com o título "Salas", um subtítulo cinza embaixo e um botão azul "+ Cadastrar sala" no canto direito.
3. Faz a parte dos filtros: uma barra de busca que ocupa o espaço que sobrar e dois selects do lado (unidade e status), com borda clarinha e cantos arredondados.
4. Faz o estilo dos cards das salas em grade, que se ajustam sozinhos ao tamanho da tela. Cada card com fundo branco, borda fina, nome da sala, unidade, status, profissional, horário e um botão "Ver detalhes" com borda azul.
5. Cada status precisa de uma cor com uma bolinha do lado: Disponível verde, Reservada amarela, Ocupada vermelha e Indisponível cinza.

### JavaScript (script.js — parte TELA SALAS)

1. Eu tenho um array com as salas no meu script.js. Me ajuda a fazer os cards aparecerem na tela usando o template que está no HTML?
2. Me ajuda a fazer os filtros funcionarem juntos: busca pelo nome da sala, filtro de unidade e filtro de status.
3. Quando eu clico em "Ver detalhes" de qualquer sala, sempre aparece a Sala 06. Por que isso acontece e como eu arrumo?
4. O nome do status (Disponível, Indisponível...) está ficando por baixo da cor e não dá para ler. O que está errado?
5. Como faço para o botão "Financeiros" do menu abrir a página financeiro.html?

## Financeiro

### CSS (style.css — parte TELA FINANCEIRO)

1. Faz o CSS da página de financeiro usando o mesmo menu lateral, topo e filtros da página de salas, para ficar tudo com a mesma cara.
2. Faz três cards de resumo lado a lado: Recebido, Pendente e Total previsto, com o valor grande e em negrito.
3. Faz o estilo de uma tabela de pagamentos dentro de um card branco, com cabeçalho cinza clarinho, linhas separadas por uma borda fina, e que role para o lado se a tela for pequena.
4. Coloca as cores dos status de pagamento: Pago verde, Pendente laranja e Em atraso vermelho, com uma bolinha da mesma cor do texto.

### JavaScript (script.js — parte TELA FINANCEIRO)

1. Me ajuda a montar as linhas da tabela de pagamentos a partir do meu array, do mesmo jeito que eu fiz com os cards das salas.
2. Me ajuda a fazer os filtros do financeiro (busca por profissional, unidade e status) e fazer os cards de resumo recalcularem os valores de acordo com o filtro.
3. Quando eu clico em "Salas" no menu do financeiro, aparece que o arquivo não foi encontrado. O que está errado no caminho?
4. A planilha exportada está saindo com os acentos errados no Excel. Como resolvo?
