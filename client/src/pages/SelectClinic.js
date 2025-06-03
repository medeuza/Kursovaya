import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Nav, Table } from "react-bootstrap";
import Select from "react-select";
import GlobalStyle from "../GlobalStyle";
import { Map, Placemark, useYMaps } from "@pbe/react-yandex-maps";

function SelectClinic() {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const ymaps = useYMaps(["geocode"]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8000/clinics/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClinics(res.data);
      })
      .catch((err) => console.error("Error loading clinics:", err));
  }, [token]);

  useEffect(() => {
    if (!ymaps) return;
    ymaps.ready(() => setApiReady(true));
  }, [ymaps]);

  const handleSelect = async (selected) => {
    const clinic = clinics.find((c) => c.id === selected.value);
    if (!clinic) return;

    if (apiReady) {
      try {
        const res = await ymaps.geocode(clinic.address);
        const coords = res.geoObjects.get(0)?.geometry.getCoordinates();
        clinic.coords = coords;
      } catch {
        console.warn("Geocode error:", clinic.address);
      }
    }

    setSelectedClinic(clinic);
  };

  const handleContinue = () => {
    if (selectedClinic) {
      localStorage.setItem("selected_clinic_id", selectedClinic.id);
      navigate("/services");
    }
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

        <h2>Select the clinic where you work</h2>

        <Form.Group className="mb-3">
          <Form.Label>Clinic</Form.Label>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={clinicOptions}
            placeholder="Choose a clinic"
            onChange={handleSelect}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#fffaf2",
                borderColor: "#e7d5c0",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                fontFamily: "Comfortaa, sans-serif",
                color: "#5a3e32",
              }),
              singleValue: (base) => ({ ...base, color: "#5a3e32" }),
              menu: (base) => ({ ...base, backgroundColor: "#fffaf2" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#ffe1a8" : "#fffaf2",
                color: "#5a3e32",
              }),
            }}
          />
        </Form.Group>

        {selectedClinic && (
          <>
            <Table bordered hover>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedClinic.id}</td>
                  <td>{selectedClinic.name}</td>
                  <td>{selectedClinic.address}</td>
                  <td>{selectedClinic.phone}</td>
                </tr>
              </tbody>
            </Table>

            {selectedClinic.coords && (
              <Map state={{ center: selectedClinic.coords, zoom: 14 }} width="100%" height="400px">
                <Placemark
                  geometry={selectedClinic.coords}
                  properties={{
                    hintContent: selectedClinic.name,
                    balloonContent: `<strong>${selectedClinic.address}</strong>`,
                  }}
                />
              </Map>
            )}

            <div className="mt-3">
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export default SelectClinic;
