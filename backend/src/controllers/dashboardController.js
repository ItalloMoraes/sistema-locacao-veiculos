
const dashboardService = require('../services/dashboardService');

async function buscar(req, res) {
  try {
    const indicadores = await dashboardService.buscarIndicadores();

    return res.status(200).json(indicadores);
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);

    return res.status(500).json({
      mensagem: 'Erro ao buscar os indicadores do sistema.'
    });
  }
}

module.exports = {
  buscar
};
