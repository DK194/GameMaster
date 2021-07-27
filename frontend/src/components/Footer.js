import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer 
      className='
        border 
        border-start-0 
        border-end-0 
        border-3 
        border-secondary'
    >
      <Container>
        <Row>
          <Col 
            className='
              text-color-white 
              text-center 
              py-3'
          >
            Game Master Shop &copy; 2021
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
