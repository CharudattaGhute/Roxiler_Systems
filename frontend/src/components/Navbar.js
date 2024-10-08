// src/components/Navbar.js
import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavigationBar = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
    // Add your logout logic here
    // For example, clearing user session, localStorage, etc.
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">Transaction App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" onClick={() => console.log("Home clicked")}>
            Home
          </Nav.Link>
          <Nav.Link
            href="#"
            onClick={() => console.log("Transactions clicked")}
          >
            Transactions
          </Nav.Link>
          <Nav.Link
            href="#"
            onClick={() => console.log("Add Transaction clicked")}
          >
            Add Transaction
          </Nav.Link>
          <Nav.Link href="#" onClick={() => console.log("About clicked")}>
            About
          </Nav.Link>
        </Nav>
        {/* Right-aligned logout */}
        <Nav className="ml-auto">
          <Nav.Link href="#" onClick={handleLogout}>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
