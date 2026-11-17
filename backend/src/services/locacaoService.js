const prisma = require('../config/database');

async function cadastrarLocacao(usuarioId, veiculoId, dataPrevisaoDevolucao) {
  const previsao = new Date(dataPrevisaoDevolucao);

  if (Number.isNaN(previsao.getTime())) {
    const erro = new Error('Data de previsão de devolução inválida.');
    erro.status = 400;
    throw erro;
  }

  return await prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { id: veiculoId }
    });

    if (!veiculo) {
      const erro = new Error('Veículo não encontrado.');
      erro.status = 404;
      throw erro;
    }

    if (!veiculo.disponibilidade) {
      const erro = new Error('Este veículo não está disponível para locação.');
      erro.status = 409;
      throw erro;
    }

    const dataInicio = new Date();

    if (previsao <= dataInicio) {
      const erro = new Error('A previsão de devolução deve ser posterior ao início da locação.');
      erro.status = 400;
      throw erro;
    }

    const diferencaEmMs = previsao.getTime() - dataInicio.getTime();
    const horas = diferencaEmMs / (1000 * 60 * 60);
    const quantidadeDiarias = Math.ceil(horas / 24);

    const valorTotal = Number(veiculo.diaria) * quantidadeDiarias;

    // Atualização condicional para evitar duas locações simultâneas
    const atualizacao = await tx.veiculo.updateMany({
      where: {
        id: veiculoId,
        disponibilidade: true
      },
      data: {
        disponibilidade: false
      }
    });

    if (atualizacao.count === 0) {
      const erro = new Error('Este veículo acabou de ser alugado por outra pessoa.');
      erro.status = 409;
      throw erro;
    }

    const locacao = await tx.locacao.create({
      data: {
        usuarioId,
        veiculoId,
        dataInicio,
        dataPrevisaoDevolucao: previsao,
        valorTotal,
        status: 'ATIVA'
      },
      include: {
        veiculo: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return locacao;
  });
}

async function listarMinhasLocacoes(usuarioId) {
  return await prisma.locacao.findMany({
    where: { usuarioId },
    include: {
      veiculo: true
    },
    orderBy: {
      dataInicio: 'desc'
    }
  });
}


async function devolverVeiculo(locacaoId, usuarioId) {
  return await prisma.$transaction(async (tx) => {

    const locacao = await tx.locacao.findFirst({
      where: {
        id: locacaoId,
        usuarioId
      }
    });

    if (!locacao) {
      const erro = new Error('Locação não encontrada.');
      erro.status = 404;
      throw erro;
    }

    const resultado = await tx.locacao.updateMany({
      where: {
        id: locacaoId,
        usuarioId,
        status: 'ATIVA'
      },
      data: {
        status: 'FINALIZADA',
        dataDevolucao: new Date()
      }
    });

    if (resultado.count === 0) {
      const erro = new Error('Esta locação já foi finalizada.');
      erro.status = 409;
      throw erro;
    }

    await tx.veiculo.update({
      where: {
        id: locacao.veiculoId
      },
      data: {
        disponibilidade: true
      }
    });

    return await tx.locacao.findUnique({
      where: {
        id: locacaoId
      },
      include: {
        veiculo: true
      }
    });
  });
}


module.exports = {
  cadastrarLocacao,
  listarMinhasLocacoes,
  devolverVeiculo
};