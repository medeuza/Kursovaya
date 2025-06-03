import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Form, Button, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";
import GlobalStyle from "../GlobalStyle";

function ServicePanel() {
  const token = localStorage.getItem("token");
  const storedClinicId = localStorage.getItem("selected_clinic_id");
  const cellStyle = {
    color: "#5a3e32",
    border: "1px solid #e6d4c3",
    padding: "12px",
    verticalAlign: "middle",
    backgroundColor: "#fdf3e7",
  };
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState({});
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState(storedClinicId || "");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/clinics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClinics(res.data))
      .catch((err) => console.error("Error loading clinics:", err));
  }, [token]);

  useEffect(() => {
    if (!selectedClinicId) return;

    const fetchData = async () => {
      try {
        const apptRes = await axios.get("http://localhost:8000/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredAppointments = apptRes.data.filter(
          (a) => String(a.clinic_id) === String(selectedClinicId)
        );
        setAppointments(filteredAppointments);

        const petsRes = await axios.get("http://localhost:8000/pets/?all=true", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(petsRes.data);

        const breedsRes = await axios.get("http://localhost:8000/breeds/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const breedsMap = {};
        for (let b of breedsRes.data) {
          breedsMap[b.id] = b.name;
        }
        setBreeds(breedsMap);
      } catch (error) {
        console.error("❌ Ошибка при загрузке данных:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [token, selectedClinicId]);

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/appointments/${id}/status`, {
        status: "completed"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(prev =>
        prev.map(appt => appt.id === id ? { ...appt, status: "completed" } : appt)
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
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

  const clinicOptions = clinics.map((c) => ({
    value: c.id,
    label: `${c.name} — ${c.address}`,
  }));

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

        <h2 style={{ fontFamily: "Comfortaa", fontWeight: 700 }}>Current Appointments 🐾</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {selectedClinicId && appointments.length > 0 && (
        <Table
          bordered
          responsive
          style={{
            borderCollapse: "collapse",
            fontFamily: "Comfortaa, sans-serif",
            backgroundColor: "#fef6ed",
          }}
        >
          <thead>
            <tr>
              {["Breed", "Age", "Name", "Date", "Time", "Status"].map((title) => (
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
                <tr key={a.id} style={{ backgroundColor: "#fdf3e7" }}>
                  <td style={cellStyle}>{petDetails?.breedName || "Unknown"}</td>
                  <td style={cellStyle}>{petDetails?.age || "–"}</td>
                  <td style={cellStyle}>{petDetails?.name || `Unknown (${a.pet_id})`}</td>
                  <td style={cellStyle}>{date.toLocaleDateString()}</td>
                  <td style={cellStyle}>
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td style={cellStyle}>
                    {a.status === "completed" ? (
                      <span style={{ fontWeight: "bold", color: "green" }}>✔ Complete</span>
                    ) : (
                      <Button
                        style={{
                          backgroundColor: "#fcefa1",
                          color: "#5a3e32",
                          fontFamily: "Comfortaa",
                          border: "1px solid #e6d4c3",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "0.9rem",
                        }}
                        size="sm"
                        onClick={() => markAsCompleted(a.id)}
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
