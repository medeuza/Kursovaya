import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Alert, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import "../App.css";

const ServicePanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const clinicId = localStorage.getItem("selected_clinic_id");

  useEffect(() => {
    if (!clinicId) {
      navigate("/select-clinic");
    }
  }, [clinicId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, clinicsRes] = await Promise.all([
          axios.get("http://localhost:8000/pets/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/clinics/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPets(petsRes.data);
        setClinics(clinicsRes.data);

        const apptRes = await axios.get("http://localhost:8000/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredAppointments = apptRes.data.filter(
          (appt) => appt.clinic_id === Number(clinicId)
        );

        setAppointments(filteredAppointments);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [token, clinicId]);

  const getPetName = (id) => {
    const pet = pets.find((p) => Number(p.id) === Number(id));
    return pet?.name || "-";
  };

  const getClinicName = (id) => clinics.find((c) => c.id === id)?.name || "-";

  const markCompleted = async (id, appointment) => {
    try {
      await axios.put(
        `http://localhost:8000/appointments/${id}`,
        { ...appointment, conclusion_status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, conclusion_status: "completed" } : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment status");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container className="mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/select-clinic">Your Clinic</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/services">Procedures</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Current procedures</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pet</th>
              <th>Clinic</th>
              <th>Date</th>
              <th>Time</th>
              <th>Conclusion</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const dateObj = new Date(appt.scheduled_at);
              const date = dateObj.toLocaleDateString();
              const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>{getPetName(appt.pet_id)}</td>
                  <td>{getClinicName(appt.clinic_id)}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>
                    {appt.conclusion_status === "completed" ? (
                      "Completed"
                    ) : (
                      <Button
                        size="sm"
                        className="btn-add"
                        onClick={() => markCompleted(appt.id, appt)}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default ServicePanel;
