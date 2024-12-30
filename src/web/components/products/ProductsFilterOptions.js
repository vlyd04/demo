import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import filterIcon2 from '../../../resources/themeContent/images/category/icon/2.png';
import filterIcon3 from '../../../resources/themeContent/images/category/icon/3.png';
import filterIcon4 from '../../../resources/themeContent/images/category/icon/4.png';



const ProductsFilterOptions = (props) => {

    

    return (
        <>
            <Row>
                <Col xs="12">
                    <div className="filter-main-btn">
                        <span
                            className="filter-btn"
                            onClick={(e) => {
                                props.setLeftSidebarOpenCloseFromFilter(e,true);
                            }}>
                            <i className="fa fa-filter" aria-hidden="true"></i> Filter
                        </span>
                    </div>
                </Col>
                <Col xs="12">
                    <div className="product-filter-content">

                        <div className="collection-view">
                            <ul>
                                <li
                                    onClick={() => {
                                        props.setLayout("");
                                        props.setGrid(props.cols);
                                    }}>
                                    <i className="fa fa-th grid-layout-view"></i>
                                </li>
                                <li
                                    onClick={() => {
                                        props.setLayout("list-view");
                                        props.setGrid("col-lg-12");
                                    }}>
                                    <i className="fa fa-list-ul list-layout-view"></i>
                                </li>
                            </ul>
                        </div>
                        <div className="collection-grid-view" style={props.layout === "list-view" ? { opacity: 0 } : { opacity: 1 }}>
                            <ul>
                                <li onClick={() => props.setGrid("col-lg-6")}>
                                    <img src={filterIcon2} alt="" className="product-2-layout-view" />
                                </li>
                                <li onClick={() => props.setGrid("col-lg-4")}>
                                    <img src={filterIcon3} alt="" className="product-3-layout-view" />
                                </li>
                                <li onClick={() => props.setGrid("col-lg-3")}>
                                    <img src={filterIcon4} alt="" className="product-4-layout-view" />
                                </li>
                            </ul>
                        </div>
                        <div className="product-page-per-view">
                            {/* <select >
                                <option value="10">10 Products Par Page</option>
                                <option value="15">15 Products Par Page</option>
                                <option value="20">20 Products Par Page</option>
                            </select> */}
                            <select onChange={(e) => props.setPageSizeFromProductFilter(e)}>
                                <option value="10">10 Products Par Page</option>
                                <option value="15">15 Products Par Page</option>
                                <option value="20">20 Products Par Page</option>
                                <option value="30">30 Products Par Page</option>
                                <option value="40">40 Products Par Page</option>
                                <option value="50">50 Products Par Page</option>
                                <option value="100">100 Products Par Page</option>
                            </select>
                        </div>
                        <div className="product-page-filter">
                           
                            <select onChange={(e) => props.setSortByFilter(e)}>
                                <option value="">Featured</option>
                             
                                <option value="Price ASC">Price Ascending</option>
                                <option value="Price DESC">Price Descending</option>
                                <option value="Date DESC">Date Ascending</option>
                                <option value="Date ASC">Date Descending</option>
                               
                            </select>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ProductsFilterOptions;
