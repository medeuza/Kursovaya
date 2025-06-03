import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
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

        const myPetIds = new Set(petsRes.data.map(p => p.id));
        const userAppointments = appointmentsRes.data.filter(a => myPetIds.has(a.pet_id));
        const userVaccinations = vaccinationRes.data.filter(v => myPetIds.has(v.pet_id));

        setVaccines(vaccineRes.data);
        setPets(petsRes.data);
        setAppointments(userAppointments);
        setVaccinations(userVaccinations);
      } catch (err) {
        console.error("ERROR loading data:", err?.response || err);
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

  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/mars">Lore</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Vaccination Records ♻</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table className="custom-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Vaccine Name</th>
              <th>Conclusion</th>
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
                  <td>{appointments.find((a) => a.id === item.appointment_id)?.conclusion_status || "pending"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default VaccinationsPage;
