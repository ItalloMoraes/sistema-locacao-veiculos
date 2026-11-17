
const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

// Rota protegida para testar a autenticação
router.get('/perfil', autenticarToken, (req, res) => {
    res.status(200).json({
        mensagem: 'Acesso autorizado!',
        usuario: req.usuario
    });
});

module.exports = router;
