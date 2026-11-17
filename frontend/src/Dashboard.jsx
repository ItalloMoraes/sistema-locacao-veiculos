
import { useState, useEffect } from 'react';
import axios from 'axios';


import {
  LayoutDashboard,
  CarFront,
  ClipboardList,
  History,
  LogOut,
  Menu,
  UserRound,
  CheckCircle2,
  Clock3,
  CircleDollarSign
} from 'lucide-react';


import Veiculos from './Veiculos';
import './Dashboard.css';

import Locacoes from './Locacoes';

import Historico from './Historico';


function Dashboard({ usuario, onSair }) {
  const [paginaAtiva, setPaginaAtiva] = useState('Visão geral');
  const [menuAberto, setMenuAberto] = useState(false);
const [locacoesRecentes, setLocacoesRecentes] = useState([]);

  const [indicadores, setIndicadores] = useState({
    totalVeiculos: 0,
    veiculosDisponiveis: 0,
    locacoesAtivas: 0,
    faturamento: 0
  });

  const [carregandoIndicadores, setCarregandoIndicadores] = useState(true);

  const itensMenu = [
    { nome: 'Visão geral', icone: LayoutDashboard },
    { nome: 'Veículos', icone: CarFront },
    { nome: 'Locações', icone: ClipboardList },
    { nome: 'Histórico', icone: History }
  ];

  useEffect(() => {
    async function carregarIndicadores() {
      try {
        const token = localStorage.getItem('token');

        const resposta = await axios.get(
          'http://localhost:3000/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setIndicadores(resposta.data);
        setLocacoesRecentes(resposta.data.locacoesRecentes || []);

      } catch (error) {
        console.error('Erro ao carregar indicadores:', error);
      } finally {
        setCarregandoIndicadores(false);
      }
    }

    carregarIndicadores();
  }, []);

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function renderizarConteudo() {
    if (paginaAtiva === 'Visão geral') {
      return (
        <>
          <div className="boas-vindas">
            <div>
              <span>PAINEL DE CONTROLE</span>
              <h2>Olá, {usuario?.nome || 'usuário'}!</h2>
              <p>Acompanhe as informações da sua locadora.</p>
            </div>

            <CarFront size={75} strokeWidth={1.2} />
          </div>

          <div className="indicadores">

            <div className="indicador-card">
              <div className="indicador-icone">
                <CarFront size={23} />
              </div>

              <span>Total de veículos</span>

              <strong>
                {carregandoIndicadores
                  ? '...'
                  : indicadores.totalVeiculos}
              </strong>

              <small>Veículos cadastrados</small>
            </div>

            <div className="indicador-card">
              <div className="indicador-icone">
                <CheckCircle2 size={23} />
              </div>

<div className="dashboard-recentes">
  <div className="dashboard-recentes-topo">
    <div>
      <h2>Locações recentes</h2>
      <p>Últimas movimentações do sistema</p>
    </div>
  </div>

  {locacoesRecentes.length === 0 ? (
    <p className="dashboard-sem-locacoes">
      Nenhuma locação registrada.
    </p>
  ) : (
    <div className="dashboard-recentes-lista">
      {locacoesRecentes.map((locacao) => (
        <div className="dashboard-recente-item" key={locacao.id}>
          <div className="dashboard-recente-icone">
            <CarFront size={21} />
          </div>

          <div className="dashboard-recente-info">
            <strong>
              {locacao.veiculo?.marca} {locacao.veiculo?.modelo}
            </strong>
            <span>
              {locacao.veiculo?.placa} · {locacao.usuario?.nome}
            </span>
          </div>

          <div className="dashboard-recente-valor">
            <strong>
              {formatarMoeda(locacao.valorTotal)}
            </strong>
            <span className={
              locacao.status === 'ATIVA'
                ? 'status-recente ativa'
                : 'status-recente finalizada'
            }>
              {locacao.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


              <span>Disponíveis</span>

              <strong>
                {carregandoIndicadores
                  ? '...'
                  : indicadores.veiculosDisponiveis}
              </strong>

              <small>Prontos para locação</small>
            </div>

            <div className="indicador-card">
              <div className="indicador-icone">
                <Clock3 size={23} />
              </div>

              <span>Locações ativas</span>

              <strong>
                {carregandoIndicadores
                  ? '...'
                  : indicadores.locacoesAtivas}
              </strong>

              <small>Veículos alugados</small>
            </div>

            <div className="indicador-card">
              <div className="indicador-icone">
                <CircleDollarSign size={23} />
              </div>

              <span>Faturamento</span>

              <strong className="valor-indicador">
                {carregandoIndicadores
                  ? '...'
                  : formatarMoeda(indicadores.faturamento)}
              </strong>

              <small>Locações finalizadas</small>
            </div>

          </div>

          <div className="painel-inferior">

            <div className="painel-card">
              <h3>Resumo do sistema</h3>

              <p>
                Acompanhe os dados gerais da sua locadora.
              </p>

              <div className="atividade-vazia">
                <ClipboardList size={32} />
                <span>
                  Utilize o menu para gerenciar suas operações.
                </span>
              </div>
            </div>

            <div className="painel-card">
              <h3>Acesso rápido</h3>

              <p>Escolha uma área para continuar.</p>

              <button onClick={() => setPaginaAtiva('Veículos')}>
                <CarFront size={18} />
                Gerenciar veículos
              </button>

              <button onClick={() => setPaginaAtiva('Locações')}>
                <ClipboardList size={18} />
                Gerenciar locações
              </button>
            </div>

          </div>
        </>
      );
    }

    if (paginaAtiva === 'Veículos') {
      return <Veiculos />;
    }

    if (paginaAtiva === 'Locações') {
  return <Locacoes />;
}

    if (paginaAtiva === 'Locações') {
      return (
        <div className="pagina-em-construcao">
          <div className="pagina-icone">
            <ClipboardList size={38} />
          </div>

          <h2>Gerenciamento de locações</h2>

          <p>
            Esta área será utilizada para registrar e acompanhar
            as locações de veículos.
          </p>
        </div>
      );
    }

if (paginaAtiva === 'Histórico') {
  return <Historico />;
}
  }

  return (
    <div className="dashboard">

      <aside className={`sidebar ${menuAberto ? 'sidebar-aberta' : ''}`}>

        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            V
          </div>

          <div>
            <h2>LOCADORA</h2>
            <span>GESTÃO DE VEÍCULOS</span>
          </div>

        </div>

        <div className="menu-titulo">
          MENU PRINCIPAL
        </div>

        <nav className="menu">

          {itensMenu.map((item) => {
            const Icone = item.icone;

            return (
              <button
                key={item.nome}
                className={
                  paginaAtiva === item.nome
                    ? 'menu-item ativo'
                    : 'menu-item'
                }
                onClick={() => {
                  setPaginaAtiva(item.nome);
                  setMenuAberto(false);
                }}
              >
                <Icone size={19} />
                <span>{item.nome}</span>
              </button>
            );
          })}

        </nav>

        <button className="menu-sair" onClick={onSair}>
          <LogOut size={19} />
          <span>Sair do sistema</span>
        </button>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <button
            className="botao-menu-mobile"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <Menu size={23} />
          </button>

          <div>
            <h1>{paginaAtiva}</h1>

            <p>
              Bem-vindo ao painel de gestão da locadora.
            </p>
          </div>

          <div className="header-usuario">

            <div className="usuario-avatar">
              <UserRound size={20} />
            </div>

            <div>
              <strong>{usuario?.nome || 'Usuário'}</strong>
              <span>Administrador</span>
            </div>

          </div>

        </header>

        <section className="dashboard-content">
          {renderizarConteudo()}
        </section>

        <footer className="dashboard-footer">
          Sistema de Locação de Veículos © 2026
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
