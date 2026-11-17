
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  RotateCcw
} from 'lucide-react';
import './Locacoes.css';

function Locacoes() {
  const [veiculos, setVeiculos] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [veiculoId, setVeiculoId] = useState('');
  const [dataPrevisaoDevolucao, setDataPrevisaoDevolucao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  async function carregarDados() {
    try {
      const [respostaVeiculos, respostaLocacoes] = await Promise.all([
        axios.get('http://localhost:3000/veiculos', config),
        axios.get('http://localhost:3000/locacoes/minhas', config)
      ]);

      setVeiculos(respostaVeiculos.data);
      setLocacoes(respostaLocacoes.data);
    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Erro ao carregar os dados das locações.'
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function realizarLocacao(event) {
    event.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      await axios.post(
        'http://localhost:3000/locacoes',
        {
          veiculoId: Number(veiculoId),
          dataPrevisaoDevolucao
        },
        config
      );

      setMensagem('Locação realizada com sucesso!');
      setVeiculoId('');
      setDataPrevisaoDevolucao('');

      await carregarDados();
    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Não foi possível realizar a locação.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function devolverVeiculo(locacaoId) {
    const confirmar = window.confirm(
      'Deseja realmente devolver este veículo?'
    );

    if (!confirmar) return;

    setMensagem('');

    try {
      await axios.patch(
        `http://localhost:3000/locacoes/${locacaoId}/devolucao`,
        {},
        config
      );

      setMensagem('Veículo devolvido com sucesso!');
      await carregarDados();
    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Não foi possível devolver o veículo.'
      );
    }
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function formatarData(data) {
    if (!data) return '-';

    return new Date(data).toLocaleDateString('pt-BR');
  }

  const veiculosDisponiveis = veiculos.filter(
    (veiculo) => veiculo.disponibilidade
  );

  return (
    <div className="locacoes-container">

      <div className="locacoes-topo">
        <div>
          <h1>Locações</h1>
          <p>Gerencie as locações e devoluções de veículos.</p>
        </div>
      </div>

      {mensagem && (
        <div className="locacoes-mensagem">
          {mensagem}
        </div>
      )}

      <div className="locacoes-form-card">
        <div className="locacoes-card-titulo">
          <CarFront size={22} />
          <h2>Nova locação</h2>
        </div>

        <form onSubmit={realizarLocacao}>
          <div className="locacoes-form-grid">

            <div className="locacoes-campo">
              <label>Selecione o veículo</label>

              <select
                value={veiculoId}
                onChange={(event) => setVeiculoId(event.target.value)}
                required
              >
                <option value="">Escolha um veículo</option>

                {veiculosDisponiveis.map((veiculo) => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="locacoes-campo">
              <label>Previsão de devolução</label>

              <input
                type="datetime-local"
                value={dataPrevisaoDevolucao}
                onChange={(event) =>
                  setDataPrevisaoDevolucao(event.target.value)
                }
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="locacoes-botao"
            disabled={carregando || veiculosDisponiveis.length === 0}
          >
            {carregando ? 'Processando...' : 'Confirmar locação'}
          </button>

          {veiculosDisponiveis.length === 0 && (
            <p className="locacoes-aviso">
              Não existem veículos disponíveis no momento.
            </p>
          )}
        </form>
      </div>

      <div className="locacoes-lista-card">
        <div className="locacoes-card-titulo">
          <Clock3 size={22} />
          <h2>Minhas locações</h2>
        </div>

        {locacoes.length === 0 ? (
          <div className="locacoes-vazio">
            <CalendarDays size={38} />
            <p>Você ainda não possui locações.</p>
          </div>
        ) : (
          <div className="locacoes-tabela-area">
            <table className="locacoes-tabela">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Placa</th>
                  <th>Início</th>
                  <th>Devolução prevista</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>

              <tbody>
                {locacoes.map((locacao) => (
                  <tr key={locacao.id}>
                    <td>
                      {locacao.veiculo?.marca} {locacao.veiculo?.modelo}
                    </td>

                    <td>{locacao.veiculo?.placa}</td>

                    <td>{formatarData(locacao.dataInicio)}</td>

                    <td>
                      {formatarData(locacao.dataPrevisaoDevolucao)}
                    </td>

                    <td>{formatarMoeda(locacao.valorTotal)}</td>

                    <td>
                      <span
                        className={
                          locacao.status === 'ATIVA'
                            ? 'locacoes-status ativa'
                            : 'locacoes-status finalizada'
                        }
                      >
                        {locacao.status}
                      </span>
                    </td>

                    <td>
                      {locacao.status === 'ATIVA' ? (
                        <button
                          className="locacoes-devolver"
                          onClick={() => devolverVeiculo(locacao.id)}
                        >
                          <RotateCcw size={15} />
                          Devolver
                        </button>
                      ) : (
                        <span className="locacoes-concluida">
                          <CheckCircle2 size={16} />
                          Concluída
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Locacoes;