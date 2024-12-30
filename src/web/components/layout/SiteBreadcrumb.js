import React from "react";
import { Row, Col, Container } from "reactstrap";


const SiteBreadcrumb = ({title , parent}) => {

    return (
        <>
          
            <div className="breadcrumb-main ">
                <Container>
                    <Row>
                        <Col>
                            <div className="breadcrumb-contain">
                                <div>
                                    <h2>{title}</h2>
                                    <ul>
                                        <li>
                                            <a href="#">{parent}</a>
                                        </li>
                                        <li>
                                            <i className="fa fa-angle-double-right"></i>
                                        </li>
                                        <li>
                                            <a href="#">{title}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );

}

export default SiteBreadcrumb;