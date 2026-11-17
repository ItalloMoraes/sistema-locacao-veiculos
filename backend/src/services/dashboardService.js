
const prisma = require('../config/database');

async function buscarIndicadores() {
  const totalVeiculos = await prisma.veiculo.count();

  const veiculosDisponiveis = await prisma.veiculo.count({
    where: { disponibilidade: true }
  });

  const locacoesAtivas = await prisma.locacao.count({
    where: { status: 'ATIVA' }
  });

  const resultadoFinanceiro = await prisma.locacao.aggregate({
    _sum: { valorTotal: true },
    where: { status: 'FINALIZADA' }
  });

  const locacoesRecentes = await prisma.locacao.findMany({
    take: 5,
    orderBy: {
      dataInicio: 'desc'
    },
    include: {
      veiculo: {
        select: {
          marca: true,
          modelo: true,
          placa: true
        }
      },
      usuario: {
        select: {
          nome: true
        }
      }
    }
  });

  return {
    totalVeiculos,
    veiculosDisponiveis,
    locacoesAtivas,
    faturamento: Number(resultadoFinanceiro._sum.valorTotal || 0),
    locacoesRecentes
  };
}

module.exports = { buscarIndicadores };
