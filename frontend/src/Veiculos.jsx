
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus,
  CarFront,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import './Veiculos.css';

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [busca, setBusca] = useState('');

  const [formulario, setFormulario] = useState({
    marca: '',
    modelo: '',
    placa: '',
    ano: '',
    diaria: ''
  });

  async function carregarVeiculos() {
    try {
      const token = localStorage.getItem('token');

      const resposta = await axios.get(
        'http://localhost:3000/veiculos',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setVeiculos(resposta.data);
    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Erro ao carregar veículos.'
      );
    }
  }

  useEffect(() => {
    let ativo = true;

    async function buscarVeiculos() {
      try {
        const token = localStorage.getItem('token');

        const resposta = await axios.get(
          'http://localhost:3000/veiculos',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (ativo) {
          setVeiculos(resposta.data);
        }
      } catch (error) {
        if (ativo) {
          setMensagem(
            error.response?.data?.mensagem ||
            'Erro ao carregar veículos.'
          );
        }
      }
    }

    buscarVeiculos();

    return () => {
      ativo = false;
    };
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function cadastrarVeiculo(event) {
    event.preventDefault();

    setMensagem('');
    setCarregando(true);

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:3000/veiculos',
        {
          ...formulario,
          ano: Number(formulario.ano),
          diaria: Number(formulario.diaria)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMensagem('Veículo cadastrado com sucesso!');

      setFormulario({
        marca: '',
        modelo: '',
        placa: '',
        ano: '',
        diaria: ''
      });

      setMostrarFormulario(false);

      await carregarVeiculos();

    } catch (error) {
      setMensagem(
        error.response?.data?.mensagem ||
        'Não foi possível cadastrar o veículo.'
      );
    } finally {
      setCarregando(false);
    }
  }

  const veiculosFiltrados = veiculos.filter((veiculo) => {
    const termo = busca.toLowerCase();

    return (
      veiculo.marca.toLowerCase().includes(termo) ||
      veiculo.modelo.toLowerCase().includes(termo) ||
      veiculo.placa.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="veiculos-container">

      <div className="veiculos-topo">
        <div>
          <h2>Gerenciamento de veículos</h2>
          <p>Cadastre e acompanhe os veículos da locadora.</p>
        </div>

        <button
          className="botao-novo-veiculo"
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setMensagem('');
          }}
        >
          <Plus size={19} />
          Novo veículo
        </button>
      </div>

      {mensagem && (
        <div className="mensagem-veiculo">
          {mensagem}
        </div>
      )}

      {mostrarFormulario && (
        <form
          className="formulario-veiculo"
          onSubmit={cadastrarVeiculo}
        >
          <h3>Novo veículo</h3>

          <div className="campos-veiculo">

            <div>
              <label>Marca</label>
              <input
                name="marca"
                value={formulario.marca}
                onChange={atualizarCampo}
                placeholder="Ex.: Toyota"
                required
              />
            </div>

            <div>
              <label>Modelo</label>
              <input
                name="modelo"
                value={formulario.modelo}
                onChange={atualizarCampo}
                placeholder="Ex.: Corolla"
                required
              />
            </div>

            <div>
              <label>Placa</label>
              <input
                name="placa"
                value={formulario.placa}
                onChange={atualizarCampo}
                placeholder="Ex.: ABC1234"
                maxLength={7}
                required
              />
            </div>

            <div>
              <label>Ano</label>
              <input
                type="number"
                name="ano"
                value={formulario.ano}
                onChange={atualizarCampo}
                placeholder="Ex.: 2024"
                required
              />
            </div>

            <div>
              <label>Diária (R$)</label>
              <input
                type="number"
                name="diaria"
                value={formulario.diaria}
                onChange={atualizarCampo}
                placeholder="Ex.: 180.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

          </div>

          <div className="acoes-formulario">
            <button
              type="button"
              className="botao-cancelar"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="botao-salvar"
              disabled={carregando}
            >
              {carregando ? 'Salvando...' : 'Salvar veículo'}
            </button>
          </div>

        </form>
      )}

      <div className="veiculos-lista-topo">
        <div>
          <h3>Veículos cadastrados</h3>
          <span>{veiculos.length} veículo(s) no sistema</span>
        </div>

        <div className="campo-busca">
          <Search size={18} />
          <input
            placeholder="Buscar veículo..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>
      </div>

      <div className="tabela-veiculos">

        <table>
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Placa</th>
              <th>Ano</th>
              <th>Diária</th>
              <th>Disponibilidade</th>
            </tr>
          </thead>

          <tbody>
            {veiculosFiltrados.map((veiculo) => (
              <tr key={veiculo.id}>
                <td>
                  <div className="veiculo-identificacao">
                    <div className="veiculo-icone">
                      <CarFront size={21} />
                    </div>

                    <div>
                      <strong>
                        {veiculo.marca} {veiculo.modelo}
                      </strong>
                      <small>ID: {veiculo.id}</small>
                    </div>
                  </div>
                </td>

                <td>{veiculo.placa}</td>
                <td>{veiculo.ano}</td>

                <td>
                  {Number(veiculo.diaria).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>

                <td>
                  {veiculo.disponibilidade ? (
                    <span className="status-disponivel">
                      <CheckCircle2 size={15} />
                      Disponível
                    </span>
                  ) : (
                    <span className="status-indisponivel">
                      <XCircle size={15} />
                      Alugado
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {veiculosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="veiculos-vazio">
                  Nenhum veículo encontrado.
                </td>
              </tr>
            )}

          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Veiculos;
