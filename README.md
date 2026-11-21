# Attento — Portal de Gestão

Projeto acadêmico de front-end desenvolvido pelo **Squad 32**, na disciplina **Residência I da Universidade Tiradentes — SE**.

**Documentação atualizada em 16/11/2026.**

## Descrição e objetivo

O Attento é um protótipo de portal administrativo para um espaço de atendimento em saúde mental. Sua proposta é reunir a gestão das unidades, a situação das salas, o acompanhamento de recebimentos e os produtos e consumos de uma conveniência.

O objetivo acadêmico é demonstrar a construção de interfaces com HTML, CSS e JavaScript, a organização de informações e a implementação de interações de uso cotidiano. A versão atual permite experimentar os fluxos de navegação e gestão com dados de exemplo, sem depender de um servidor de aplicação ou banco de dados.

## Funcionalidades

| Página ou recurso | Comportamento implementado |
|---|---|
| Login | Campos obrigatórios, botão para mostrar/ocultar senha e recuperação com orientação para contatar o administrador. O envio abre o dashboard. |
| Dashboard | Indicadores calculados a partir das fontes compartilhadas, situação das oito salas e links para pagamentos, disponibilidade e alertas de estoque. O valor recebido considera todo o período dos registros. |
| Unidades | Fotos, contagens por status, busca e ordenação. O link de cada unidade abre Salas com o filtro correspondente aplicado. |
| Salas | Busca, filtros por unidade e status, ordenação, contagem de resultados, detalhes e edição das salas. |
| Financeiro | Pagamentos de exemplo, resumo de valores, situação calculada, filtros por profissional, unidade, status e vencimento, ordenação e exportação CSV dos registros exibidos. |
| Conveniência | Cadastro, edição e exclusão de produtos; controle de estoque; registro e exclusão de consumos; filtros, ordenação e indicadores. Cada consumo guarda o preço praticado no momento do registro. |
| Sidebar | Navegação com ícones, recolhimento no desktop e menu sobreposto no celular. |
| Aparência | Temas claro e escuro, com preferência guardada no navegador quando o armazenamento estiver disponível. |
| Usuário | Modal de consulta com nome, foto e perfil nas páginas internas. Nome e foto podem ser alterados em Configurações. |
| Configurações | Tema claro, escuro ou automático; edição de nome e foto; restauração de salas ou Conveniência; geração local de chamado de suporte. |
| Feedback e modais | Confirmações de ações, erros próximos aos formulários, fechamento de diálogos por botão, Esc ou clique fora e retorno de foco. |

Em Configurações, nome, foto e tema só são aplicados ao clicar em **Salvar alterações**. Fechar com alterações pendentes exige confirmar o descarte. A mesma proteção se aplica ao formulário do chamado antes de sua exportação.

A foto aceita JPG, PNG ou WebP de até 2 MB e é redimensionada para até 256 px. Remover a foto restaura a exibição das iniciais. O tema automático acompanha a preferência do dispositivo e é compartilhado com o atalho da sidebar.

As restaurações são independentes: **Restaurar salas** remove as edições locais das oito salas; **Restaurar Conveniência** reinicia produtos, estoques e consumos da sessão. Ambas pedem confirmação e recarregam a página. Elas preservam o perfil do usuário e as preferências de aparência.

Os filtros por data começam recolhidos. O resumo do período continua visível quando os campos estão fechados. Os intervalos incluem a data inicial e a final. No Financeiro, o período se refere ao **vencimento**; na Conveniência, à **data do consumo**.

Um pagamento sem quitação é marcado como **Em atraso** quando seu vencimento é anterior à data atual do navegador. No dia do vencimento, ele permanece **Pendente**. Os registros quitados permanecem **Pagos**.

## Unidades e salas

| Unidade | Salas iniciais |
|---|---|
| Jardim Europa | Onda, Areia, Brisa, Mar e Estrela |
| Horizonte Jardins | Duna, Maré e Costa |

Os identificadores internos das salas permanecem estáveis mesmo quando seus nomes são editados. O Financeiro usa esses identificadores para exibir o nome e a unidade atuais. A leitura de dados locais antigos também atualiza os nomes da versão anterior, preservando as edições feitas depois dessa migração.

## Tecnologias e estrutura

O projeto usa **HTML, CSS e JavaScript**, sem framework, processo de compilação ou dependências de aplicação a instalar. Há ícones SVG locais e referências a bibliotecas de ícones por CDN em algumas páginas.

| Arquivo ou pasta | Responsabilidade |
|---|---|
| `index.html` | Tela de login e aviso de recuperação de senha. |
| `dashboard.html` | Estrutura do painel e de seus indicadores. |
| `unidades.html` | Cards das unidades e links para salas filtradas. |
| `salas.html` | Listagem, filtros, detalhes e edição de salas. |
| `financeiro.html` | Resumo, filtros e tabela de pagamentos. |
| `conveniencia.html` | Catálogo, estoque, consumos e formulários. |
| `script.js` | Dados iniciais, funções compartilhadas e lógica de cada módulo. |
| `style.css` | Estilos compartilhados e estilos agrupados por recurso ou página. |
| `assets/` | Fotografias das unidades, logos e ícones. |
| `prompts.md` | Registro de prompts mantido no projeto original. |

### Organização do JavaScript e do CSS

Os dois arquivos começam pelos **componentes compartilhados**. Depois, o código é agrupado em **Sidebar e aparência**, **Configurações**, **Login**, **Unidades**, **Dashboard**, **Salas**, **Financeiro** e **Conveniência**. No JavaScript, a inicialização do portal e a exposição de funções para testes ficam no final.

No CSS, os ajustes de responsividade e de modo escuro ficam junto da categoria à qual pertencem. Regras que atendem a várias páginas permanecem no grupo compartilhado. Os estilos que antes estavam em blocos `<style>` de Unidades e Dashboard foram transferidos para o arquivo CSS, com escopo por página.

Os comentários anteriores foram preservados. As descrições e os títulos adicionados nesta revisão usam a data **16/11/2026**. O índice atual no início do CSS substitui, para orientação de leitura, a organização histórica descrita nos comentários antigos.

## Como executar

1. Extraia o arquivo do projeto.
2. Abra a pasta que contém `index.html`, `script.js` e `style.css`.
3. Inicie um servidor estático, como o Live Server do VS Code. Se Python estiver disponível, execute nessa pasta:

```bash
python -m http.server 8000
```

4. Acesse [http://localhost:8000](http://localhost:8000) no navegador.

Prefira um servidor local para manter as páginas e seus armazenamentos sob a mesma origem. Não é necessário executar um backend ou configurar banco de dados. A disponibilidade das CDNs pode afetar os ícones externos; os arquivos principais de estilo e comportamento são locais.

## Limitações definidas para esta versão

### Protótipo de front-end

- **Não existe autenticação real.** O login valida apenas o preenchimento exigido pelo HTML; não verifica credenciais, não cria sessão autenticada e não protege o acesso direto às páginas.
- A recuperação de senha apenas orienta a procurar o administrador. Não envia e-mail, não gera tokens e não altera senhas.
- O perfil representa um usuário local demonstrativo. Nome e foto podem ser editados, mas não há cadastro de contas nem controle efetivo de permissões. O papel Administrador continua fixo.
- O suporte técnico gera um arquivo TXT para download e encaminhamento manual. Não há envio automático, protocolo remoto ou acompanhamento de atendimento.
- Não há API, banco de dados, integração com pagamentos, conciliação, cobrança ou emissão de documentos fiscais. Os registros financeiros são exemplos de consulta e exportação.
- A situação das salas é cadastrada manualmente. O horário é descritivo; não há agenda com reservas por data nem verificação automática de conflitos de horários.

### Persistência local e conteúdo temporário

| Dados | Onde ficam | Limitação |
|---|---|---|
| Alterações das salas | `localStorage` | Permanecem ao recarregar e reabrir o portal no mesmo navegador e origem. Não são compartilhadas entre dispositivos e podem desaparecer se os dados do site forem apagados. |
| Nome e foto do usuário | `localStorage` | Disponíveis nas páginas internas do mesmo navegador e origem. A foto é reduzida antes de salvar; não é enviada a um servidor. |
| Preferências de tema e sidebar | `localStorage` | Dependem da permissão de armazenamento do navegador. |
| Produtos, estoques e consumos | `sessionStorage` | São mantidos durante a sessão da aba, inclusive na navegação entre páginas e no recarregamento. Não constituem armazenamento permanente; o comportamento de restauração de abas depende do navegador. |
| Pagamentos iniciais | Código JavaScript | São dados de exemplo, sem edição ou persistência em um serviço externo. |
| Opções de desfazer exclusão | Memória da página | Permanecem enquanto a página estiver aberta e o aviso não for dispensado. Navegar ou recarregar remove as opções de desfazer, mesmo que os dados da Conveniência continuem na sessão da aba. |

Se o navegador impedir o armazenamento, as salas podem não ser salvas e a Conveniência pode funcionar somente enquanto a página permanecer aberta. Não há sincronização por servidor nem entre dispositivos. O dashboard utiliza as mesmas fontes locais; os dados de Conveniência pertencem à sessão da aba.

Os avisos visuais de conteúdo temporário e sincronização foram retirados da interface por decisão do projeto. Essa remoção **não altera as limitações de persistência** descritas aqui. Confirmações de ações e mensagens de erro continuam na interface.

### Validações e exclusões

- O consumo exige uma quantidade inteira positiva e não pode ultrapassar o estoque disponível.
- Produtos não aceitam estoque negativo ou fracionado, preço negativo ou nome duplicado no catálogo atual.
- Alterar o preço ou excluir um produto não recalcula o valor dos consumos anteriores.
- Desfazer um consumo pode ser impedido se o estoque necessário já tiver sido utilizado. Se o produto também tiver sido excluído, pode ser necessário restaurá-lo primeiro.

## Conferência sugerida antes da apresentação

- Navegar entre as cinco páginas internas e conferir os totais do dashboard.
- Abrir cada unidade e verificar se Salas recebe o filtro correto.
- Editar uma sala e verificar sua apresentação em Unidades, Salas, Financeiro e Dashboard.
- Testar filtros, ordenação, intervalos de data e exportação CSV.
- Cadastrar e excluir produtos e consumos; testar também o desfazer.
- Conferir os temas, os modais e o retorno de foco usando mouse e teclado.
- Verificar o login, a sidebar e as tabelas em celular e desktop, incluindo larguras de 320 px, 390 px e 768 px.

Esta versão foi preparada para demonstrar os fluxos acadêmicos definidos acima. A evolução para uso real exige implementar as camadas de autenticação, autorização, persistência e integração que ainda estão fora do escopo.
