# Contextualizacao

Pequenos negocios costumam controlar estoque em papel, conversas de WhatsApp ou planilhas. Esse processo depende de memoria, dificulta a auditoria das alteracoes e atrasa a tomada de decisao quando um produto esta acabando.

O projeto **StockFlow** resolve esse problema com um aplicativo mobile integrado a uma API REST e a um banco PostgreSQL. Funcionarios podem consultar produtos e registrar movimentacoes de entrada e saida. Administradores podem cadastrar produtos, enviar imagens, editar registros, excluir produtos e gerenciar usuarios.

## Problema

- Estoque fica incorreto por falta de registro padronizado.
- Produtos acabam sem alerta previo.
- O proprietario nao consegue saber quem realizou cada movimentacao.
- Planilhas ficam dificeis de manter quando a quantidade de produtos cresce.

## Solucao

O aplicativo centraliza o cadastro de produtos, categorias, imagens e movimentacoes. A API valida permissao por perfil, registra cada movimento com usuario responsavel e impede regras invalidas, como saida maior que o saldo disponivel.

## Publico-alvo

Pequenos comercios, lojas de bairro, mercearias, conveniencias e negocios que precisam de um controle simples pelo celular.

