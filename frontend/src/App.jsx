import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import FormularioEstudiante from './components/FormularioEstudiante.jsx';
import ListaFormularios from './components/ListaFormularios.jsx';
import './App.css'; // Importar estilos del header

function App() {
  const [activeTab, setActiveTab] = useState('formulario');

  return (
    <div className="App">
      {/* Header personalizado */}
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">Sistema de formulario para estudiantes</h1>
          <img 
            src="/src/assets/utn.svg" 
            alt="UTN Logo" 
            className="utn-logo"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <div className="tabs-container">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <div>
              <div className="formulario-container">
                <FormularioEstudiante />
              </div>
            </div>
            
            <div>
              <div className="lista-formularios-container">
                <div className="lista-formularios-wrapper">
                  <ListaFormularios />
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <small>
          💻 Aplicación desarrollada con React + Python + MySQL + Docker
        </small>
      </footer>
    </div>
  );
}

export default App;