import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './FormularioEstudiante.css'; 

const FormularioEstudiante = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    materia: '',
    comision: '',
    tema_elegido: ''
  });

  // Estados de la UI
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [loadingMaterias, setLoadingMaterias] = useState(true);

  // Cargar materias al montar componente
  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      setLoadingMaterias(true);
      const response = await apiService.getMaterias();
      setMaterias(response.materias);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      mostrarMensaje('danger', 'Error al cargar las materias. Verifica que el backend esté funcionando.');
    } finally {
      setLoadingMaterias(false);
    }
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mostrar mensaje temporal
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 5000);
  };

  // Validar formulario
  const validarFormulario = () => {
    const { nombre, apellido, materia, comision, tema_elegido } = formData;
    
    if (!nombre.trim()) {
      mostrarMensaje('warning', 'El nombre es requerido');
      return false;
    }
    
    if (!apellido.trim()) {
      mostrarMensaje('warning', 'El apellido es requerido');
      return false;
    }
    
    if (!materia) {
      mostrarMensaje('warning', 'Debes seleccionar una materia');
      return false;
    }
    
    if (!comision.trim()) {
      mostrarMensaje('warning', 'La comisión es requerida');
      return false;
    }
    
    if (!tema_elegido.trim()) {
      mostrarMensaje('warning', 'El tema elegido es requerido');
      return false;
    }
    
    return true;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);
      await apiService.crearFormulario(formData);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        materia: '',
        comision: '',
        tema_elegido: ''
      });
      
      mostrarMensaje('success', '¡Formulario enviado exitosamente!');
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Error al enviar el formulario';
      mostrarMensaje('danger', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-wrapper">
        <div className="formulario-card">
          {/* Header */}
          <div className="formulario-header">
            <div className="header-icon">📚</div>
            <h2 className="header-title">Formulario Estudiantil</h2>
            <p className="header-subtitle">Arquitectura y Sistemas Operativos</p>
          </div>

          {/* Body */}
          <div className="formulario-body">
            {/* Mostrar mensajes */}
            {mensaje.texto && (
              <div className={`alert alert-${mensaje.tipo}`}>
                <div className="alert-icon">
                  {mensaje.tipo === 'success' && '✅'}
                  {mensaje.tipo === 'danger' && '❌'}
                  {mensaje.tipo === 'warning' && '⚠️'}
                </div>
                <span className="alert-text">{mensaje.texto}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              {/* Nombre y Apellido */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    disabled={loading}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido"
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Materia */}
              <div className="form-group">
                <label className="form-label">Materia *</label>
                {loadingMaterias ? (
                  <div className="loading-materias">
                    <div className="spinner"></div>
                    <span>Cargando materias...</span>
                  </div>
                ) : (
                  <select
                    name="materia"
                    value={formData.materia}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-select"
                  >
                    <option value="">Selecciona una materia</option>
                    {materias.map((materia, index) => (
                      <option key={index} value={materia}>
                        {materia}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Comisión */}
              <div className="form-group">
                <label className="form-label">Comisión *</label>
                <input
                  type="text"
                  name="comision"
                  value={formData.comision}
                  onChange={handleChange}
                  placeholder="Ej: 01, 06, 24, etc."
                  disabled={loading}
                  className="form-input"
                />
                <small className="form-help">
                  Ingresa tu comisión (ejemplo: 1K1, 2K2)
                </small>
              </div>

              {/* Tema Elegido */}
              <div className="form-group">
                <label className="form-label">Tema Elegido *</label>
                <textarea
                  rows={4}
                  name="tema_elegido"
                  value={formData.tema_elegido}
                  onChange={handleChange}
                  placeholder="Describe el tema que elegiste para tu trabajo..."
                  disabled={loading}
                  className="form-textarea"
                />
                <small className="form-help">
                  Explica brevemente el tema de tu trabajo integrador
                </small>
              </div>

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={loading || loadingMaterias}
                className={`submit-button ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span className="button-icon">📤</span>
                    <span>Enviar Formulario</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="formulario-footer">
            <small>Los campos marcados con * son obligatorios</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioEstudiante;