import React, { Fragment, useContext, useEffect, Component, useState } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import MenuBar from "./MenuBar";




const HorizaontalMenu = () => {
    const [menuResponsive, setMenuResponsive] = useState(false);
    return (
      <>
        <div
          className={`menu-overlay ${menuResponsive ? "active" : ""}`}
          onClick={() => {
            setMenuResponsive(!menuResponsive);
            document.body.style.overflow = "visible";
          }}></div>
        <div className="menu-block">
          <nav id="main-nav">
            <div
              className="toggle-nav"
              onClick={() => {
                setMenuResponsive(!menuResponsive);
                document.body.style.overflow = "hidden";
              }}>
              <i className="fa fa-bars sidebar-bar"></i>
            </div>
            <ul id="main-menu" className={`sm pixelstrap sm-horizontal ${menuResponsive ? "menu-open" : ""}`}>
              <MenuBar setMenuResponsive = {setMenuResponsive}/>
            </ul>
          </nav>
        </div>
      </>
    );
  };


export default HorizaontalMenu;
