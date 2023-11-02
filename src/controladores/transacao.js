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

const detalharTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const { rowCount, rows} = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não foi encontrada'});
        }

        cosnt [transacao] = rows

        return res.json(transacao);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

module.exports = {
    listarTransacoes,
    detalharTransacao
}