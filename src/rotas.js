const express = require('express')
const { cadastrarUsuario, obterPerfilUsuario } = require('./controladores/usuario');
const { login } = require('./controladores/login');
const { filtroAutenticacao } = require('./intermediarios/autenticacao');

const rotas = express()

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(filtroAutenticacao)

rotas.get('/usuario', obterPerfilUsuario);

module.exports = rotas