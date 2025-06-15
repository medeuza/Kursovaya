import React, { useState, useEffect } from "react";
import { Form, Button, Nav, Table, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GlobalStyle from "../GlobalStyle";
import apiClient from "../api/axios";

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    style={{
      backgroundColor: "#fffaf2",
      border: "1px solid #e7d5c0",
      borderRadius: "0.375rem",
      padding: "0.5rem",
      fontSize: "1rem",
      fontFamily: "Comfortaa, sans-serif",
      color: "#5a3e32",
      cursor: "pointer",
      userSelect: "none",
      marginTop: "0.25rem",
    }}
  >
    {value || "Click to select a date"}
  </div>
));

function formatLocalDateTime(date) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function AppointmentPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pets, setPets] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    petId: null,
    date: null,
    clinicId: null,
    status: "pending",
  });
  const [editModal, setEditModal] = useState({ show: false, appointment: null });

  useEffect(() => {
    apiClient.get("/pets/", { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setPets(res.data);
      const petIds = new Set(res.data.map(p => p.id));

      apiClient.get("/appointments/", { headers: { Authorization: `Bearer ${token}` } }).then(apptRes => {
        const filtered = apptRes.data.filter(a => petIds.has(a.pet_id));
        setAppointments(filtered);
      });

    }).catch(console.error);

    apiClient.get("/clinics/", { headers: { Authorization: `Bearer ${token}` } }).then(res => setClinics(res.data)).catch(console.error);

    const saved = localStorage.getItem("appointment_form");
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm({
        petId: parsed.petId || null,
        date: parsed.date ? new Date(parsed.date) : null,
        clinicId: parsed.clinicId || null,
        status: parsed.status || "pending",
      });
      localStorage.removeItem("appointment_form");
    }
  }, []);
  const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.petId || !form.date || !form.clinicId) {
    alert("Fill all fields");
    return;
  }
  apiClient.post("/appointments/",
      {
        pet_id: form.petId,
        scheduled_at: formatLocalDateTime(form.date),
        clinic_id: form.clinicId,
        status: form.status,
        conclusion_status: "pending",
      },
      {
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      localStorage.setItem("appointment_id", res.data.id);
      localStorage.setItem("pet_id", form.petId);
      navigate("/procedure-type");
    })
    .catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete appointment?")) return;
    apiClient.delete(`/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,},})
    .then(() => window.location.reload())
    .catch(console.error);
  };


  const openEditModal = (appointment) => {
    setEditModal({
      show: true,
      appointment: {
        ...appointment,
        date: new Date(appointment.scheduled_at),
        petId: appointment.pet_id,
        clinicId: appointment.clinic_id,
      },
    });
  };

  const saveEditedAppointment = () => {
    const appt = editModal.appointment;
    apiClient.put(
    `/appointments/${appt.id}`,
    {
      pet_id: appt.petId,
      scheduled_at: formatLocalDateTime(appt.date),
      clinic_id: appt.clinicId,
      status: appt.status,
      conclusion_status: appt.conclusion_status || "pending",
      conclusion: appt.conclusion || "",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  ).then(() => {
      setEditModal({ show: false, appointment: null });
      window.location.reload();
    }).catch(console.error);
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

        <h2 className="mb-4">Create Appointment 𓃢</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Pet</Form.Label>
            <Select
              className="mb-2 react-select-container"
              classNamePrefix="react-select"
              options={pets.map(p => ({ value: p.id, label: p.name }))}
              value={
                pets.find(p => p.id === form.petId)
                  ? { value: form.petId, label: pets.find(p => p.id === form.petId).name }
                  : null
              }
              onChange={(selected) => setForm({ ...form, petId: selected?.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <div style={{ marginTop: "0.5rem" }}>
              <DatePicker
                selected={form.date}
                onChange={(date) => setForm({ ...form, date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<CustomDateInput />}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Clinic</Form.Label>
            <div
              onClick={() => {
                localStorage.setItem("appointment_form", JSON.stringify(form));
                navigate("/clinics");
              }}
              style={{ backgroundColor: "#fffaf2", border: "1px solid #e7d5c0", borderRadius: "8px", padding: "0.5rem", fontFamily: "Comfortaa", fontSize: "1rem", color: "#5a3e32", cursor: "pointer" }}
            >
              {form.clinicId ? clinics.find(c => c.id === form.clinicId)?.name : "Click to select clinic"}
            </div>
          </Form.Group>

          <Button type="submit" style={{ backgroundColor: "#fff1b8", border: "none", borderRadius: "8px", color: "#5a3e32", fontFamily: "Comfortaa", padding: "0.4rem 1rem" }}>
            Next
          </Button>
        </Form>

        <h2 className="mt-5">⋆˙⟡ My Appointments ⋆˙⟡
        </h2>
        <Table bordered hover className="custom-table mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pet</th>
              <th>Date</th>
              <th>Clinic</th>
              <th>Procedure</th>
              <th>Status</th>
              <th>Conclusion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{pets.find(p => p.id === appt.pet_id)?.name || "Unknown"}</td>
                <td>{new Date(appt.scheduled_at).toLocaleString()}</td>
                <td>{clinics.find(c => c.id === appt.clinic_id)?.name || "Unknown"}</td>
                <td>{appt.procedure ? `${appt.procedure.type}: ${appt.procedure.name}` : "Check-Up"}</td>
                <td style={{ fontWeight: "bold", color: appt.status === "completed" ? "green" : "#a67c52" }}>
                  {appt.status === "completed" ? "✔ Complete" : appt.status}
                </td>
                <td>{appt.conclusion || "–"}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => openEditModal(appt)}
                    style={{ marginRight: '0.5rem', backgroundColor: '#ffe1a8', border: 'none', color: '#5a3e32' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(appt.id)}
                    style={{ backgroundColor: '#ffaaa5', border: 'none', color: '#fff' }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      <Modal show={editModal.show} onHide={() => setEditModal({ show: false, appointment: null })} centered>
        <Modal.Header closeButton style={{ fontFamily: 'Comfortaa', backgroundColor: '#fffaf2' }}>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fffaf2', fontFamily: 'Comfortaa' }}>
          {editModal.appointment && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Pet</Form.Label>
                <Select
                  className="mb-2 react-select-container"
                  classNamePrefix="react-select"
                  options={pets.map(p => ({ value: p.id, label: p.name }))}
                  value={pets.find(p => p.id === editModal.appointment.petId)
                    ? { value: editModal.appointment.petId, label: pets.find(p => p.id === editModal.appointment.petId).name }
                    : null}
                  onChange={(selected) =>
                    setEditModal({
                      ...editModal,
                      appointment: { ...editModal.appointment, petId: selected?.value },
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <div style={{ marginTop: "0.5rem" }}>
                  <DatePicker
                    selected={editModal.appointment.date}
                    onChange={(date) =>
                      setEditModal({
                        ...editModal,
                        appointment: { ...editModal.appointment, date },
                      })
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    customInput={<CustomDateInput />}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Clinic</Form.Label>
                <Select
                  className="mb-2 react-select-container"
                  classNamePrefix="react-select"
                  options={clinics.map(c => ({ value: c.id, label: c.name }))}
                  value={clinics.find(c => c.id === editModal.appointment.clinicId)
                    ? { value: editModal.appointment.clinicId, label: clinics.find(c => c.id === editModal.appointment.clinicId).name }
                    : null}
                  onChange={(selected) =>
                    setEditModal({
                      ...editModal,
                      appointment: { ...editModal.appointment, clinicId: selected?.value },
                    })
                  }
                />
              </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Conclusion</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editModal.appointment.conclusion || ""}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    appointment: { ...editModal.appointment, conclusion: e.target.value },
                  })
                }
              />
        </Form.Group>

            </>
          )}
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: '#fffaf2' }}>
          <Button variant="secondary" onClick={() => setEditModal({ show: false, appointment: null })}>Cancel</Button>
          <Button variant="primary" onClick={saveEditedAppointment}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AppointmentPage;