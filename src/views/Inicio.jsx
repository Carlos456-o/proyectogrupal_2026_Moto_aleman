import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Inicio = () => {
  return (
    <Container style={{ marginTop: "2cm" }}>
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi bi-house-fill me-2"></i> Inicio</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;