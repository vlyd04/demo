import React, { useContext, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import {  Row, Col, Media } from "reactstrap";
import Config from "../../../helpers/Config";
import { getFileExtensionNameFromPath } from "../../../helpers/ConversionHelper";

const ProductDetailImages = (props) => {
    const slider1 = useRef(Slider);
    const slider2 = useRef(Slider);
    const [state, setState] = useState({ nav1: null, nav2: null });
    const [imagesList, setImagesList] = useState([]);
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);

    useEffect(() => {
        setState({
            nav1: slider1.current,
            nav2: slider2.current,
        });
    }, []);
    const { nav1, nav2 } = state;




   
    const MakeImageList = () => {
        
        let arrayData = [];
        if(props.ProductImages!=undefined && props.ProductImages!=null && props.ProductImages.length>0){
            
            for (let i = 0; i < props.ProductImages.length; i++) {
                
                arrayData.push({
                    __typename : getFileExtensionNameFromPath(),
                    alt:"product detail image " + i,
                    src: (adminPanelBaseURL+ props.ProductImages[i].AttachmentURL),
                });
            }
        }
       
        setImagesList(arrayData);
       
    }

    useEffect(() => {
        MakeImageList();
    }, [props.ProductImages])


    return (


        <>
            <Slider className="product-slick" asNavFor={nav2} ref={(slider) => (slider1.current = slider)}>
                {imagesList &&
                    imagesList.map((img, i) => {
                        return (
                            <div key={i}>
                                <Media src={img.src} alt="" className="img-fluid  image_zoom_cls-0" />
                            </div>
                        );
                    })}
            </Slider>
            <Row>
                <Col>
                    <Slider className="slider-nav" asNavFor={nav1} ref={(slider) => (slider2.current = slider)} slidesToShow={3} swipeToSlide={true} focusOnSelect={true} arrows={false} adaptiveHeight={true}>
                        {imagesList &&
                            imagesList.map((img, i) => {
                                return (
                                    <div key={i}>
                                        <Media src={img.src} alt="" className="img-fluid  image_zoom_cls-0" />
                                    </div>
                                );
                            })}
                    </Slider>
                </Col>
            </Row>
        </>
    );


}
export default ProductDetailImages;
