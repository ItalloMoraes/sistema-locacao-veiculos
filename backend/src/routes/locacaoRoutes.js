const express = require('express');

const locacaoController = require('../controllers/locacaoController');
const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas de locação exigem autenticação
router.use(autenticarToken);

// Registrar uma locação
router.post('/', locacaoController.cadastrar);

// Consultar as locações do usuário autenticado
router.get('/minhas', locacaoController.listarMinhas);

// Devolver um veículo
router.patch('/:id/devolucao', locacaoController.devolver);

module.exports = router;