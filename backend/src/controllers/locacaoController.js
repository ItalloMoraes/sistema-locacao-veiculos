const locacaoService = require('../services/locacaoService');

async function cadastrar(req, res) {
  try {
    const usuarioId = Number(req.usuario.id);
    const { veiculoId, dataPrevisaoDevolucao } = req.body;

    if (!Number.isInteger(veiculoId) || veiculoId <= 0) {
      return res.status(400).json({
        mensagem: 'Informe um ID de veículo válido.'
      });
    }

    if (!dataPrevisaoDevolucao) {
      return res.status(400).json({
        mensagem: 'Informe a data prevista para devolução.'
      });
    }

    const locacao = await locacaoService.cadastrarLocacao(
      usuarioId,
      veiculoId,
      dataPrevisaoDevolucao
    );

    return res.status(201).json({
      mensagem: 'Locação realizada com sucesso!',
      locacao
    });

  } catch (error) {
    console.error('Erro ao cadastrar locação:', error);

    return res.status(error.status || 500).json({
      mensagem: error.status
        ? error.message
        : 'Erro ao realizar a locação.'
    });
  }
}

async function listarMinhas(req, res) {
  try {
    const usuarioId = Number(req.usuario.id);

    const locacoes = await locacaoService.listarMinhasLocacoes(usuarioId);

    return res.status(200).json(locacoes);

  } catch (error) {
    console.error('Erro ao listar locações:', error);

    return res.status(500).json({
      mensagem: 'Erro ao consultar suas locações.'
    });
  }
}

async function devolver(req, res) {
  try {
    const locacaoId = Number(req.params.id);
    const usuarioId = Number(req.usuario.id);

    if (!Number.isInteger(locacaoId) || locacaoId <= 0) {
      return res.status(400).json({
        mensagem: 'Informe um ID de locação válido.'
      });
    }

    const locacao = await locacaoService.devolverVeiculo(
      locacaoId,
      usuarioId
    );

    return res.status(200).json({
      mensagem: 'Veículo devolvido com sucesso!',
      locacao
    });

  } catch (error) {
    console.error('Erro ao devolver veículo:', error);

    return res.status(error.status || 500).json({
      mensagem: error.status
        ? error.message
        : 'Erro ao realizar a devolução.'
    });
  }
}

module.exports = {
  cadastrar,
  listarMinhas,
  devolver
};