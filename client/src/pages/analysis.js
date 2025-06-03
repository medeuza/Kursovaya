import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

function AnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
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

        const myPetIds = new Set(petsRes.data.map(p => p.id));
        const userAppointments = appointmentsRes.data.filter(a => myPetIds.has(a.pet_id));
        const userAnalyses = analysesRes.data.filter(a =>
          userAppointments.some(ap => ap.id === a.appointment_id)
        );

        setPets(petsRes.data);
        setAppointments(userAppointments);
        setAnalyses(userAnalyses);
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

        <h2 className="mb-4">Analyses Records ♻</h2>
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
              <th>Conclusion</th>
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

export default AnalysisPage;
