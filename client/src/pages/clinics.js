import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";



function ClinicsPage() {
  const [allClinics, setAllClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [clinicNames, setClinicNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  const token = localStorage.getItem("token");

  const fetchClinics = () => {
    axios
      .get("http://127.0.0.1:8000/clinics/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const clinics = res.data;
        setAllClinics(clinics);

        const names = [...new Set(clinics.map(c => c.name))];
        setClinicNames(names);

        if (names.length > 0) {
          setSelectedName(names[0]);
          setFilteredClinics(clinics.filter(c => c.name === names[0]));
        }
      })
      .catch((err) => {
        console.error("Ошибка при загрузке клиник:", err.response?.data || err.message);
      });
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleSelectChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);
    const filtered = allClinics.filter(c => c.name === name);
    setFilteredClinics(filtered);
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
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Veterinary Clinics⚕️</h2>

        <Form.Select className="mb-4" value={selectedName} onChange={handleSelectChange}>
          {clinicNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </Form.Select>

        {filteredClinics.length === 0 ? (
          <p>No clinics found for <strong>{selectedName}</strong>.</p>
        ) : (
          <Table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} onClick={() => {
                  localStorage.setItem("selected_clinic_id", clinic.id);
                  window.location.href = "/appointments";
                }} style={{ cursor: "pointer" }}>
                  <td>{clinic.id}</td>
                  <td>{clinic.address}</td>
                  <td>{clinic.phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
}

export default ClinicsPage;
