const express = require('express');

const veiculoController = require('../controllers/veiculoController');
const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas de veículos exigem autenticação
router.use(autenticarToken);

// Cadastrar veículo
router.post('/', veiculoController.cadastrar);

// Listar veículos
router.get('/', veiculoController.listar);

module.exports = router;