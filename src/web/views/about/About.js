import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Config from '../../../helpers/Config';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import { Media, Row, Col, Container } from "reactstrap";
import aboutImg from '../../../resources/custom/images/about-us.jpg';
import CustomerTestimonial from '../../components/shared/CustomerTestimonial';

const About = () => {
  const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);

  return (
    <>


      <Helmet>
        <title>{siteTitle} - About Us</title>
        <meta name="description" content={siteTitle + " - About us page"}  />
        <meta name="keywords" content="About us"></meta>
      </Helmet>

      <SiteBreadcrumb title="About-Us" parent="Home"/>

      <section className="about-page section-big-py-space">
        <div className="custom-container">
          <Row>
            <Col lg="6">
              <div className="banner-section">
                <Media src={aboutImg} className="img-fluid w-100" alt="" />
              </div>
            </Col>
            <Col lg="6">
              <h4>About our Store</h4>
              <p className="mb-2">
                {" "}
                Welcome to <b>Noor Shop</b> , your one-stop-shop for all your online shopping needs!
              </p>
              <p className="mb-2">
                {" "}
                Our website is built using the latest technologies such as ASP.NET MVC .NET 6 and ReactJS to provide you with a seamless and intuitive shopping experience. 
                We offer a wide range of products from various categories, including electronics, fashion, beauty, home and living, sports and fitness, and much more.
              </p>
              <p className="mb-2">
                {" "}
               
                At <b>Noor Shop</b>, we are dedicated to providing our customers with the highest level of service and satisfaction. Our team works tirelessly to ensure that our website is up-to-date with the latest products, prices, and promotions. We also strive to make the shopping process as easy and convenient as possible for our customers.
              </p>
              <p>
                {" "}
                We are committed to delivering the highest quality products from the most reliable suppliers at competitive prices. 
                We believe in transparency and honesty in all our <b>business dealings</b>, and we take pride in delivering products that meet our customers' expectations..
              </p>
            </Col>
          </Row>
        </div>
      </section>

      <CustomerTestimonial />

    </>
  );

}

export default About;
