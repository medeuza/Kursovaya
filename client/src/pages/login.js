import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import GlobalStyle from "../GlobalStyle";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/users/login",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      const decoded = jwtDecode(access_token);
      if (decoded.role === "service") {
        navigate("/service-panel");
      } else {
        navigate("/pets");
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your username and password.");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button type="submit" className="btn-primary w-100">
              Login
            </Button>
          </Form>

          <div className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
