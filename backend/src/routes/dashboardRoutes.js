
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticarToken);

router.get('/', dashboardController.buscar);

module.exports = router;
