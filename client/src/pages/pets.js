import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Nav, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import Select from "react-select";
import "../App.css";

function PetPage() {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [newPet, setNewPet] = useState({ name: "", age: "", breed_id: "" , recommendations: "" });

  const [editModal, setEditModal] = useState({ show: false, pet: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, petId: null });

  const token = localStorage.getItem("token");

  const fetchPets = () => {
    axios
      .get("http://127.0.0.1:8000/pets/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {setPets(res.data);console.log(res.data)})
      .catch((err) => {console.log(err)})
      .catch((err) => console.error("Error loading pets:", err));
  };

  const fetchBreeds = () => {
    axios
      .get("http://127.0.0.1:8000/breeds/")
      .then((res) => setBreeds(res.data))
      .catch((err) => console.error("Error loading breeds:", err));
  };

  useEffect(() => {
    fetchPets();
    fetchBreeds();
  }, []);

  const addPet = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/pets/", newPet, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setNewPet({ name: "", age: "", breed_id: "" ,  recommendations: "" });
        fetchPets();
      })
      .catch((err) => console.error("Error adding pet:", err));
  };

  const openEditModal = (pet) => setEditModal({ show: true, pet: { ...pet } });

  const saveEditedPet = () => {
    const { id, name, age, breed_id } = editModal.pet;
    axios
      .put(
        `http://127.0.0.1:8000/pets/${id}`,
        { name, age: Number(age), breed_id: Number(breed_id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setEditModal({ show: false, pet: null });
        fetchPets();
      })
      .catch((err) => console.error("Error updating pet:", err));
  };

  const openDeleteModal = (id) => setDeleteModal({ show: true, petId: id });

  const confirmDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/pets/${deleteModal.petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setDeleteModal({ show: false, petId: null });
        fetchPets();
      })
      .catch((err) => console.error("Error deleting pet:", err));
  };

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4 custom-tabs">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          {/*<Nav.Item><Nav.Link as={Link} to="/medicines">Medicines</Nav.Link></Nav.Item>*/}
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/mars">Lore</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>

        </Nav>
        <h2>My Pets 𓃡</h2>
        <Table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Breed</th>
              <th>Recommendations</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.age}</td>
                <td>{pet.breed?.name || "—"}</td>
                <th>{pet.recommendations || "-"}</th>
                <td>
                  <div className="custom-btn pastel-yellow" onClick={() => openEditModal(pet)}>Edit</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h2>⊹₊⟡⋆ Add a new pet pal ⊹₊⟡⋆</h2>
        <Form onSubmit={addPet} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              value={newPet.age}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Breed</Form.Label>
            <Select
              className="mb-2 react-select-container"
              classNamePrefix="react-select"
              options={breeds.map((b) => ({ value: b.id, label: b.name }))}
              value={
                breeds.find((b) => b.id === Number(newPet.breed_id))
                  ? {
                      value: Number(newPet.breed_id),
                      label: breeds.find((b) => b.id === Number(newPet.breed_id)).name,
                    }
                  : null
              }
              onChange={(selected) =>
                setNewPet({ ...newPet, breed_id: selected?.value || "" })
              }
              placeholder="Select a breed"
            />
          </Form.Group>

          <button type="submit" className="custom-btn add-small">Add</button>
        </Form>
      </div>

      {/* Edit Modal */}
      <Modal className="custom-modal" show={editModal.show} onHide={() => setEditModal({ show: false, pet: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editModal.pet && (
            <>
              <Form.Control
                className="mb-2"
                value={editModal.pet.name}
                onChange={(e) =>
                  setEditModal({ ...editModal, pet: { ...editModal.pet, name: e.target.value } })
                }
                placeholder="Name"
              />
              <Form.Control
                className="mb-2"
                type="number"
                value={editModal.pet.age}
                onChange={(e) =>
                  setEditModal({ ...editModal, pet: { ...editModal.pet, age: e.target.value } })
                }
                placeholder="Age"
              />
              <Select
                className="mb-2 react-select-container"
                classNamePrefix="react-select"
                options={breeds.map((b) => ({ value: b.id, label: b.name }))}
                value={
                  breeds.find((b) => b.id === Number(editModal.pet.breed_id))
                    ? {
                        value: editModal.pet.breed_id,
                        label: breeds.find((b) => b.id === Number(editModal.pet.breed_id)).name,
                      }
                    : null
                }
                onChange={(selected) =>
                  setEditModal({ ...editModal, pet: { ...editModal.pet, breed_id: selected?.value } })
                }
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="custom-btn pastel-pink" onClick={() => setEditModal({ show: false, pet: null })}>Cancel</div>
          <div className="custom-btn pastel-green" onClick={saveEditedPet}>Save</div>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal className="custom-modal" show={deleteModal.show} onHide={() => setDeleteModal({ show: false, petId: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this pet?</Modal.Body>
        <Modal.Footer>
          <div className="custom-btn pastel-pink" onClick={() => setDeleteModal({ show: false, petId: null })}>Cancel</div>
          <div className="custom-btn pastel-green" onClick={confirmDelete}>Delete</div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PetPage;
