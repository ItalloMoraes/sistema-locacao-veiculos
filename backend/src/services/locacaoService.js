const prisma = require('../config/database');


async function cadastrarLocacao(usuarioId, veiculoId, dataPrevisaoDevolucao) {
  return await prisma.$transaction(async (tx) => {

    // 1. Validar os dados recebidos
    if (
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0 ||
      !Number.isInteger(veiculoId) ||
      veiculoId <= 0
    ) {
      const erro = new Error('Usuário ou veículo inválido.');
      erro.status = 400;
      throw erro;
    }

    // 2. Validar a data prevista
    const dataInicio = new Date();
    const dataPrevisao = new Date(dataPrevisaoDevolucao);

    if (
      !dataPrevisaoDevolucao ||
      Number.isNaN(dataPrevisao.getTime())
    ) {
      const erro = new Error('Data de devolução inválida.');
      erro.status = 400;
      throw erro;
    }

    if (dataPrevisao <= dataInicio) {
      const erro = new Error(
        'A previsão de devolução deve ser posterior ao início da locação.'
      );
      erro.status = 400;
      throw erro;
    }

    // 3. Consultar o veículo
    const veiculo = await tx.veiculo.findUnique({
      where: { id: veiculoId }
    });

    if (!veiculo) {
      const erro = new Error('Veículo não encontrado.');
      erro.status = 404;
      throw erro;
    }

    if (!veiculo.disponibilidade) {
      const erro = new Error('Este veículo não está disponível.');
      erro.status = 409;
      throw erro;
    }

    // 4. Calcular o valor da locação
    const diferencaEmMilissegundos =
      dataPrevisao.getTime() - dataInicio.getTime();

    const dias = Math.ceil(
      diferencaEmMilissegundos / (1000 * 60 * 60 * 24)
    );

    const valorTotal = Number(veiculo.diaria) * dias;

    // 5. Atualizar somente se ainda estiver disponível
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
      const erro = new Error(
        'Este veículo acabou de ser alugado por outro usuário.'
      );
      erro.status = 409;
      throw erro;
    }

    // 6. Registrar a locação
    const locacao = await tx.locacao.create({
      data: {
        usuarioId,
        veiculoId,
        dataInicio,
        dataPrevisaoDevolucao: dataPrevisao,
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