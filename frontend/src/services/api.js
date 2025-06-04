import axios from 'axios';

// URL base del backend (Docker)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de la API
export const apiService = {
  // Obtener todas las materias
  getMaterias: async () => {
    try {
      const response = await api.get('/materias');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo materias:', error);
      throw error;
    }
  },

  // Crear nuevo formulario
  crearFormulario: async (formularioData) => {
    try {
      const response = await api.post('/formularios', formularioData);
      return response.data;
    } catch (error) {
      console.error('Error creando formulario:', error);
      throw error;
    }
  },

  // Obtener todos los formularios
  getFormularios: async () => {
    try {
      const response = await api.get('/formularios');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo formularios:', error);
      throw error;
    }
  },

  // Verificar estado del backend
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error en health check:', error);
      throw error;
    }
  }
};

export default api;