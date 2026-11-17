
const prisma = require('../config/database');

async function buscarIndicadores() {
  const totalVeiculos = await prisma.veiculo.count();

  const veiculosDisponiveis = await prisma.veiculo.count({
    where: {
      disponibilidade: true
    }
  });

  const locacoesAtivas = await prisma.locacao.count({
    where: {
      status: 'ATIVA'
    }
  });

  const resultadoFinanceiro = await prisma.locacao.aggregate({
    _sum: {
      valorTotal: true
    },
    where: {
      status: 'FINALIZADA'
    }
  });

  return {
    totalVeiculos,
    veiculosDisponiveis,
    locacoesAtivas,
    faturamento: Number(resultadoFinanceiro._sum.valorTotal || 0)
  };
}

module.exports = {
  buscarIndicadores
};
