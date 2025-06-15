import React, { useEffect, useState } from "react";
import { Table, Form, Nav, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import Select from "react-select";
import "../App.css";
import apiClient from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function PetPage() {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [newPet, setNewPet] = useState({ name: "", age: "", breed_id: "", recommendations: "" });

  const [editModal, setEditModal] = useState({ show: false, pet: null });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, petId: null });
  const [addModal, setAddModal] = useState({ show: false, status: "" });
  const [saving, setSaving] = useState(false);


  const token = localStorage.getItem("token");

  const fetchPets = () => {
    apiClient.get("/pets/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPets(res.data))
      .catch((err) => console.error("Error loading pets:", err));
  };

  const fetchBreeds = () => {
    apiClient.get("/breeds/")
      .then((res) => setBreeds(res.data))
      .catch((err) => console.error("Error loading breeds:", err));
  };

  useEffect(() => {
    fetchPets();
    fetchBreeds();
  }, []);

  const fetchRecommendations = async (age, breed_id) => {
    try {
      const res = await apiClient.post(
        "/recommendations/",
        { age, breed_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.recommendations;
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      return "";
    }
  };

  const addPet = (e) => {
    e.preventDefault();
    setAddModal({ show: true, status: "loading" });

    apiClient.post("/pets/", newPet, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setNewPet({ name: "", age: "", breed_id: "", recommendations: "" });
        setAddModal({ show: true, status: "success" });
        fetchPets();

        setTimeout(() => setAddModal({ show: false, status: "" }), 3000);
      })
      .catch((err) => {
        console.error("Error adding pet:", err);
        setAddModal({ show: false, status: "" });
      });
  };

  const openEditModal = (pet) => {
    setEditModal({
      show: true,
      pet: { ...pet, recommendations: "Loading..." },
    });

    setEditLoading(true);
    fetchRecommendations(pet.age, pet.breed_id).then((recommendations) => {
      setEditModal((prev) => ({
        ...prev,
        pet: { ...prev.pet, recommendations },
      }));
      setEditLoading(false);
    });
  };
  const saveEditedPet = async () => {
      const { id, name, age, breed_id } = editModal.pet;

      try {
        setSaving(true);
        const recommendations = await fetchRecommendations(age, breed_id);

        await apiClient.put(`/pets/${id}`, {
          name,
          age: Number(age),
          breed_id: Number(breed_id),
          recommendations,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const breed = breeds.find((b) => b.id === Number(breed_id));
        setPets((prevPets) =>
          prevPets.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name,
                  age: Number(age),
                  breed_id: Number(breed_id),
                  breed: breed ? { id: breed.id, name: breed.name } : null,
                  recommendations,
                }
              : p
          )
        );

        setSaving(false);
        setEditModal({ show: false, pet: null });
      } catch (err) {
        console.error("Error updating pet:", err);
        setSaving(false);
      }
    };

  const openDeleteModal = (id) => setDeleteModal({ show: true, petId: id });

  const confirmDelete = () => {
    apiClient.delete(`/pets/${deleteModal.petId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setDeleteModal({ show: false, petId: null });
      fetchPets();
    }).catch((err) => console.error("Error deleting pet:", err));
  };

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4 custom-tabs">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
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
                <td>{pet.recommendations || "-"}</td>
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
              value={breeds.find((b) => b.id === Number(newPet.breed_id)) ? {
                value: Number(newPet.breed_id),
                label: breeds.find((b) => b.id === Number(newPet.breed_id)).name,
              } : null}
              onChange={(selected) =>
                setNewPet({ ...newPet, breed_id: selected?.value || "" })
              }
              placeholder="Select a breed"
            />
          </Form.Group>

          <button type="submit" className="custom-btn add-small">Add</button>
        </Form>
      </div>
      <Modal
          className="custom-modal"
          show={editModal.show}
          onHide={() => {
            setEditModal({ show: false, pet: null });
            setEditLoading(false);
            setSaving(false);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Pet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AnimatePresence mode="wait">
              {saving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Spinner animation="border" role="status" className="mb-2" />
                  <div>Generating recommendations...</div>
                </motion.div>
              ) : editLoading || !editModal.pet ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Spinner animation="border" role="status" className="mb-2" />
                  <div>Loading recommendations...</div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form.Control
                    className="mb-2"
                    value={editModal.pet.name}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        pet: { ...editModal.pet, name: e.target.value },
                      })
                    }
                    placeholder="Name"
                  />
                  <Form.Control
                    className="mb-2"
                    type="number"
                    value={editModal.pet.age}
                    onChange={async (e) => {
                      const age = e.target.value;
                      const breed_id = editModal.pet.breed_id;
                      setEditModal((prev) => ({
                        ...prev,
                        pet: { ...prev.pet, age, recommendations: "Loading recommendations..." },
                      }));
                      const recommendations = await fetchRecommendations(age, breed_id);
                      setEditModal((prev) => ({
                        ...prev,
                        pet: { ...prev.pet, recommendations },
                      }));
                    }}
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
                            label: breeds.find(
                              (b) => b.id === Number(editModal.pet.breed_id)
                            ).name,
                          }
                        : null
                    }
                    onChange={async (selected) => {
                      const breed_id = selected?.value;
                      const age = editModal.pet.age;
                      setEditModal((prev) => ({
                        ...prev,
                        pet: {
                          ...prev.pet,
                          breed_id,
                          recommendations: "Loading recommendations...",
                        },
                      }));
                      const recommendations = await fetchRecommendations(age, breed_id);
                      setEditModal((prev) => ({
                        ...prev,
                        pet: { ...prev.pet, recommendations },
                      }));
                    }}
                    placeholder="Select a breed"
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="mt-2"
                    placeholder="Recommendations"
                    value={editModal.pet.recommendations || ""}
                    disabled
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Modal.Body>
          <Modal.Footer>
            <div
              className="custom-btn pastel-pink"
              onClick={() => {
                setEditModal({ show: false, pet: null });
                setEditLoading(false);
                setSaving(false);
              }}
            >
              Cancel
            </div>
            <div
              className="custom-btn pastel-green"
              onClick={saveEditedPet}
              disabled={saving}
            >
              Save
            </div>
          </Modal.Footer>
        </Modal>


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

      <Modal className="custom-modal" show={addModal.show} onHide={() => setAddModal({ show: false, status: "" })} centered>
        <Modal.Header closeButton>
          <Modal.Title>{addModal.status === "loading" ? "Adding Pet" : "Success"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {addModal.status === "loading" ? (
            <>
              <Spinner animation="border" role="status" className="mb-3" />
              <div>Your pet is being added, please wait...</div>
            </>
          ) : (
            <div>Your pet has been successfully added!</div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PetPage;
