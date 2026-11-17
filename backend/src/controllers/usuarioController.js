
const usuarioService = require('../services/usuarioService');
const jwt = require('jsonwebtoken');

async function cadastrar(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail e senha são obrigatórios.'
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                mensagem: 'A senha deve ter pelo menos 6 caracteres.'
            });
        }

        const usuario = await usuarioService.cadastrarUsuario(
            nome.trim(),
            email.trim().toLowerCase(),
            senha
        );

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            mensagem: error.status ? error.message : 'Erro ao cadastrar usuário.'
        });
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'E-mail e senha são obrigatórios.'
            });
        }

        const usuario = await usuarioService.autenticarUsuario(
            email.trim().toLowerCase(),
            senha
        );

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            mensagem: error.status ? error.message : 'Erro ao realizar login.'
        });
    }
}

module.exports = {
    cadastrar,
    login
};
