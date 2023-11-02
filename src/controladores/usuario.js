const { query } = require('../bancodedados/conexao')
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório!'});
    } 
    if (!email) {
        return res.status(400).json({ mensagem: 'O e-mail é obrigatório!'});
    } 
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!'});
    } 
    
    try {
        const usuario = await query(`select * from usuarios where email = $1`, [email]);

        if (usuario.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe um usuário com o e-mail cadastrado!'});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = `insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *`;
        const paramCadastro = [nome, email, senhaCriptografada];
        const usuarioCadastrado = await query(queryCadastro, paramCadastro);

        if (usuarioCadastrado.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }

        const { senha: _, ...cadastro} = usuarioCadastrado.rows[0]
        
        return res.status(201).json(cadastro);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

const obterPerfilUsuario = async (req, res) => {
    return res.json(req.usuario);
}

const atualizarPerfilUsuario = async (req, res) => {
    const { usuario } = req;

    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório!'});
    } 
    if (!email) {
        return res.status(400).json({ mensagem: 'O e-mail é obrigatório!'});
    } 
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!'});
    } 

    try {
        const usuarioEncontrado = await query(`select * from usuarios where email = $1`, [email]);

        if (usuario.rowCount > 0 && usuarioEncontrado.rows[0].id !== usuario.id) {
            return res.status(400).json({ mensagem: 'Já existe um usuário com o e-mail cadastrado!'});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizacao = `update usuarios set nome = $1, email = $2, senha = $3 where id = $4`;
        const paramAtualizacao = [nome, email, senhaCriptografada, usuario.id];
        const usuarioAtulizado = await query(queryAtualizacao, paramAtualizacao);

        if (usuarioAtulizado.rowCount <= 0) {
           return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }
  
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfilUsuario,
    atualizarPerfilUsuario
}