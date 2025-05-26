import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Nav, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vaccinationRes, vaccineRes, petsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:8000/vaccinations/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/vaccines/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/pets/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/appointments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const allVaccinations = vaccinationRes.data.filter(v => v.appointment_id !== null);
        setVaccinations(allVaccinations);
        setVaccines(vaccineRes.data);
        setPets(petsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error("❌ ERROR loading data:", err?.response || err);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [token]);

  const getPetName = (id) => pets.find((p) => p.id === id)?.name || "-";

  const getAppointmentDateTime = (appointmentId) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    if (!appt || !appt.scheduled_at) return { date: "-", time: "-" };
    const dateObj = new Date(appt.scheduled_at);
    return {
      date: dateObj.toLocaleDateString("en-GB"),
      time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vaccination?")) return;
    try {
      await axios.delete(`http://localhost:8000/vaccinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVaccinations((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Failed to delete vaccination.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/vaccinations/${editModal.id}`,
        {
          vaccine_id: Number(editModal.vaccine_id),
          pet_id: Number(editModal.pet_id),
          appointment_id: Number(editModal.appointment_id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModal(null);
      window.location.reload();
    } catch (err) {
      alert("Failed to update vaccination.");
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/medicines">Medicines</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Vaccination Records ♻ </h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table className="custom-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Vaccine Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {vaccinations.map((item) => {
              const vaccine = vaccines.find((v) => v.id === item.vaccine_id);
              const { date, time } = getAppointmentDateTime(item.appointment_id);

              return (
                <tr key={item.id}>
                  <td>{getPetName(item.pet_id)}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{vaccine?.type || "-"}</td>
                  <td>{vaccine?.name || "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-edit me-2"
                      onClick={() => setEditModal(item)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Modal show={!!editModal} onHide={() => setEditModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vaccination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Vaccine</Form.Label>
              <Form.Select
                value={editModal?.vaccine_id || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({ ...prev, vaccine_id: e.target.value }))
                }
              >
                {vaccines.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.type})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-primary">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VaccinationsPage;
