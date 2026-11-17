
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

async function cadastrarUsuario(nome, email, senha) {
    const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
    });

    if (usuarioExistente) {
        const erro = new Error('Este e-mail já está cadastrado.');
        erro.status = 409;
        throw erro;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash
        },
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true
        }
    });

    return usuario;
}

async function autenticarUsuario(email, senha) {
    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario) {
        const erro = new Error('E-mail ou senha inválidos.');
        erro.status = 401;
        throw erro;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
        const erro = new Error('E-mail ou senha inválidos.');
        erro.status = 401;
        throw erro;
    }

    return usuario;
}

module.exports = {
    cadastrarUsuario,
    autenticarUsuario
};
