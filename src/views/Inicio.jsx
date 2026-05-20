import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import motoImg from "../assets/moto.png";
import motoImg2 from "../assets/llantas.webp";
import motoImg3 from "../assets/repuestos.png";

const Inicio = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <Container
      fluid
      className="hero-landing"
      style={{
        paddingTop: "2.5rem",
        paddingBottom: "2.5rem",
        marginTop: "6cm",
      }}
    >
      <Row className="align-items-center">
        <Col md={6} className="hero-text p-4">
          <h1 className="display-5">BIENVENIDOS</h1>
          <p className="lead">MOTO REPUESTOS ALEMAN
            <br />“Tu mejor opcion en repuestos de motos”
            <br />
              En Moto Repuestos Aleman, nos apasiona el mundo de las motos y nos dedicamos a ofrecerte los mejores repuestos para tu vehículo. 
              Con una amplia gama de productos de alta calidad. Ya sea que necesites piezas de motor, frenos, suspensión o accesorios. 
              ¡Explora nuestro catálogo y encuentra los repuestos perfectos para tu moto hoy mismo! 
              ¡Descubrenos!
          </p>

          <Button className="btn-primary">Leer Mas</Button>
        </Col>
        <Col md={6} className="hero-visual p-4">
          <div className="hero-wrapper">
            <div
              className="logo-fondo"
              style={{ backgroundImage: `url(${logo})` }}
            />
            <img
              src={motoImg}
              alt="Moto R3"
              className={`hero-moto ${animate ? "enter" : ""}`}
            />

            <img
              src={motoImg2}
              alt="Llantas"
              className={`hero-part part1 ${animate ? "enter" : ""}`}
            />

            <img
              src={motoImg3}
              alt="Repuestos"
              className={`hero-part part2 ${animate ? "enter" : ""}`}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
