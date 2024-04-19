import React, { useEffect, useState } from 'react';
import './App.css';
import pacienteService from './services/pacienteService';
import { Paciente } from './entities/Paciente';
import { format } from 'date-fns';
import { FaSearch } from 'react-icons/fa'

function App() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filtroNome, setFiltroNome] = useState<string>('');

  const carregarPacientes = async () => {
    let data;
    if (filtroNome != '') {
      try{
        data = await pacienteService.listarPorNome(filtroNome);
      }
      catch{
        data = await pacienteService.listar();
      }
    } else {
      data = await pacienteService.listar();
    }
    setPacientes(data);
    console.log(data);
  };

  useEffect(() => {
    carregarPacientes();
  }, [filtroNome]);


  const handleFiltroNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try{
      setFiltroNome(event.target.value);
    }
    catch{
      return setFiltroNome('');
    }

  };
  return (

    <div className="container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={handleFiltroNomeChange}
        />
      </div>
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
            <tr key={paciente.id}>
              <td>{paciente.id}</td>
              <td>{paciente.name}</td>
              <td>{format(new Date(paciente.birthDate), 'yyyy/MM/dd')}</td>
              <td>{paciente.cpf}</td>
              <td>{paciente.gender && paciente.gender === "m" ? "Masculino" : "Feminino"}</td>
              <td>{paciente.adress}</td>
              <td>{paciente.status ? 'Ativo' : 'Inativo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;