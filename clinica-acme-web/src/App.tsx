import React, { useEffect, useState } from 'react';
import './App.css';
import pacienteService from './services/pacienteService';
import { Paciente } from './entities/Paciente';
import { format, set } from 'date-fns';
import { cpf } from 'cpf-cnpj-validator';
import { AxiosError } from 'axios';

function App() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [novoPaciente, setNovoPaciente] = useState<Paciente>({ name: '', birthDate: '', cpf: '', gender: '', address: '', status: true });
  const [edicaoPaciente, setEdicaoPaciente] = useState<Paciente>({ name: '', birthDate: '', cpf: '', gender: '', address: '', status: true });
  const [visulizarPaciente, setvisulizarPaciente] = useState<Paciente>({ name: '', birthDate: '', cpf: '', gender: '', address: '', status: true });
  const [deletePaciente, setDeletePaciente] = useState<number | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showEditForm, setEditForm] = useState<boolean>(false);
  const [showViewForm, setShowViewForm] = useState<boolean>(false);
  const [linhaFocada, setLinhaFocada] = useState<number>();
  const [error, setError] = useState<{ name: string; birthDate: string; cpf: string; gender: string; address: string }>({ name: '', birthDate: '', cpf: '', gender: '', address: '' });
  const [errorEdit, setErrorEdit] = useState<{ name: string; birthDate: string; cpf: string; gender: string; address: string }>({ name: '', birthDate: '', cpf: '', gender: '', address: '' });
  const carregarPacientes = async () => {
    let data;
    if (filtroNome != '') {
      try {
        data = await pacienteService.listarPorNome(filtroNome);
      }
      catch {
        data = await pacienteService.listar();
      }
    } else {
      data = await pacienteService.listar();
    }
    setPacientes(data);
  };

  useEffect(() => {
    carregarPacientes();
  }, [filtroNome]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    let newValue: string | boolean; // Definindo o tipo explicitamente

    if (type === 'checkbox') {
      newValue = (event.target as HTMLInputElement).checked;
    } else {
      newValue = value.toLowerCase(); // Normalizar o valor para minúsculas apenas para inputs/selects que não são checkboxes
    }
    setNovoPaciente(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleInputChangeEdit = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    let newValue: string | boolean; // Definindo o tipo explicitamente

    if (type === 'checkbox') {
      newValue = (event.target as HTMLInputElement).checked;
    } else {
      newValue = value.toLowerCase(); // Normalizar o valor para minúsculas apenas para inputs/selects que não são checkboxes
    }

    setEdicaoPaciente(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };
  const handleFiltroNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setFiltroNome(event.target.value);
    }
    catch {
      return setFiltroNome('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const initialErrors = {
      name: '',
      birthDate: '',
      cpf: '',
      gender: '',
      address: ''
    };


    initialErrors.name = novoPaciente.name === '' || novoPaciente.name === null || String(novoPaciente.name).trim() === '' ? "Campo nome é de preenchimento obrigatório." : "";

    initialErrors.birthDate =
      novoPaciente.birthDate === '' || novoPaciente.birthDate === null ? "Campo data de nascimento é de preenchimento obrigatório." : ''
        || Date.parse(novoPaciente.birthDate) > Date.now() ? "A data de nascimento não pode ser maior que a data atual." : '';

    initialErrors.cpf = novoPaciente.cpf === '' || novoPaciente.cpf === null ? "Campo CPF é de preenchimento obrigatório." : ''
      || !cpf.isValid(novoPaciente.cpf) ? "CPF inválido." : '';

    initialErrors.gender = novoPaciente.gender === '' || novoPaciente.gender === null ? "Campo sexo é de preenchimento obrigatório." : "";

    setError(initialErrors);

    if (Object.values(initialErrors).every(error => error === '')) {
      try {
        await pacienteService.cadastrar(novoPaciente);
        setNovoPaciente({
          name: '',
          birthDate: '',
          cpf: '',
          gender: '',
          address: '',
          status: true
        });
        carregarPacientes();
        setShowForm(false);

      } catch (error) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        const errorMessage = (responseData as { Message?: string })?.Message;

        const cpfInvalido = {
          name: '',
          birthDate: '',
          cpf: '',
          gender: '',
          address: ''
        };

        cpfInvalido.cpf = errorMessage?.toString() || '';
        setError(cpfInvalido);
      }

    }
  };
  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const initialErrors = {
      name: '',
      birthDate: '',
      cpf: '',
      gender: '',
      address: ''
    };

    initialErrors.name = edicaoPaciente.name === '' || edicaoPaciente.name === null || String(edicaoPaciente.name).trim() === '' ? "Campo nome é de preenchimento obrigatório." : "";

    initialErrors.birthDate =
    edicaoPaciente.birthDate === '' || edicaoPaciente.birthDate === null ? "Campo data de nascimento é de preenchimento obrigatório." : ''
        || Date.parse(edicaoPaciente.birthDate) > Date.now() ? "A data de nascimento não pode ser maior que a data atual." : '';

    initialErrors.cpf = edicaoPaciente.cpf === '' || edicaoPaciente.cpf === null ? "Campo CPF é de preenchimento obrigatório." : ''
      || !cpf.isValid(edicaoPaciente.cpf) ? "CPF inválido." : '';

    initialErrors.gender = edicaoPaciente.gender === '' || edicaoPaciente.gender === null ? "Campo sexo é de preenchimento obrigatório." : "";

    setErrorEdit(initialErrors);

    if (Object.values(initialErrors).every(error => error === '')) {

      const cpfInvalido = {
        name: '',
        birthDate: '',
        cpf: '',
        gender: '',
        address: ''
      };
      try {
        await pacienteService.editar(edicaoPaciente);
        setErrorEdit(cpfInvalido);
        carregarPacientes();
        setEditForm(false);
      } catch (error) {

        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        const errorMessage = (responseData as { Message?: string })?.Message;
        cpfInvalido.cpf = errorMessage?.toString() || '';
        setErrorEdit(cpfInvalido);
      }
    }
  };

  const handleDelete = async () => {
    await pacienteService.delete(deletePaciente);
    setShowDeleteModal(false);
    carregarPacientes();
  };
  const handleRowClick = (paciente: Paciente) => {
    setLinhaFocada(paciente.id);

    const formattedBirthDate = format(new Date(paciente.birthDate), 'yyyy-MM-dd');
    const pacienteEditado = { ...paciente, birthDate: formattedBirthDate };
    setEdicaoPaciente(pacienteEditado);
    setvisulizarPaciente(pacienteEditado);
    setDeletePaciente(pacienteEditado.id);
  };

  const handleEditButtonClick = () => {
    setEditForm(true);
  };

  const handleExitEditFormClick = () => 
  {
    setErrorEdit({
      name: '',
      birthDate: '',
      cpf: '',
      gender: '',
      address: ''
    });
    setEdicaoPaciente(visulizarPaciente)
    setEditForm(false)
  }
  const handleExitIncludeFormClick = () => 
    {
      setNovoPaciente({
        name: '',
        birthDate: '',
        cpf: '',
        gender: '',
        address: '',
        status: true
      });
      setError({
        name: '',
        birthDate: '',
        cpf: '',
        gender: '',
        address: ''
      });
      setShowForm(false)
    }
  return (

    <div className="container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={handleFiltroNomeChange}
        />
        <div className="buttons-grid">
          <button className="create-button" onClick={() => setShowForm(true)}>Incluir</button>
          <button className="edit-button" onClick={() => handleEditButtonClick()}>Editar</button>
          <button className="delete-button" onClick={() => deletePaciente === undefined ? setShowDeleteModal(false) : setShowDeleteModal(true)}>Excluir</button>
          <button className="view-button" onClick={() => visulizarPaciente.name == '' ? setShowViewForm(false) : setShowViewForm(true)}>Visualizar</button>
        </div>
      </div>
      {/* Modal de Exclusão */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
            <h2>Confirmar exclusão?</h2>
            <div className="form-group">
              <button className="delete-button" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de inclusão */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => handleExitIncludeFormClick()}>&times;</span>
            <form className="form" onSubmit={handleSubmit}>
              <h2>Incluir Paciente</h2>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={novoPaciente.status}
                    onChange={handleInputChange}
                  />
                  Ativo
                </label>
              </div>
              <div className="form-group">
                <label>Nome:</label>
                <input type="text" name="name" maxLength={150} value={novoPaciente.name} onChange={handleInputChange} />
                {error && <p style={{ color: 'red' }}>{error.name}</p>}
              </div>
              <div className="form-group">
                <label>Data de Nascimento:</label>
                <input type="date" name="birthDate" value={novoPaciente.birthDate} onChange={handleInputChange} />
                {error && <p style={{ color: 'red' }}>{error.birthDate}</p>}
              </div>
              <div className="form-group">
                <label>CPF:</label>
                <input type="text" name="cpf" maxLength={11} value={novoPaciente.cpf} onChange={handleInputChange} />
                {error && <p style={{ color: 'red' }}>{error.cpf}</p>}
              </div>
              <div className="form-group">
                <label>Sexo:</label>
                <select name="gender" value={novoPaciente.gender} onChange={handleInputChange}>
                  <option value="">Selecione</option>
                  <option value="m">Masculino</option>
                  <option value="f">Feminino</option>
                </select>
                {error && <p style={{ color: 'red' }}>{error.gender}</p>}
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input type="text" name="address" maxLength={255} value={novoPaciente.address} onChange={handleInputChange} />
              </div>
              <button type="submit" className="create-button">Adicionar Paciente</button>
            </form>
          </div>
        </div>
      )}
      {/* Modal de edição */}
      {showEditForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => handleExitEditFormClick()}>&times;</span>
            <form className="form" onSubmit={handleSubmitEdit}>
              <h2>Editar Paciente</h2>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={edicaoPaciente.status}
                    onChange={handleInputChangeEdit}
                  />
                  Ativo
                </label>
              </div>
              <div className="form-group">
                <label>Id:</label>
                <input
                  type="text"
                  name="id"
                  readOnly
                  value={edicaoPaciente.id}
                  style={{ backgroundColor: '#f2f2f2' }}
                />
              </div>
              <div className="form-group">
                <label>Nome:</label>
                <input type="text" name="name" maxLength={150} value={edicaoPaciente.name} onChange={handleInputChangeEdit} />
                {errorEdit && <p style={{ color: 'red' }}>{errorEdit.name}</p>}
              </div>
              <div className="form-group">
                <label>Data de Nascimento:</label>
                <input type="date" name="birthDate" value={edicaoPaciente.birthDate} onChange={handleInputChangeEdit} />
                {errorEdit && <p style={{ color: 'red' }}>{errorEdit.birthDate}</p>}
              </div>
              <div className="form-group">
                <label>CPF:</label>
                <input type="text" name="cpf" maxLength={11} value={edicaoPaciente.cpf} onChange={handleInputChangeEdit} />
                {errorEdit && <p style={{ color: 'red' }}>{errorEdit.cpf}</p>}
              </div>
              <div className="form-group">
                <label>Sexo:</label>
                <select name="gender" value={edicaoPaciente.gender} onChange={handleInputChangeEdit}>
                  <option value="">Selecione</option>
                  <option value="m">Masculino</option>
                  <option value="f">Feminino</option>
                </select>
                {errorEdit && <p style={{ color: 'red' }}>{errorEdit.gender}</p>}
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input type="text" name="address" maxLength={255} value={edicaoPaciente.address} onChange={handleInputChangeEdit} />
              </div>
              <button type="submit" className="create-button">Adicionar Paciente</button>
            </form>
          </div>
        </div>
      )}
      {/* Modal de visualização */}
      {showViewForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowViewForm(false)}>&times;</span>
            <form className="form" onSubmit={handleSubmitEdit}>
              <h2>Editar Paciente</h2>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    disabled
                    checked={novoPaciente.status}
                    onChange={handleInputChangeEdit}
                  />
                  Ativo
                </label>
              </div>
              <div className="form-group">
                <label>Id:</label>
                <input
                  type="text"
                  name="id"
                  readOnly
                  value={edicaoPaciente.id}
                  style={{ backgroundColor: '#f2f2f2' }}
                />
              </div>
              <div className="form-group">
                <label>Nome:</label>
                <input type="text"
                  name="name"
                  readOnly
                  value={visulizarPaciente.name}
                  style={{ backgroundColor: '#f2f2f2' }} />
              </div>
              <div className="form-group">
                <label>Data de Nascimento:</label>
                <input type="date"
                  name="birthDate"
                  readOnly
                  value={visulizarPaciente.birthDate}
                  style={{ backgroundColor: '#f2f2f2' }} />
              </div>
              <div className="form-group">
                <label>CPF:</label>
                <input type="text"
                  name="cpf"
                  readOnly
                  value={visulizarPaciente.cpf}
                  style={{ backgroundColor: '#f2f2f2' }} />
              </div>
              <div className="form-group">
                <label>Sexo:</label>
                <select name="gender" value={visulizarPaciente.gender} disabled>
                  <option value="">Selecione</option>
                  <option value="m">Masculino</option>
                  <option value="f">Feminino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input type="text"
                  name="address"
                  readOnly
                  value={visulizarPaciente.address}
                  style={{ backgroundColor: '#f2f2f2' }} />
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="pacientes-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>CPF</th>
            <th>Sexo</th>
            <th>Endereço</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(paciente => (

            <tr key={paciente.id} onClick={() => handleRowClick(paciente)} style={{ backgroundColor: linhaFocada === paciente.id ? '#e0ffe0' : 'transparent' }}>
              <td>{paciente.id}</td>
              <td>{paciente.name}</td>
              <td>{format(new Date(paciente.birthDate), 'dd/MM/yyyy')}</td>
              <td>{paciente.cpf}</td>
              <td>{paciente.gender && paciente.gender === "m" ? "Masculino" : "Feminino"}</td>
              <td>{paciente.address}</td>
              <td>{paciente.status ? 'Ativo' : 'Inativo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;