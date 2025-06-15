import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Nav } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import GlobalStyle from "../GlobalStyle";
import apiClient from "../api/axios";

const AnalysisForm = () => {
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const appointmentId = localStorage.getItem("appointment_id");

  useEffect(() => {
    const fetchAnalysisTypes = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await apiClient.get("/analysis-types/", { headers });
        setAnalysisTypes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load analysis types");
        setLoading(false);
      }
    };
      fetchAnalysisTypes();
    }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setError("Please select an analysis type.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await apiClient.post(
        "/analyses/",
        {
          appointment_id: Number(appointmentId),
          analysis_type_id: Number(selectedId),
        },
        { headers }
      );
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      setError("Failed to save analysis");
    }
  };


  return (
    <>
      <GlobalStyle />
      <div className="container mt-5">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item><Nav.Link as={Link} to="/pets">Pets</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/appointments">Appointments</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/vaccinations">Vaccinations</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/medicines">Medicines</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Add Medical Analysis</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Analysis Type</Form.Label>
            <Select
              isDisabled={loading || analysisTypes.length === 0}
              options={analysisTypes.map((a) => ({
                value: a.id,
                label: `${a.name} — ${a.description}`,
              }))}
              value={analysisTypes
                .map((a) => ({ value: a.id, label: `${a.name} — ${a.description}` }))
                .find((option) => option.value === Number(selectedId)) || null}
              onChange={(selected) => setSelectedId(selected?.value || null)}
              placeholder={loading ? "Loading..." : "Select an analysis type"}
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

          <Button type="submit" className="btn-primary" disabled={loading || analysisTypes.length === 0}>
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AnalysisForm;
