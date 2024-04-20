import axios from "axios";
import { Paciente } from "../entities/Paciente"; 

const pacienteService = {
  listar: async () => {
    const response = await axios.get('https://localhost:7208/api/GetAllPatient');
    return response.data;
  },
  
  listarPorNome: async (name:string) => {
        const response = await axios.get(`https://localhost:7208/api/GetAllPatient?name=${name}`);
        return response.data;
      },
  cadastrar: async (paciente: Paciente) => {
    const response = await axios.post(`https://localhost:7208/api/CreatePatient`,paciente);
    return response.data;
  },

  editar: async (paciente: Paciente) => {
    const response = await axios.put(`https://localhost:7208/api/UpdatePatient/${paciente.id}`, paciente);
    return response.data;
  },
  delete: async (pacienteId: number | undefined) => {
    await axios.delete(`https://localhost:7208/api/DeletePatient/${pacienteId}`);
  }
};

export default pacienteService;