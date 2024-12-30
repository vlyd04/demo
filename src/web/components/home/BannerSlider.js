import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import { Row, Col, Media } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { getLanguageCodeFromSession } from "../../../helpers/CommonHelper";
import Config from "../../../helpers/Config";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";

var settings = {
  autoplay: false,
  autoplaySpeed: 2500,
};





const BannerSlider = () => {
  const [elemOne, setElemOne] = useState({});
  const [bannerList, setBannerList] = useState([]);
  const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);

  const handleBannerButtonClickUrl = (url) => {
            
    if (url != undefined && url != null && url.length > 0) {
        window.location.href = url;
    } else {
        return false;
    }

}

  const onMouseHover = (e) => {
    const pageX = e.clientX - window.innerWidth / 1;
    const pageY = e.clientY - window.innerHeight / 1;
    var elemOne = {
      transform: "translateX(" + (7 + pageX / 150) + "%) translateY(" + (1 + pageY / 150) + "%)",
    };
    setElemOne(elemOne);
  };




  useEffect(() => {
    // declare the data fetching function
    const dataOperationFunc = async () => {



      const headers = {
        // customerid: userData?.UserID,
        // customeremail: userData.EmailAddress,
        Accept: 'application/json',
        'Content-Type': 'application/json',

      }


      const param = {
        requestParameters: {

          recordValueJson: "[]",
        },
      };


      //--Get product detail
      const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_HOME_SCREEN_BANNER'], null, param, headers, "POST", true);
      console.log(response);
      if (response != null && response.data != null) {
        await setBannerList(JSON.parse(response.data.data));
      }



    }

    // call the function
    dataOperationFunc().catch(console.error);
  }, [])




  return (
    <>
      <section className="theme-slider b-g-white " id="theme-slider">
        <div className="custom-container">
          <Row>
            <Col>
              <div className="slide-1 no-arrow">
                <Slider {...settings}>
                  {bannerList.filter(x=>x.ThemeTypeID == 2).map((banner, i) => (
                    <div className="slider-banner slide-banner-4" onMouseMove={(e) => onMouseHover(e)}>
                      <div className="slider-img home-banner-bg">
                        <ul className="layout5-slide-1">
                          <li style={elemOne} id="img-1">
                            <img src={adminPanelBaseURL + banner.BannerImgUrl} className="img-fluid" alt="slider" />
                          </li>
                        </ul>
                      </div>
                      <div className="slider-banner-contain">
                        <div>
                          <h3 className="home-top-title">{banner.TopTitle}</h3>
                          <h1>{banner.MainTitle}</h1>
                          <h2>{banner.BottomTitle}</h2>
                         
                          <Link className="btn home-btn-banner-left"
                            onClick={(e) => {
                              e.preventDefault();
                             handleBannerButtonClickUrl(banner.LeftButtonUrl);
                            }}
                          >
                            {banner.LeftButtonText}
                          </Link>


                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>

              </div>
            </Col>
          </Row>
        </div>
      </section>



    </>
  );
};

export default BannerSlider;
