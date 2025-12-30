import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup
} from 'react-bootstrap';
import './AppTheme.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNom, setSearchNom] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [editPerson, setEditPerson] = useState({ id: '', nom: '', age: '' });
  const [addNom, setAddNom] = useState('');
  const [addAge, setAddAge] = useState('');

  const API_BASE = 'http://localhost:8082/gestion-personnes/rest/personnes';

  const loadPersons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setPersons(res.data);
      setFilteredPersons(res.data);
      setError(null);
    } catch {
      setError('Erreur de connexion au backend. Vérifiez Tomcat (8082).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  useEffect(() => {
    setFilteredPersons(
      persons.filter(p =>
        p.nom.toLowerCase().includes(searchNom.toLowerCase())
      )
    );
  }, [searchNom, persons]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/add/${encodeURIComponent(addNom)}/${addAge}`);
      setAddNom('');
      setAddAge('');
      setShowAdd(false);
      loadPersons();
    } catch {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE}/update/${editPerson.id}/${encodeURIComponent(
          editPerson.nom
        )}/${editPerson.age}`
      );
      setShowEdit(false);
      loadPersons();
    } catch {
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette personne ?')) return;
    try {
      await axios.delete(`${API_BASE}/remove/${id}`);
      loadPersons();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const openEditModal = (p) => {
    setEditPerson({ id: p.id, nom: p.nom, age: p.age });
    setShowEdit(true);
  };

  return (
    <div className="page-center">
      <div className="app-wrapper glass-container">

        <h1 className="app-title display-4 fw-bold mb-2">
          Gestion des Personnes
        </h1>

        <p className="text-center text-light mb-4 fs-5">
          👥 Total : <strong>{persons.length}</strong> personnes
        </p>

        <div className="actions-row mb-4">
          <Button variant="success" size="lg" onClick={() => setShowAdd(true)}>
            ➕ Ajouter
          </Button>

          <InputGroup style={{ maxWidth: 850 }}>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par nom..."
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
            />
          </InputGroup>
        </div>

        {loading && (
          <Spinner animation="border" className="d-block mx-auto my-5" />
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-container shadow-lg rounded-3 overflow-hidden">
          <Table responsive hover className="table-modern mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Âge</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersons.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    Aucune donnée
                  </td>
                </tr>
              ) : (
                filteredPersons.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.nom}</td>
                    <td>{p.age}</td>
                    <td className="text-center">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(p)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* ADD MODAL */}
        <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une personne</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAdd}>
              <Form.Control
                className="mb-3"
                placeholder="Nom"
                value={addNom}
                onChange={(e) => setAddNom(e.target.value)}
                required
              />
              <Form.Control
                type="number"
                placeholder="Âge"
                value={addAge}
                onChange={(e) => setAddAge(e.target.value)}
                required
                min="1"
              />
              <div className="text-end mt-3">
                <Button type="submit" variant="success">
                  Ajouter
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* EDIT MODAL */}
        <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Modifier</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEdit}>
              <Form.Control
                className="mb-3"
                value={editPerson.nom}
                onChange={(e) =>
                  setEditPerson({ ...editPerson, nom: e.target.value })
                }
                required
              />
              <Form.Control
                type="number"
                value={editPerson.age}
                onChange={(e) =>
                  setEditPerson({ ...editPerson, age: e.target.value })
                }
                required
                min="1"
              />
              <div className="text-end mt-3">
                <Button type="submit" variant="warning">
                  Modifier
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </div>
    </div>
  );
}

export default App;
