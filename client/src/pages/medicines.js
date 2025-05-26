import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

const MedicinePage = () => {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", usage: "" });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:8000/medicines/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load medicines.");
    }
  };

  const handleAddMedicine = async () => {
    try {
      await axios.post("http://localhost:8000/medicines/", newMedicine, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowModal(false);
      setNewMedicine({ name: "", usage: "" });
      fetchMedicines();
    } catch (err) {
      console.error(err);
      setError("Error adding medicine.");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link as={Link} to="/pets">Pets</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/appointments">Appointments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/medicines">Medicines</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/analysis">Analyses</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/clinics">Clinics</Nav.Link>
          </Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/">Logout</Nav.Link>
          </Nav.Item>
        </Nav>

        <h2 className="mb-4">Medicines ☕︎ </h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <Button className="btn-primary mb-3" onClick={() => setShowModal(true)}>
          Add Medicine
        </Button>

        <Table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med.id}>
                <td>{med.id}</td>
                <td>{med.name}</td>
                <td>{med.usage}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddMedicine();
                  }}
                >
                  <div className="modal-header">
                    <h5 className="modal-title">Add Medicine</h5>
                    <Button variant="close" onClick={() => setShowModal(false)} />
                  </div>
                  <div className="modal-body">
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMedicine.name}
                        onChange={(e) =>
                          setNewMedicine({ ...newMedicine, name: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Usage</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMedicine.usage}
                        onChange={(e) =>
                          setNewMedicine({ ...newMedicine, usage: e.target.value })
                        }
                      />
                    </Form.Group>
                  </div>
                  <div className="modal-footer">
                    <Button className="btn-delete" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button className="btn-edit" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MedicinePage;
