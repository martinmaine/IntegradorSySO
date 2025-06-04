import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { apiService } from '../services/api';

const ListaFormularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarFormularios();
  }, []);

  const cargarFormularios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getFormularios();
      setFormularios(response.formularios);
    } catch (err) {
      setError('Error al cargar los formularios. Verifica que el backend esté funcionando.');
      console.error('Error cargando formularios:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBadgeColor = (materia) => {
    const colores = {
      'SySO': 'primary',
      'Programación 1': 'success',
      'Matemática': 'warning',
      'Organización Empresarial': 'info'
    };
    return colores[materia] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando formularios...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📋 Lista de Formularios</h2>
            <Button onClick={cargarFormularios}>
              🔄 Actualizar
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {formularios.length === 0 ? (
            <Card className="text-center p-5">
              <Card.Body>
                <h4>📝 No hay formularios aún</h4>
                <p className="text-muted">
                  Los formularios enviados aparecerán aquí
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  Total de formularios: <Badge bg="primary">{formularios.length}</Badge>
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive striped hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Estudiante</th>
                      <th>Materia</th>
                      <th>Comisión</th>
                      <th>Tema</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formularios.map((formulario) => (
                      <tr key={formulario.id}>
                        <td>
                          <Badge bg="secondary">{formulario.id}</Badge>
                        </td>
                        <td>
                          <strong>{formulario.nombre} {formulario.apellido}</strong>
                        </td>
                        <td>
                          <Badge bg={getBadgeColor(formulario.materia)}>
                            {formulario.materia}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="outline-dark">{formulario.comision}</Badge>
                        </td>
                        <td>
                          <div style={{ maxWidth: '200px' }}>
                            {formulario.tema_elegido.length > 50 
                              ? `${formulario.tema_elegido.substring(0, 50)}...`
                              : formulario.tema_elegido
                            }
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatearFecha(formulario.fecha_creacion)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListaFormularios;