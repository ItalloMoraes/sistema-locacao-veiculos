
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  History,
  CarFront,
  CalendarDays,
  CircleDollarSign,
  CheckCircle2
} from 'lucide-react';
import './Historico.css';

function Historico() {
  const [locacoes, setLocacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  async function carregarHistorico() {
    try {
      const token = localStorage.getItem('token');

      const resposta = await axios.get(
        'http://localhost:3000/locacoes/minhas',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const finalizadas = resposta.data.filter(
        (locacao) => locacao.status === 'FINALIZADA'
      );

      setLocacoes(finalizadas);
    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Erro ao carregar o histórico de locações.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  function formatarData(data) {
    if (!data) return '-';

    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  const faturamentoHistorico = locacoes.reduce(
    (total, locacao) => total + Number(locacao.valorTotal),
    0
  );

  return (
    <div className="historico-container">

      <div className="historico-topo">
        <div>
          <h1>Histórico de Locações</h1>
          <p>Consulte todas as locações finalizadas.</p>
        </div>
      </div>

      {mensagem && (
        <div className="historico-mensagem">
          {mensagem}
        </div>
      )}

      <div className="historico-resumo">

        <div className="historico-resumo-card">
          <div className="historico-icone">
            <History size={23} />
          </div>

          <div>
            <span>Total de locações</span>
            <strong>{locacoes.length}</strong>
          </div>
        </div>

        <div className="historico-resumo-card">
          <div className="historico-icone">
            <CircleDollarSign size={23} />
          </div>

          <div>
            <span>Valor das locações finalizadas</span>
            <strong>{formatarMoeda(faturamentoHistorico)}</strong>
          </div>
        </div>

      </div>

      <div className="historico-lista-card">

        <div className="historico-card-titulo">
          <CarFront size={22} />
          <h2>Locações finalizadas</h2>
        </div>

        {carregando ? (
          <div className="historico-vazio">
            Carregando histórico...
          </div>
        ) : locacoes.length === 0 ? (
          <div className="historico-vazio">
            <CalendarDays size={38} />
            <p>Nenhuma locação finalizada encontrada.</p>
          </div>
        ) : (
          <div className="historico-tabela-area">
            <table className="historico-tabela">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Placa</th>
                  <th>Data da locação</th>
                  <th>Data da devolução</th>
                  <th>Valor total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {locacoes.map((locacao) => (
                  <tr key={locacao.id}>
                    <td>
                      {locacao.veiculo?.marca}{' '}
                      {locacao.veiculo?.modelo}
                    </td>

                    <td>{locacao.veiculo?.placa}</td>

                    <td>{formatarData(locacao.dataInicio)}</td>

                    <td>{formatarData(locacao.dataDevolucao)}</td>

                    <td className="historico-valor">
                      {formatarMoeda(locacao.valorTotal)}
                    </td>

                    <td>
                      <span className="historico-status">
                        <CheckCircle2 size={14} />
                        Finalizada
                      </span>
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

export default Historico;
