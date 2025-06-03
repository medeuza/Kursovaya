import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import GlobalStyle from "../GlobalStyle";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fffaf2",
    borderColor: state.isFocused ? "#dabd9f" : "#e7d5c0",
    boxShadow: "none",
    outline: "none",
    borderRadius: "8px",
    fontFamily: "Comfortaa, cursive",
    fontSize: "1rem",
    "&:hover": {
      borderColor: "#dabd9f",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fffaf2",
    color: "#5a3e32",
    fontFamily: "Comfortaa, cursive",
    borderRadius: "8px",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#fce8c8"
      : isFocused
      ? "#f9e2b0"
      : "#fffaf2",
    color: "#5a3e32",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#5a3e32",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#b39274",
    "&:hover": {
      color: "#a27858",
    },
  }),
};

const roleOptions = [
  { value: "user", label: "User" },
  { value: "service", label: "Service" },
];

const RegisterPage = () => {
  const [role, setRole] = useState(roleOptions[0]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/users/register",
        {
          user_name: username,
          email: email,
          password: password,
          role: role.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. The user may already exist.");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Account Type</Form.Label>
              <Select
                options={roleOptions}
                value={role}
                onChange={setRole}
                placeholder="Select account type"
                styles={customSelectStyles}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="btn-edit w-100">
              Register
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RegisterPage;
