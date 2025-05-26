import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Nav, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GlobalStyle from "../GlobalStyle";

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    style={{
      backgroundColor: "#fdf2e9",
      border: "1px solid #e3c8b1",
      borderRadius: "0.375rem",
      padding: "0.5rem",
      fontSize: "1rem",
      fontFamily: "Comfortaa, sans-serif",
      color: value ? "#5e4232" : "#a58b7f",
      cursor: "pointer",
      userSelect: "none",
      marginTop: "0.25rem",
    }}
  >
    {value || "Click to select a date"}
  </div>
));

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

  const unifiedStyle = {
    backgroundColor: "#fdf2e9",
    border: "1px solid #e3c8b1",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem",
    fontFamily: "Comfortaa, sans-serif",
  };

  useEffect(() => {
    const fetchPets = () => {
      axios
        .get("http://127.0.0.1:8000/pets/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setPets(res.data))
        .catch((err) => console.error("Error loading pets:", err));
    };

    const fetchClinics = () => {
      axios
        .get("http://127.0.0.1:8000/clinics/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setClinics(res.data))
        .catch((err) => console.error("Error loading clinics:", err));
    };

    const fetchAppointments = () => {
      axios
        .get("http://localhost:8000/appointments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error loading appointments:", err));
    };

    fetchPets();
    fetchClinics();
    fetchAppointments();

    const selectedId = localStorage.getItem("selected_clinic_id");
    if (selectedId) {
      setForm((prev) => ({ ...prev, clinicId: Number(selectedId) }));
      localStorage.removeItem("selected_clinic_id");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.petId || !form.date || !form.clinicId) {
      alert("Please fill in all required fields: Pet, Date, and Clinic.");
      return;
    }
    const parsedDate = new Date(form.date);
    if (isNaN(parsedDate.getTime())) {
      alert("Invalid date selected.");
      return;
    }
    const payload = {
      pet_id: form.petId,
      scheduled_at: parsedDate.toISOString(),
      clinic_id: form.clinicId,
      status: form.status,
      conclusion_status: "pending"
    };
    axios
      .post("http://localhost:8000/appointments/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const appointmentId = res.data.id;
        localStorage.setItem("appointment_id", appointmentId);
        localStorage.setItem("pet_id", form.petId);
        navigate("/procedure-type");
      })
      .catch((err) => console.error("Error submitting appointment:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    axios
      .delete(`http://localhost:8000/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => window.location.reload())
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4 custom-tabs">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/medicines">Medicines</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Create Appointment 𓃢 </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Pet</Form.Label>
            <Select
              options={pets.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(selected) => setForm({ ...form, petId: selected.value })}
              placeholder="Select your pet"
              styles={{
                control: (base) => ({ ...base, ...unifiedStyle, boxShadow: "none" }),
                placeholder: (base) => ({ ...base, color: "#7d5a50" }),
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <div style={{ display: "block" }}>
              <DatePicker
                selected={form.date}
                onChange={(date) => setForm({ ...form, date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Click to select a date"
                popperPlacement="bottom-start"
                calendarClassName="custom-datepicker"
                customInput={<CustomDateInput />}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Clinic</Form.Label>
            <div
              onClick={() => navigate("/clinics")}
              style={{ ...unifiedStyle, cursor: "pointer", userSelect: "none" }}
            >
              {form.clinicId ? (
                <>
                  <strong>{clinics.find((c) => c.id === form.clinicId)?.name}</strong>
                  <div style={{ fontSize: "0.9rem", color: "#7d5a50" }}>
                    {clinics.find((c) => c.id === form.clinicId)?.address}
                  </div>
                </>
              ) : (
                "Click to select clinic"
              )}
            </div>
          </Form.Group>

          <Button type="submit" className="btn-primary">Next</Button>
        </Form>

        <h2 className="mt-5">⊹₊⟡⋆ My Appointments ⊹₊⟡⋆ </h2>
        <Table striped bordered hover className="custom-table mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pet</th>
              <th>Date</th>
              <th>Clinic</th>
              <th>Conclusion</th>
              <th>Procedure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{pets.find((p) => p.id === appt.pet_id)?.name || "Unknown"}</td>
                <td>{new Date(appt.scheduled_at).toLocaleString()}</td>
                <td>{clinics.find((c) => c.id === appt.clinic_id)?.name || "Unknown"}</td>
                <td>{appt.conclusion_status || "–"}</td>
                <td>
                  {appt.procedure
                    ? `${appt.procedure.type}: ${appt.procedure.name}`
                    : "Check-Up"}
                </td>
                <td>
                  <Button size="sm" className="btn-edit me-2" onClick={() => alert("Edit not yet implemented")}>Edit</Button>
                  <Button size="sm" className="btn-delete" onClick={() => handleDelete(appt.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AppointmentPage;
