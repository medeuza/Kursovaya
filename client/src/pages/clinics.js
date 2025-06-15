import React, { useEffect, useState } from "react";
import { Table, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import Select from "react-select";
import "../App.css";
import apiClient from "../api/axios";
import { Map, Placemark, useYMaps } from "@pbe/react-yandex-maps";

function ClinicsPage() {
  const [allClinics, setAllClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [clinicOptions, setClinicOptions] = useState([]);
  const [selectedClinicOption, setSelectedClinicOption] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const ymaps = useYMaps(["geocode"]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!ymaps) return;
    ymaps.ready(async () => {
      setApiReady(true);
      try {
        const res = await apiClient.get("/clinics/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const clinics = res.data;
        setAllClinics(clinics);

        const uniqueNames = [...new Set(clinics.map((c) => c.name))];
        setClinicOptions(uniqueNames.map((name) => ({ value: name, label: name })));

        const geocoded = await Promise.all(
          clinics.map(async (clinic) => {
            try {
              const geo = await ymaps.geocode(clinic.address);
              const coords = geo.geoObjects.get(0)?.geometry.getCoordinates();
              return coords ? { ...clinic, coords } : clinic;
            } catch (e) {
              console.warn("Failed geocoding:", clinic.address);
              return clinic;
            }
          })
        );

        setFilteredClinics(geocoded);
        setAllClinics(geocoded);
      } catch (err) {
        console.error("Ошибка при загрузке клиник:", err.response?.data || err.message);
      }
    });
  }, [ymaps]);

  const handleSelectChange = (selected) => {
    setSelectedClinicOption(selected);
    if (!selected) {
      setFilteredClinics(allClinics);
    } else {
      const filtered = allClinics.filter((c) => c.name === selected.value);
      setFilteredClinics(filtered);
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
          <Nav.Item><Nav.Link as={Link} to="/analysis">Analyses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/clinics">Clinics</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/add-missing-data">Additional</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/mars">Lore</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link as={Link} to="/">Logout</Nav.Link></Nav.Item>
        </Nav>

        <h2 className="mb-4">Veterinary Clinics ⚕️</h2>
        <Select
          className="mb-4 react-select-container"
          classNamePrefix="react-select"
          value={selectedClinicOption}
          onChange={handleSelectChange}
          options={clinicOptions}
          placeholder="Select a clinic"
        />

         <Map state={{ center: [55.75, 37.57], zoom: 9 }} width="100%" height="500px">
          {filteredClinics.map((clinic, i) =>
            clinic.coords ? (
            <Placemark
              key={i}
              geometry={clinic.coords}
              properties={{
                hintContent: clinic.name,
                balloonContent: `<strong>${clinic.address}</strong>`
              }}
              options={{
                preset: "islands#blueIcon",
                openBalloonOnClick: true
              }}
              onClick={() => {
                const savedForm = JSON.parse(localStorage.getItem("appointment_form") || "{}");
                const updatedForm = { ...savedForm, clinicId: clinic.id };
                localStorage.setItem("appointment_form", JSON.stringify(updatedForm));
                window.location.href = "/appointments";
              }}
            />
            ) : null
          )}
        </Map>

        {filteredClinics.length === 0 ? (
          <p>No clinics found{selectedClinicOption ? ` for "${selectedClinicOption.label}"` : ""}.</p>
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
                <tr
                  key={clinic.id}
                  onClick={() => {
                    const savedForm = JSON.parse(localStorage.getItem("appointment_form") || "{}");
                    const updatedForm = { ...savedForm, clinicId: clinic.id };
                    localStorage.setItem("appointment_form", JSON.stringify(updatedForm));
                    window.location.href = "/appointments";
                  }}
                  style={{ cursor: "pointer" }}
                >
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
