
const express = require('express');
const cors = require('cors');
const veiculoRoutes = require('./routes/veiculoRoutes');
const locacaoRoutes = require('./routes/locacaoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
require('dotenv').config();

const prisma = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'Sistema de Locação de Veículos funcionando!',
        status: 'online'
    });
});

// Rotas de usuários
app.use('/usuarios', usuarioRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/locacoes', locacaoRoutes);
app.use('/dashboard', dashboardRoutes);

// Teste de conexão com o banco
app.get('/teste-banco', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.count();

        res.status(200).json({
            mensagem: 'Conexão com MySQL realizada com sucesso!',
            banco: 'locacao_veiculos',
            usuariosCadastrados: usuarios
        });

    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);

        res.status(500).json({
            mensagem: 'Erro ao conectar ao banco de dados.'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
