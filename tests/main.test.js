const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../main');

chai.use(chaiHttp);
const expect = chai.expect;

const generateRoute = (id) => `/clientes/${id}/transacoes`;
describe(`POST /clientes/:id/transacoes`, () => {
	const transaction = { 
		valor: 0, 
		tipo: 'd', 
		descricao: 'pao'
	};
	const route1 = generateRoute(0);
  	it(`POST ${route1} - should return error message: Cliente não encontrado!`, async () => {
		const response = await chai
			.request(app)
			.post(route1)
			.send(transaction);

		expect(response).to.have.status(404);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Cliente não encontrado!');
  	});

	const route2 = generateRoute(1);
	it(`POST ${route2} - should return error message: Valor inválido`, async () => {
		const response = await chai
			.request(app)
			.post(route2)
			.send(transaction);

		expect(response).to.have.status(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Valor inválido');
	});

	const route3 = generateRoute(1);
	it(`POST ${route3} - should return error message: Tipo inválido`, async () => {
		transaction.valor = 10;
		transaction.tipo = 'a';
		const response = await chai
		.request(app)
		.post(route3)
		.send(transaction);

		expect(response).to.have.status(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Tipo inválido');
	});

	it(`POST ${route3} - should return error message: Descrição inválida`, async () => {
		transaction.valor = 10;
		transaction.tipo = 'd';
		transaction.descricao = 'sagsdg sagasdgsagsg sagasgsdg';
		const response = await chai
		.request(app)
		.post(route3)
		.send(transaction);

		expect(response).to.have.status(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Descrição inválida');
	});

	it(`POST ${route1} - should return error message: Limite não disponível!`, async () => {
		transaction.valor = 1000001;
		transaction.tipo = 'd';
		transaction.descricao = 'sagsdg';
		const response = await chai
		.request(app)
		.post(route3)
		.send(transaction);

		expect(response).to.have.status(422);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Limite não disponível!');
	});

	it(`POST ${route1} - should insert a transaction successfully`, async () => {
		transaction.valor = 10;
		transaction.tipo = 'd';
		transaction.descricao = 'sagsdg';
		const response = await chai
		.request(app)
		.post(route3)
		.send(transaction);

		expect(response).to.have.status(200);
		expect(response.body).to.have.property('limite');
		expect(response.body).to.have.property('saldo');
	});
});

const generateRoute2 = (id) => `/clientes/${id}/extrato`;

describe(`GET /clientes/:id/extrato`, () => {
	const route1 = generateRoute2(0);
	it(`GET ${route1} - should return error message: Cliente não encontrado!`, async () => {
		const response = await chai
			.request(app)
			.get(route1);

		expect(response).to.have.status(404);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.equal('Cliente não encontrado!');
	});

	const route2 = generateRoute2(1);
	it(`GET ${route2} - should return the last ten transactions and statement`, async () => {
		const response = await chai
			.request(app)
			.get(route2);

		expect(response).to.have.status(200);
		expect(response.body).to.have.property('saldo');
		expect(response.body).to.have.property('ultimas_transacoes');
	});
});