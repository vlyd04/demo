import React from "react";
import { Row, Col, Container, Media } from "reactstrap";
import myImage from '../../../resources/custom/images/call_img.png';

const ContactBanner = () => {
  return (
    <>
      <section className="contact-banner">
        <Container>
          <Row>
            <Col>
              <div className="contact-banner-contain">
                <div className="contact-banner-img">
                  <Media src={myImage} className="img-fluid" alt="call-banner" />
                </div>
                <div>
                  <h3>if you have any question please call us</h3>
                </div>
                <div>
                  <h2>92-343-3219800</h2>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ContactBanner;
