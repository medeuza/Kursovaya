import React, { useEffect, useState } from "react";
import { Table, Alert, Form, Button, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import apiClient from "../api/axios";

function ServicePanel() {
  const token = localStorage.getItem("token");
  const storedClinicId = localStorage.getItem("selected_clinic_id");
  const cellStyle = {
    color: "#5a3e32",
    border: "1px solid #f0dfc6",
    padding: "12px 16px",
    verticalAlign: "middle",
    backgroundColor: "#fff8ec",
    borderRadius: "12px",
  };
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState({});
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState(storedClinicId || "");
  const [error, setError] = useState("");
  const [conclusions, setConclusions] = useState({});

  const fetchData = async () => {
    try {
      const apptRes = await apiClient.get("/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredAppointments = apptRes.data.filter(
        (a) => String(a.clinic_id) === String(selectedClinicId)
      );
      setAppointments(filteredAppointments);

      const petsRes = await apiClient.get("/pets/?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(petsRes.data);

      const breedsRes = await apiClient.get("/breeds/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const breedsMap = {};
      for (let b of breedsRes.data) {
        breedsMap[b.id] = b.name;
      }
      setBreeds(breedsMap);
    } catch (error) {
      console.error("\u274C Ошибка при загрузке данных:", error);
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    apiClient
      .get("/clinics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClinics(res.data))
      .catch((err) => console.error("Error loading clinics:", err));
  }, [token]);

  useEffect(() => {
    if (!selectedClinicId) return;
    fetchData();
  }, [token, selectedClinicId]);

  const markAsCompleted = async (id) => {
    try {
      const res = await apiClient.patch(
        `/appointments/${id}`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.status === "completed") {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: "completed" } : appt
          )
        );
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("\u274C Error updating status:", err.response?.data || err.message);
    }
  };

  const updateConclusion = async (id, conclusion) => {
    try {
      await apiClient.patch(
        `/appointments/${id}`,
        { conclusion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("\u274C Failed to update conclusion:", err);
    }
  };

  const getPetDetails = (pet_id) => {
    const pet = pets.find((p) => p.id === pet_id);
    if (!pet) return null;
    return {
      name: pet.name,
      age: pet.age,
      breedName: breeds[pet.breed_id] || "Unknown",
    };
  };

  return (
    <>
      <GlobalStyle />
      <Container className="mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/select-clinic">Your Clinic</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/services">Procedures</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/mars2">Lore</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4" style={{ fontWeight: 700, fontSize: "1.8rem", color: "#5a3e32" }}>
          My Appointments 🐾
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {selectedClinicId && appointments.length > 0 && (
          <Table
            bordered
            responsive
            style={{
              fontFamily: "Comfortaa, sans-serif",
              backgroundColor: "#fffaf2",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
            className="custom-table"
          >
            <thead>
              <tr>
                {["Breed", "Age", "Name", "Date", "Time", "Status", "Conclusion"].map((title) => (
                  <th
                    key={title}
                    style={{
                      backgroundColor: "#fcebd5",
                      color: "#5a3e32",
                      border: "1px solid #e6d4c3",
                      padding: "12px",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const petDetails = getPetDetails(a.pet_id);
                const date = new Date(a.scheduled_at);
                return (
                  <tr key={a.id} style={{ backgroundColor: "#fff8ec" }}>
                    <td style={cellStyle}>{petDetails?.breedName || "Unknown"}</td>
                    <td style={cellStyle}>{petDetails?.age || "–"}</td>
                    <td style={cellStyle}>{petDetails?.name || `Unknown (${a.pet_id})`}</td>
                    <td style={cellStyle}>{date.toLocaleDateString()}</td>
                    <td style={cellStyle}>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={cellStyle}>
                      {a.status === "completed" ? (
                        <span style={{ fontWeight: "bold", color: "#5a3e32" }}>✔ Complete</span>
                      ) : (
                        <Button
                          style={{
                            backgroundColor: "#ffe8a3",
                            border: "1px solid #e6c97a",
                            borderRadius: "12px",
                            color: "#5a3e32",
                            fontFamily: "Comfortaa",
                            padding: "6px 14px",
                            fontSize: "0.95rem",
                          }}
                          size="sm"
                          onClick={() => markAsCompleted(a.id)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </td>
                    <td style={cellStyle}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Add conclusion..."
                        style={{
                          backgroundColor: "#fff8ec",
                          border: "1px solid #e6d4c3",
                          borderRadius: "10px",
                          color: "#5a3e32",
                          fontFamily: "Comfortaa",
                          fontSize: "0.95rem",
                        }}
                        value={(conclusions[a.id] ?? a.conclusion) || ""}
                        onChange={(e) =>
                          setConclusions((prev) => ({
                            ...prev,
                            [a.id]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        className="mt-2"
                        style={{
                          backgroundColor: "#ffe8a3",
                          border: "1px solid #e6c97a",
                          borderRadius: "10px",
                          color: "#5a3e32",
                          fontFamily: "Comfortaa",
                          padding: "4px 12px",
                        }}
                        onClick={() => updateConclusion(a.id, conclusions[a.id] ?? a.conclusion)}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {selectedClinicId && appointments.length === 0 && (
          <p style={{ fontStyle: "italic", fontFamily: "Comfortaa" }}>
            No appointments found for this clinic.
          </p>
        )}
      </Container>
    </>
  );
}

export default ServicePanel;
