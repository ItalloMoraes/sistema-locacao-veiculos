
const prisma = require('../config/database');

async function cadastrarVeiculo(dados) {
    const placaExistente = await prisma.veiculo.findUnique({
        where: {
            placa: dados.placa
        }
    });

    if (placaExistente) {
        const erro = new Error('Esta placa já está cadastrada.');
        erro.status = 409;
        throw erro;
    }

    return await prisma.veiculo.create({
        data: {
            marca: dados.marca,
            modelo: dados.modelo,
            placa: dados.placa,
            ano: dados.ano,
            diaria: dados.diaria
        }
    });
}

async function listarVeiculos() {
    return await prisma.veiculo.findMany({
        orderBy: {
            id: 'desc'
        }
    });
}

module.exports = {
    cadastrarVeiculo,
    listarVeiculos
};
