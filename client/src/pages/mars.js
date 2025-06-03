import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import marsImg from "../assets/mars928.jpg";

function Mars() {
  return (
    <>
      <GlobalStyle />
      <div className="container mt-5" style={{ fontFamily: "Comfortaa" }}>
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

        <h2 className="mb-4">Mars!</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", backgroundColor: "#fffaf2", padding: "1.5rem", borderRadius: "12px", color: "#5a3e32" }}>
          The muse, motivator and important contributor of the project.
          His presence brought peace and tranquility to every debugging session 🧘🏼‍♀️.
        </p>

        <div className="text-center mt-4">
          <img src={marsImg} alt="Mars the Dog" style={{ maxWidth: "100%", height: "auto", borderRadius: "20px", boxShadow: "0 0 20px rgba(0,0,0,0.1)" }} />
        </div>
      </div>
    </>
  );
}

export default Mars;