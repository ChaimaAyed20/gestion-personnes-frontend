import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

function App() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Modal
  const [showAdd, setShowAdd] = useState(false);
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');

  const API_BASE = 'http://localhost:8082/gestion-personnes/rest/personnes';

  const loadPersons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setPersons(res.data);
      setError(null);
    } catch (err) {
      setError('Erreur: Vérifiez que le backend est démarré sur port 8082');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !age) return;

    try {
      await axios.put(`${API_BASE}/add/${encodeURIComponent(nom)}/${age}`);
      setNom('');
      setAge('');
      setShowAdd(false);
      loadPersons();
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette personne ?')) return;
    try {
      await axios.delete(`${API_BASE}/remove/${id}`);
      loadPersons();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4 text-primary">Gestion des Personnes</h1>

      <Button variant="success" onClick={() => setShowAdd(true)} className="mb-4">
        Ajouter une personne
      </Button>

      {loading && <Spinner animation="border" className="d-block mx-auto my-4" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive className="shadow">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Âge</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">
                Aucune personne
              </td>
            </tr>
          ) : (
            persons.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.nom}</td>
                <td>{p.age}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une personne</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Âge</Form.Label>
              <Form.Control
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="1"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;