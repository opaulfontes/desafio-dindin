const { query } = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const senhaToken = require('../dadossensiveis/config');

const filtroAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado!'});
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, senhaToken);

        const { rowCount, rows } = await query(`select * from usuarios where id= $1`, [id]);

        if (rowCount <= 0) {
            return res.status(401).json({ mensagem: 'Não autorizado!'});
        }

        const [usuario] = rows;

        const { senha: _, ...dadosUsuario} = usuario;

        req.usuario = dadosUsuario;

        next();
    } catch {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

module.exports = {
    filtroAutenticacao
}