import axios from "axios";


const pacienteService = {
  listar: async () => {
    const response = await axios.get('https://localhost:7208/api/GetAllPatient');
    return response.data;
  },
  
  listarPorNome: async (name:string) => {
        const response = await axios.get(`https://localhost:7208/api/GetAllPatient?name=${name}`);
        return response.data;
      },
//   cadastrar: async (paciente) => {
//     const response = await axios.post(API_URL, paciente);
//     return response.data;
//   },
//   editar: async (id, paciente) => {
//     const response = await axios.put(`${API_URL}/${id}`, paciente);
//     return response.data;
//   },
//   inativar: async (id) => {
//     await axios.delete(`${API_URL}/${id}`);
//   }
};

export default pacienteService;