const { query } = require("../bancodedados/conexao");

const listarTransacoes = async (req, res) => {
    const { usuario } = req;

    try {
        const transacoes = await query('select * from transacoes where usuario_id = $1', [usuario.id]);
        return res.json(transacoes.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

module.exports = {
    listarTransacoes
}