import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Alert, Nav } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import GlobalStyle from "../GlobalStyle";

const VaccinationForm = () => {
  const [vaccines, setVaccines] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [type, setType] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const appointmentId = localStorage.getItem("appointment_id");
  const petId = localStorage.getItem("pet_id");

  useEffect(() => {
    axios
      .get("http://localhost:8000/vaccines/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVaccines(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load vaccines");
      });
  }, [token]);

  useEffect(() => {
    const filtered = vaccines.filter((v) => v.type === type);
    setFilteredOptions(
      filtered.map((v) => ({ value: v.name, label: v.name }))
    );
  }, [type, vaccines]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const vaccineMatch = vaccines.find(
      (v) => v.type === type && v.name === selectedName
    );
    if (!vaccineMatch) return setError("No matching vaccine found");

    const requests = Array.from({ length: quantity }).map(() =>
      axios.post(
        "http://localhost:8000/vaccinations/",
        {
          vaccine_id: vaccineMatch.id,
          pet_id: Number(petId),
          appointment_id: Number(appointmentId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );

    Promise.all(requests)
      .then(() => navigate("/appointments"))
      .catch((err) => {
        console.error(err);
        setError("Failed to save vaccination");
      });
  };

  const uniqueTypes = [...new Set(vaccines.map((v) => v.type))];

  return (
    <>
      <GlobalStyle />
      <Container className="mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/medicines">Medicines</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Add Vaccination</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Vaccine Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select type</option>
              {uniqueTypes.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vaccine Name</Form.Label>
            <Select
              options={filteredOptions}
              value={filteredOptions.find((o) => o.value === selectedName) || null}
              onChange={(selected) => setSelectedName(selected?.value || null)}
              placeholder="Select vaccine"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#fffaf2",
                  borderColor: "#e7d5c0",
                  color: "#5a3e32",
                  borderRadius: "8px",
                  fontFamily: "Comfortaa, cursive",
                  fontSize: "1rem",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#dabd9f" },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#fffaf2",
                  color: "#5a3e32",
                  fontFamily: "Comfortaa, cursive",
                  borderRadius: "8px",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#fce8c8" : "#fffaf2",
                  color: "#5a3e32",
                  cursor: "pointer",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#5a3e32",
                }),
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>

          <Button type="submit" className="btn-primary">
            Save
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default VaccinationForm;
