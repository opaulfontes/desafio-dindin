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
        const { rowCount, rows } = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não foi encontrada'});
        }

        const [transacao] = rows

        return res.json(transacao);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

const cadastrarTransacao = async (req, res) => {
    const { usuario } = req;
    const { descricao, valor, data, categoria_id, tipo} = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição é obrigatória!'})
    }
    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório'})
    }
    if (!data) {
        return res.status(400).json({ mensagem: 'A data é obrigatória!'})
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: 'Este campo é obrigatório!'})
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: 'O tipo é obrigatório!'})
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'O tipo precisa ser: "entrada" ou "saída".'})
    }

    try {
        const categoria = await query('select * from categorias where id = $1', [categoria_id])

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe!'});
        }

        const queryCadastro = 'insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) values ($1, $2, $3, $4, $5, $6) returning *'
        const paramCadastro = [descricao, valor, data, categoria_id, tipo, usuario.id]
        const {rowCount, rows} = await query(queryCadastro, paramCadastro);

        if (rowCount < 0) {
            return res.status(500).json({ mensagem: `${error.message}`});
        }

        const [transacao] = rows;
        transacao.categoria_nome = categoria.rows[0].descricao;

        return res.status(201).json(transacao);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error.message}`});
    }
}

const atualizarTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo} = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição é obrigatória!'})
    }
    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório'})
    }
    if (!data) {
        return res.status(400).json({ mensagem: 'A data é obrigatória!'})
    }
    if (!categoria_id) {
        return res.status(400).json({ mensagem: 'Este campo é obrigatório!'})
    }
    if (!tipo) {
        return res.status(400).json({ mensagem: 'O tipo é obrigatório!'})
    }
    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: 'O tipo precisa ser: "entrada" ou "saída".'})
    }

    try {
        const transacao = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe' });
        }

        const categoria = await query('select * from categorias where id = $1', [categoria_id])

        if (categoria.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A categoria não existe!'});
        }

        const queryAtualizacao = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6';
        const paramAtualizacao = [descricao, valor, data, categoria_id, tipo, id];
        const transacaoAtualizada = await query(queryAtualizacao, paramAtualizacao);
    
        if (transacaoAtualizada.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    }
}

const excluirTransacao = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const transacao = await query('select * from transacoes where usuario_id = $1 and id = $2', [usuario.id, id]);

        if (transacao.rowCount <= 0) {
            return res.status(404).json({ mensagem: 'A transação não existe' });
        }

        const transacaoExcluida = await query('delete from transacoes where id = $1', [id])

        if (transacaoExcluida.rowCount <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}`});
    }
}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao
}