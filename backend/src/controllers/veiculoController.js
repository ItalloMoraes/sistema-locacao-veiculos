const veiculoService = require('../services/veiculoService');

async function cadastrar(req, res) {
  try {
    const { marca, modelo, placa, ano, diaria } = req.body;

    if (!marca || !modelo || !placa || !ano || diaria === undefined) {
      return res.status(400).json({
        mensagem: 'Preencha todos os campos do veículo.'
      });
    }

    const anoConvertido = Number(ano);
    const diariaConvertida = Number(diaria);

    if (!Number.isInteger(anoConvertido) || anoConvertido < 1900) {
      return res.status(400).json({
        mensagem: 'Informe um ano válido.'
      });
    }

    if (!Number.isFinite(diariaConvertida) || diariaConvertida <= 0) {
      return res.status(400).json({
        mensagem: 'Informe um valor de diária válido.'
      });
    }

    const veiculo = await veiculoService.cadastrarVeiculo({
      marca: marca.trim(),
      modelo: modelo.trim(),
      placa: placa.trim().toUpperCase(),
      ano: anoConvertido,
      diaria: diariaConvertida
    });

    return res.status(201).json({
      mensagem: 'Veículo cadastrado com sucesso!',
      veiculo
    });

  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error);

    return res.status(error.status || 500).json({
      mensagem: error.status ? error.message : 'Erro ao cadastrar veículo.'
    });
  }
}

async function listar(req, res) {
  try {
    const veiculos = await veiculoService.listarVeiculos();

    return res.status(200).json(veiculos);

  } catch (error) {
    console.error('Erro ao listar veículos:', error);

    return res.status(500).json({
      mensagem: 'Erro ao listar veículos.'
    });
  }
}

module.exports = {
  cadastrar,
  listar
};