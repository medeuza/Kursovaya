import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Nav, Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

function AnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(null); // holds analysis to edit
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysesRes, petsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:8000/analyses/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/pets/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/appointments/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAnalyses(analysesRes.data);
        setPets(petsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [token]);

  const getPetName = (analysisItem) => {
    const petId =
      analysisItem.pet_id ??
      appointments.find((a) => a.id === analysisItem.appointment_id)?.pet_id;
    return pets.find((p) => p.id === petId)?.name || "-";
  };

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
    if (!window.confirm("Delete this analysis?")) return;
    try {
      await axios.delete(`http://localhost:8000/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete analysis.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/analyses/${editModal.id}`,
        {
          appointment_id: editModal.appointment_id,
          analysis_type_id: editModal.analysis_type?.id || 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModal(null);
      window.location.reload();
    } catch (err) {
      alert("Failed to update analysis.");
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

        <h2 className="mb-4">Analyses Records ♻ </h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table className="custom-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Description</th>
              <th>Instructions</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((item) => {
              const { date, time } = getAppointmentDateTime(item.appointment_id);
              return (
                <tr key={item.id}>
                  <td>{getPetName(item)}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{item.analysis_type?.name}</td>
                  <td>{item.analysis_type?.description}</td>
                  <td>{item.analysis_type?.instructions}</td>
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
          <Modal.Title>Edit Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Label>Analysis Type ID</Form.Label>
              <Form.Control
                type="number"
                value={editModal?.analysis_type?.id || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    analysis_type: { ...prev.analysis_type, id: Number(e.target.value) },
                  }))
                }
              />
            </Form.Group>
            <Button type="submit" className="mt-3 btn-primary">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AnalysisPage;
