// const express = require('express');
const Transacao = require('./domain/Transaction');
const Cliente = require('./domain/Cliente');
const ClienteRepositoryDatabase = require('./infra/repositories/ClienteRepositoryDatabase');
const TransacaoRepositoryDatabase = require('./infra/repositories/TransacaoRepositoryDatabase');
const Pg = require('./infra/databases/Pg');
// const app = express();
const port = process.env.NODE_PORT ?? 3000;
const fastify = require('fastify')({ logger: false })

// app.use(express.json());

const connection = new Pg();

fastify.post('/clientes/:id/transacoes', async (req, res) => {
	const { valor, tipo, descricao } = req.body;
	const clienteId = req.params.id;
	const conexao = await connection.connect();
	try {
		await conexao.query('BEGIN');
		//await conexao.query(`SELECT pg_advisory_xact_lock(${clienteId})`)
		const clienteRepository = new ClienteRepositoryDatabase(conexao);

		const clienteDb = await clienteRepository.findById(clienteId);

		if (!clienteDb) {
			await conexao.query('ROLLBACK');
			return res.code(404).send({ message: 'Cliente não encontrado!' });
		}

		const transacao = new Transacao(valor, tipo, descricao);

		const cliente = new Cliente(clienteDb.id, clienteDb.nome, clienteDb.limite, clienteDb.saldo);
		
		if (tipo === 'd' && (cliente.getSaldo() - valor) < -cliente.getLimite()) {
			await conexao.query('ROLLBACK');
			return res.code(422).send({ message: 'Limite não disponível!' });
		}

		cliente.setSaldo(cliente.getSaldo() + (tipo === 'd' ? -valor : valor));

		const transacaoRepository = new TransacaoRepositoryDatabase(conexao);

		await Promise.all([
			transacaoRepository.save(transacao, cliente.getId()),
			clienteRepository.atualizarSaldo(cliente)
		]);

		await conexao.query('COMMIT');
	
		res.code(200).send({
			limite: cliente?.getLimite() || 0,
			saldo: cliente?.getSaldo() || 0
		});
	} catch (error) {
		await conexao.query('ROLLBACK');
		res.code(422).send({ message: error.message});
	} finally {
		conexao.release();
	}
});

fastify.get('/clientes/:id/extrato', async (req, res) => {
	const clienteId = req.params.id;
	const conexao = await connection.connect();
	try {
		const clienteRepository = new ClienteRepositoryDatabase(conexao);

		const cliente = await clienteRepository.findById(clienteId, false);

		if (!cliente) {
			return res.code(404).send({ message: 'Cliente não encontrado!'});
		}

		const extrato = await clienteRepository.extrato(clienteId);
	
		res.code(200).send({
			saldo: {
				total: cliente?.saldo || 0,
				limite: cliente?.limite || 0,
				data_extrato: new Date()
			},
			ultimas_transacoes: extrato ?? []
		});
	} catch (error) {
		res.code(422).send({ message: error.message});
	} finally {
		conexao.release();
	}
});

fastify.listen({ port }, (err) => {
	if (err) {
		console.error(err)
	}
  console.log(`Server is listening on port ${port}`);
});

module.exports = fastify;