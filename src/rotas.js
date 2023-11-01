const express = require('express')
const { cadastrarUsuario } = require('./controladores/usuario');
const { login } = require('./controladores/login');

const rotas = express()

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

module.exports = rotas