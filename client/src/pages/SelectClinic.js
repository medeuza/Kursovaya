// 📁 SelectClinic.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";

function SelectClinic() {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/clinics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClinics(res.data))
      .catch((err) => console.error("Error loading clinics:", err));
  }, [token]);

  const handleSelect = () => {
    if (selectedClinic) {
      localStorage.setItem("selected_clinic_id", selectedClinic.id);
      navigate("/services");
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

        <h2>Select the clinic where you work</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Clinic</Form.Label>
            <Form.Select
              onChange={(e) =>
                setSelectedClinic(
                  clinics.find((c) => c.id === Number(e.target.value))
                )
              }
            >
              <option value="">Select a clinic...</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} — {clinic.address}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button onClick={handleSelect} disabled={!selectedClinic}>
            Continue
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default SelectClinic;
