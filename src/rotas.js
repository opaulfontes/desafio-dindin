const express = require('express')
const { cadastrarUsuario, obterPerfilUsuario, atualizarPerfilUsuario } = require('./controladores/usuario');
const { login } = require('./controladores/login');
const { filtroAutenticacao } = require('./intermediarios/autenticacao');
const { listarCategorias } = require('./controladores/categoria');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, consultarExtrato } = require('./controladores/transacao');

const rotas = express()

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtroAutenticacao)

rotas.get('/usuario', obterPerfilUsuario);
rotas.put('/usuario', atualizarPerfilUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', consultarExtrato);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas