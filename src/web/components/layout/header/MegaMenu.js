import React, { Fragment, useContext, useEffect, Component, useState } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import MenuCategory from "./MenuCategory";
import HorizaontalMenu from "./HorizaontalMenu";
import MobileSearch from "./MobileSearch";
import MenuContactUs from "./MenuContactUs";
import MenuGift from "./MenuGift";
import MenuUserSection from "./MenuUserSection";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import Wishlist from "./Wishlist";



const MegaMenu = () => {

    

    return (
        <>

            <div className="custom-container">
                <Row>
                    <Col>
                        <div className="navbar-menu">
                            <div className="category-left">
                                <MenuCategory />
                                <HorizaontalMenu />
                                <div className="icon-block">
                                    <ul>
                                        <MenuUserSection />
                                        
                                        <Wishlist />

                                        <MobileSearch />
                                        {/* <MobileSetting /> */}
                                    </ul>
                                </div>
                            </div>
                            <div className="category-right">
                                <MenuContactUs spanClass="" />
                                <MenuGift />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );

}


export default MegaMenu;
