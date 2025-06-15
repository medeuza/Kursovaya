import React, { useEffect, useState } from "react";
import { Table, Alert, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import apiClient from "../api/axios";

function AnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [analysesRes, petsRes, appointmentsRes] = await Promise.all([
          apiClient.get("/analyses/", { headers }),
          apiClient.get("/pets/", { headers }),
          apiClient.get("/appointments/", { headers }),
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

  const getConclusion = (appointmentId) => {
    return appointments.find((a) => a.id === appointmentId)?.conclusion || "-";
  };

  const getStatus = (appointmentId) => {
    const status = appointments.find((a) => a.id === appointmentId)?.status || "pending";
    return (
      <span
        style={{
          fontWeight: "normal",
          color: "#5a3e32",
          backgroundColor: "transparent",
          fontFamily: "Comfortaa, sans-serif",
        }}
      >
        {status === "completed" ? "✔ Complete" : status}
      </span>
    );
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
              <th>Status</th>
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
                  <td>{getStatus(item.appointment_id)}</td>
                  <td>{getConclusion(item.appointment_id)}</td>
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
