
import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './Dashboard';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  async function fazerLogin(event) {
    event.preventDefault();

    setMensagem('');
    setCarregando(true);

    try {
      const resposta = await axios.post(
        'http://localhost:3000/usuarios/login',
        {
          email,
          senha
        }
      );

      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem(
        'usuario',
        JSON.stringify(resposta.data.usuario)
      );

      setUsuario(resposta.data.usuario);
      setAutenticado(true);

    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Não foi possível realizar o login. Verifique sua conexão.'
      );
    } finally {
      setCarregando(false);
    }
  }


if (autenticado) {
  return (
    <Dashboard
      usuario={usuario}
      onSair={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        setAutenticado(false);
        setEmail('');
        setSenha('');
        setUsuario(null);
      }}
    />
  );
}


  return (
    <main className="login-container">
      <section className="login-card">

        <div className="login-logo">
          <div className="logo-icon">V</div>

          <h1>
            LOCADORA <span>VEÍCULOS</span>
          </h1>

          <p>SISTEMA DE GESTÃO DE LOCAÇÕES</p>
        </div>

        <div className="login-title">
          <h2>Bem-vindo!</h2>
          <p>Entre com seus dados para continuar.</p>
        </div>

        <form className="login-form" onSubmit={fazerLogin}>

          <label>E-mail</label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Senha</label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {mensagem && (
            <p className="mensagem-erro">
              {mensagem}
            </p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'ENTRANDO...' : 'ENTRAR NO SISTEMA'}
          </button>

        </form>

        <footer>
          Sistema de Locação de Veículos © 2026
        </footer>

      </section>
    </main>
  );
}



export default App;

