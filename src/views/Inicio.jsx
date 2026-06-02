import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
    <div className="inicio-container">
      {/* SECCION HERO */}
      <section className="hero-section">
        <Container fluid className="hero-content">
          <Row className="align-items-center h-100">
            <Col lg={6} className="hero-text">
              <h1 className="hero-title">
                BIEN<span className="text-oro">VENIDOS</span>
              </h1>
              <h2 className="hero-subtitle">MOTO REPUESTOS ALEMAN</h2>
              <p className="hero-tagline">"Tu mejor opcion en repuestos de motos"</p>
              <p className="hero-description">
                En Moto Repuestos Aleman, nos apasiona el mundo de las motos y nos 
                dedicamos a ofrecerte los mejores repuestos para tu vehiculo. Con una 
                amplia gama de productos de alta calidad. Ya sea que necesites piezas 
                de motor, frenos, suspension o accesorios.
                <br />
                <br />
               Explora nuestro catalogo y encuentra los repuestos perfectos para tu 
                moto hoy mismo!Descbrenos!
              </p>

            </Col>
            <Col lg={6} className="hero-visual">
              <div className="hero-wrapper">
                <img
                  src={motoImg}
                  alt="Moto Roja"
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
      </section>

      {/* Características eliminadas por solicitud del usuario */}
    </div>
  );
};

export default Inicio;

/* holaaaaaaaaaaaaaaaaaaaaaaaaaaaa*/