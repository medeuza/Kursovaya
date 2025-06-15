import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import GlobalStyle from "../GlobalStyle";
import apiClient from "../api/axios";

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
      const response = await apiClient.post("/users/login",
          new URLSearchParams({ username, password }),
          {headers: {"Content-Type": "application/x-www-form-urlencoded",},});

      console.log("🔐 Login response:", response.data);

      const token = response.data.access_token;
      if (!token) {
        setError("No token received. Check API response format.");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      console.log("👤 Decoded JWT:", decoded);

      if (decoded.role === "service") {
        navigate("/select-clinic");
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
