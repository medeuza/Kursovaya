import React, { useState } from "react";
import { Nav, Card, Modal, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import GlobalStyle from "../GlobalStyle";
import "../App.css";
import apiClient from "../api/axios";

const AddDataPage = () => {
  const token = localStorage.getItem("token");

  const [modal, setModal] = useState({
    show: false,
    type: "",
    mode: "add",
    step: 1,
  });

  const [searchName, setSearchName] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const [message, setMessage] = useState("");
const [variant, setVariant] = useState("success");

const [form, setForm] = useState({
    vaccine: { name: "", type: "", manufacturer: "" },
    breed: { name: "" },
    clinic: { name: "", address: "", phone: "" },
    analysis: { name: "", description: "", instructions: "" },
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleAdd = async () => {
    let endpoint = "";
    let payload = {};
    try {
      switch (modal.type) {
        case "vaccines": endpoint = "/vaccines/"; payload = form.vaccine; break;
        case "breeds": endpoint = "/breeds/"; payload = form.breed; break;
        case "clinics": endpoint = "/clinics/"; payload = form.clinic; break;
        case "analysis-types": endpoint = "/analysis-types/"; payload = form.analysis; break;
      }

  if (!endpoint) {
    setVariant("danger");
    setMessage("Unknown type for addition.");
    return;
  }
  console.log(endpoint);
await apiClient.post(endpoint, payload, { headers });
      setVariant("success"); setMessage("Added successfully.");
      setModal({ ...modal, show: false });
    } catch (err) {
      setVariant("danger"); setMessage("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async () => {
    if (!deleteName.trim()) return;
    try {
      const res = await apiClient.get(`${modal.type}/`, { headers });
      const match = res.data.find((item) => item.name.toLowerCase() === deleteName.toLowerCase());
      if (!match) return setVariant("danger"); setMessage("Item not found.");
      await apiClient.delete(`${modal.type}/${match.id}`, { headers });
      setVariant("success"); setMessage("Deleted successfully.");
      setModal({ ...modal, show: false });
    } catch (err) {
      setVariant("danger"); setMessage("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = async () => {
    try {
      const res = await apiClient.get(`${modal.type}/`, { headers });
      const match = res.data.find((item) => item.name.toLowerCase() === searchName.toLowerCase());
      if (!match) return setVariant("danger"); setMessage("Item not found.");

      let payload = {};
      switch (modal.type) {
        case "vaccines": payload = form.vaccine; break;
        case "breeds": payload = form.breed; break;
        case "clinics": payload = form.clinic; break;
        case "analysis-types": payload = form.analysis; break;
      }

      const requiredFieldsFilled = Object.values(payload).every((val) => val.trim() !== "");
      if (!requiredFieldsFilled) return setVariant("danger"); setMessage("Please fill in all fields.");

      await apiClient.put(`${modal.type}/${match.id}`, payload, { headers });
      setVariant("success"); setMessage("Updated successfully.");
      setModal({ ...modal, show: false, step: 1 });
    } catch (err) {
      setVariant("danger"); setMessage("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleShowModal = (type, mode) => {
    setModal({ show: true, type, mode, step: 1 });
    setSearchName("");
    setDeleteName("");
    setForm({
      vaccine: { name: "", type: "", manufacturer: "" },
      breed: { name: "" },
      clinic: { name: "", address: "", phone: "" },
      analysis: { name: "", description: "", instructions: "" },
    });
  };

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

         {message && (
  <Alert variant={variant} onClose={() => setMessage("")} dismissible>
    {message}
  </Alert>
)}

<h2 className="mb-3">Can't find what you're looking for? •︵• </h2>
        <p className="mb-4">
          If you couldn’t find your pet’s breed, the desired clinic, analysis type, or vaccine,
          you can add it to our database, and we’ll promptly make it available in the app.
        </p>

        <div className="row">
          {["vaccines", "breeds", "clinics", "analysis-types"].map((type) => (
            <div className="col-md-6 col-lg-3 mb-4" key={type}>
              <Card className="h-100 text-center p-3">
                <Card.Title>{type.toUpperCase()}</Card.Title>
                <div className="custom-btn pastel-green m-1" onClick={() => handleShowModal(type, "add")}>Add</div>
                <div className="custom-btn pastel-yellow m-1" onClick={() => handleShowModal(type, "edit")}>Edit</div>
                <div className="custom-btn pastel-pink m-1" onClick={() => handleShowModal(type, "delete")}>Delete</div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Modal show={modal.show} onHide={() => setModal({ ...modal, show: false })} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modal.mode.toUpperCase()} {modal.type.toUpperCase()}</Modal.Title>
        </Modal.Header>

<Modal.Body>
  {/* DELETE */}
  {modal.mode === "delete" && (
    <Form.Group>
      <Form.Label>Enter name to delete</Form.Label>
      <Form.Control
        value={deleteName}
        onChange={(e) => setDeleteName(e.target.value)}
        placeholder="Enter name"
      />
    </Form.Group>
  )}

  {/* ADD MODE */}
  {modal.mode === "add" && modal.type === "vaccines" && (
    <>
      <Form.Group>
        <Form.Label>Vaccine Name</Form.Label>
        <Form.Control
          placeholder="Enter vaccine name"
          value={form.vaccine.name}
          onChange={(e) =>
            setForm({ ...form, vaccine: { ...form.vaccine, name: e.target.value } })
          }
        />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Type</Form.Label>
        <Form.Control
          placeholder="Enter type"
          value={form.vaccine.type}
          onChange={(e) =>
            setForm({ ...form, vaccine: { ...form.vaccine, type: e.target.value } })
          }
        />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Manufacturer</Form.Label>
        <Form.Control
          placeholder="Enter manufacturer"
          value={form.vaccine.manufacturer}
          onChange={(e) =>
            setForm({ ...form, vaccine: { ...form.vaccine, manufacturer: e.target.value } })
          }
        />
      </Form.Group>
    </>
  )}

  {modal.mode === "add" && modal.type === "breeds" && (
    <Form.Group>
      <Form.Label>Breed Name</Form.Label>
      <Form.Control
        placeholder="Enter breed name"
        value={form.breed.name}
        onChange={(e) => setForm({ ...form, breed: { name: e.target.value } })}
      />
    </Form.Group>
  )}

  {modal.mode === "add" && modal.type === "clinics" && (
    <>
      <Form.Group>
        <Form.Label>Clinic Name</Form.Label>
        <Form.Control
          placeholder="Enter clinic name"
          value={form.clinic.name}
          onChange={(e) =>
            setForm({ ...form, clinic: { ...form.clinic, name: e.target.value } })
          }
        />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Address</Form.Label>
        <Form.Control
          placeholder="Enter address"
          value={form.clinic.address}
          onChange={(e) =>
            setForm({ ...form, clinic: { ...form.clinic, address: e.target.value } })
          }
        />
      </Form.Group>
      <Form.Group className="mt-2">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          placeholder="Enter phone"
          value={form.clinic.phone}
          onChange={(e) =>
            setForm({ ...form, clinic: { ...form.clinic, phone: e.target.value } })
          }
        />
      </Form.Group>
    </>
  )}

  {modal.mode === "add" && modal.type === "analysis-types" && (
    <>
      <Form.Control
        placeholder="Name"
        value={form.analysis.name}
        onChange={(e) =>
          setForm({ ...form, analysis: { ...form.analysis, name: e.target.value } })
        }
      />
      <Form.Control
        placeholder="Description"
        className="mt-2"
        value={form.analysis.description}
        onChange={(e) =>
          setForm({ ...form, analysis: { ...form.analysis, description: e.target.value } })
        }
      />
      <Form.Control
        placeholder="Instructions"
        className="mt-2"
        value={form.analysis.instructions}
        onChange={(e) =>
          setForm({ ...form, analysis: { ...form.analysis, instructions: e.target.value } })
        }
      />
    </>
  )}

  {/* EDIT STEP 1: Search by name */}
  {modal.mode === "edit" && modal.step === 1 && (
    <>
      <Form.Group>
        <Form.Label>Enter current name</Form.Label>
        <Form.Control
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Existing name"
        />
      </Form.Group>
      <div className="custom-btn pastel-green mt-3" onClick={async () => {
        try {
          const res = await apiClient.get(`${modal.type}/`, { headers });
          const match = res.data.find((item) =>
            item.name.toLowerCase() === searchName.toLowerCase()
          );
          if (!match) return setVariant("danger"); setMessage("Item not found.");

          if (modal.type === "vaccines") {
            setForm({ ...form, vaccine: { name: match.name, type: match.type, manufacturer: match.manufacturer } });
          } else if (modal.type === "breeds") {
            setForm({ ...form, breed: { name: match.name } });
          } else if (modal.type === "clinics") {
            setForm({ ...form, clinic: { name: match.name, address: match.address, phone: match.phone } });
          } else if (modal.type === "analysis-types") {
            setForm({ ...form, analysis: { name: match.name, description: match.description, instructions: match.instructions } });
          }

          setModal({ ...modal, step: 2 });
        } catch (err) {
          setVariant("danger"); setMessage("Error: " + (err.response?.data?.detail || err.message));
        }
      }}>Next</div>
    </>
  )}

  {/* EDIT STEP 2: Edit fields */}
  {modal.mode === "edit" && modal.step === 2 && (
    <>
      {modal.type === "vaccines" && (
        <>
          <Form.Control className="mb-2" placeholder="Vaccine name" value={form.vaccine.name}
            onChange={(e) => setForm({ ...form, vaccine: { ...form.vaccine, name: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Type" value={form.vaccine.type}
            onChange={(e) => setForm({ ...form, vaccine: { ...form.vaccine, type: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Manufacturer" value={form.vaccine.manufacturer}
            onChange={(e) => setForm({ ...form, vaccine: { ...form.vaccine, manufacturer: e.target.value } })}/>
        </>
      )}
      {modal.type === "breeds" && (
        <Form.Control className="mb-2" placeholder="Breed name" value={form.breed.name}
          onChange={(e) => setForm({ ...form, breed: { name: e.target.value } })}/>
      )}
      {modal.type === "clinics" && (
        <>
          <Form.Control className="mb-2" placeholder="Clinic name" value={form.clinic.name}
            onChange={(e) => setForm({ ...form, clinic: { ...form.clinic, name: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Address" value={form.clinic.address}
            onChange={(e) => setForm({ ...form, clinic: { ...form.clinic, address: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Phone" value={form.clinic.phone}
            onChange={(e) => setForm({ ...form, clinic: { ...form.clinic, phone: e.target.value } })}/>
        </>
      )}
      {modal.type === "analysis-types" && (
        <>
          <Form.Control className="mb-2" placeholder="Name" value={form.analysis.name}
            onChange={(e) => setForm({ ...form, analysis: { ...form.analysis, name: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Description" value={form.analysis.description}
            onChange={(e) => setForm({ ...form, analysis: { ...form.analysis, description: e.target.value } })}/>
          <Form.Control className="mb-2" placeholder="Instructions" value={form.analysis.instructions}
            onChange={(e) => setForm({ ...form, analysis: { ...form.analysis, instructions: e.target.value } })}/>
        </>
      )}
    </>
  )}
</Modal.Body>
        <Modal.Footer>
          <div className="custom-btn pastel-pink" onClick={() => setModal({ ...modal, show: false })}>Cancel</div>
          {modal.mode === "edit" && modal.step === 1 ? (
            <div className="custom-btn pastel-green" onClick={() => setModal({ ...modal, step: 2 })}>Next</div>
          ) : modal.mode === "edit" ? (
            <div className="custom-btn pastel-green" onClick={handleEdit}>Save</div>
          ) : modal.mode === "delete" ? (
            <div className="custom-btn pastel-green" onClick={handleDelete}>Delete</div>
          ) : (
            <div className="custom-btn pastel-green" onClick={handleAdd}>Add</div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddDataPage;