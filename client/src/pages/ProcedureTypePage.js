import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import GlobalStyle from "../GlobalStyle";

const ProcedureTypePage = () => {
  const navigate = useNavigate();
  const appointmentId = localStorage.getItem("appointment_id");
  const petId = localStorage.getItem("pet_id");

  if (!appointmentId || !petId) {
    return (
      <Container className="mt-5 text-center">
        <h3>Error: appointment not found</h3>
      </Container>
    );
  }

  const handleNavigate = (path) => {
    localStorage.setItem("appointment_id", appointmentId);
    localStorage.setItem("pet_id", petId);
    navigate(path);
  };

  const cardStyle = {
    backgroundColor: "#fffaf2",
    border: "1px solid #e3c8b1",
    borderRadius: "20px",
    padding: "2rem",
    textAlign: "center",
    fontFamily: "Comfortaa, cursive",
    color: "#5a3e32",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "0.2s ease",
    cursor: "pointer",
  };

  const cardHover = {
    backgroundColor: "#fff0d6",
  };

  return (
    <>
      <GlobalStyle />
      <Container className="mt-5">
        <h2 className="text-center mb-4">Choose Procedure</h2>
        <Row className="justify-content-center g-4">
          <Col xs={12} md={4}>
            <div
              style={cardStyle}
              onClick={() => handleNavigate("/analysis-form")}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, cardHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Medical Analysis</h4>
              <p>
                Schedule lab tests for diagnostics and health monitoring. Useful for blood, urine, and more.
              </p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div
              style={cardStyle}
              onClick={() => handleNavigate("/vaccination-form")}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, cardHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Vaccination</h4>
              <p>
                Protect your pet from common diseases. Choose vaccines and register dosage records.
              </p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div
              style={cardStyle}
              onClick={() => handleNavigate("/appointments")}
              onMouseOver={(e) => Object.assign(e.currentTarget.style, cardHover)}
              onMouseOut={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Check-Up</h4>
              <p>
                Routine examination to keep your pet healthy. No extra procedures needed.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProcedureTypePage;
