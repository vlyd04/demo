import React, { useState, useEffect, useRef, useContext } from "react";
import Slider from "react-slick";
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Media } from "reactstrap";
import CountDownComponent from "../shared/CountDownComponent";
import myImage from '../../../resources/custom/images/hotdeal.jpg';
import Config from "../../../helpers/Config";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import { makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from "../../../helpers/ConversionHelper";
import ProductRatingStars from "./ProductRatingStars";
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession } from "../../../helpers/CommonHelper";

var bestSellerSetting = {
  dots: false,
  infinite: false,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


const productCollection = [
  {
    "__typename": "Product",
    "id": 12,
    "title": "boho tops",
    "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    "type": "fashion",
    "brand": "nike",
    "category": "Women",
    "price": 129,
    "new": false,
    "sale": false,
    "discount": 40,
    "stock": 45,
    "variants": [
      {
        "__typename": "VariantType",
        "id": "12.1",
        "sku": "sku12",
        "size": "xs",
        "color": "red",
        "image_id": 1211
      },
      {
        "__typename": "VariantType",
        "id": "12.2",
        "sku": "skul12",
        "size": "xs",
        "color": "pink",
        "image_id": 1212
      },
      {
        "__typename": "VariantType",
        "id": "12.3",
        "sku": "sku12s",
        "size": "xs",
        "color": "gray",
        "image_id": 1213
      },
      {
        "__typename": "VariantType",
        "id": "12.4",
        "sku": "sku12l",
        "size": "s",
        "color": "red",
        "image_id": 1211
      },
      {
        "__typename": "VariantType",
        "id": "12.5",
        "sku": "sku12l",
        "size": "s",
        "color": "pink",
        "image_id": 1212
      },
      {
        "__typename": "VariantType",
        "id": "12.6",
        "sku": "sku12l",
        "size": "s",
        "color": "gray",
        "image_id": 1213
      },
      {
        "__typename": "VariantType",
        "id": "12.7",
        "sku": "sku12l",
        "size": "m",
        "color": "red",
        "image_id": 1211
      },
      {
        "__typename": "VariantType",
        "id": "12.8",
        "sku": "sku12l",
        "size": "m",
        "color": "pink",
        "image_id": 1212
      },
      {
        "__typename": "VariantType",
        "id": "12.9",
        "sku": "sku12l",
        "size": "m",
        "color": "gray",
        "image_id": 1213
      }
    ],
    "images": [
      {
        "__typename": "ImageType",
        "image_id": 1211,
        "id": "12.1",
        "alt": "red",
        "src": "pro3/22.jpg"
      },
      {
        "__typename": "ImageType",
        "image_id": 1212,
        "id": "12.2",
        "alt": "pink",
        "src": "pro3/27.jpg"
      },
      {
        "__typename": "ImageType",
        "image_id": 1213,
        "id": "12.3",
        "alt": "black",
        "src": "pro3/38.jpg"
      }
    ]
  }
]

const TodayHotDeal = () => {
  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [HotProduct, setHopProduct] = useState({});
  const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);
  const [CustomerFavouritProd, setCustomerFavouriteProd] = useState([]);




  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);


  useEffect(() => {
    // declare the data fetching function
    const dataOperationInUseEffect = async () => {

      const headers = {

        Accept: 'application/json',
        'Content-Type': 'application/json',

      }


      const param = {
        requestParameters: {

          recordValueJson: "[]",
        },
      };


      const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_LATEST_HOT_PRODUCT'], null, param, headers, "POST", true);
      if (response != null && response.data != null) {
        let hProduct = JSON.parse(response.data.data);

        setHopProduct(hProduct != null && hProduct != undefined ? hProduct[0] : {});

      }

      const responseCustomerFav = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CUSTOMER_FAVOURITE_PRODUCTS'], null, param, headers, "POST", true);
      if (responseCustomerFav != null && responseCustomerFav.data != null) {
        let cusFav = JSON.parse(responseCustomerFav.data.data);
        setCustomerFavouriteProd(cusFav);

      }


    }

    // call the function
    dataOperationInUseEffect().catch(console.error);
  }, [])




  const { nav1, nav2 } = state;

  var settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    fade: true,
    infinite: true,
    dots: false,
  };

  var setting1 = {
    arrows: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          vertical: false,
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <section className="hot-deal b-g-white section-pb-space space-abjust">
      <div className="custom-container">
        <Row className="hot-2">
          <Col lg="12">
            {/* <!--title start--> */}
            <div className="title3 b-g-white text-center">
              <h4>today&#39;s hot deal</h4>
            </div>
            {/* <!--titel end--> */}
          </Col>
          <Col lg="9">
            <div className="slide-1 no-arrow">
              <div>
                <div className="hot-deal-contain deal-abjust">


                  <Row className="row hot-deal-subcontain">
                    <Col lg="4" md="4">
                      <div className="hotdeal-right-slick border-0">
                        <Slider asNavFor={nav1} ref={(slider) => (slider2.current = slider)} {...settings}>
                          {HotProduct &&
                            HotProduct.ProductImagesJson?.map((img, i) => {
                              return (
                                <div key={i}>
                                  <Media src={adminPanelBaseURL + img.AttachmentURL} alt="hot-deal" className="img-fluid  " />
                                </div>
                              );
                            })}
                        </Slider>
                      </div>
                    </Col>
                    <Col lg="6" md="6">

                      {HotProduct != undefined && HotProduct != null ?
                        <div className="hot-deal-center" style={{ display: "block" }}>
                          <div>
                            <div>
                              {/* <h5>{makeProductShortDescription(HotProduct?.ProductName, 33)} </h5> */}

                              <Link to={`/${getLanguageCodeFromSession()}/product-detail/${HotProduct.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(HotProduct.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(HotProduct.ProductName)}`}>
                                <h5 >{makeProductShortDescription(HotProduct.ProductName, 33)}</h5>
                              </Link>

                            </div>
                            <ProductRatingStars Rating={HotProduct?.Rating == undefined || HotProduct?.Rating == null ? 5 : HotProduct?.Rating} />

                            <div>
                              <p>
                                {makeProductShortDescription(HotProduct?.ShortDescription, 208)}
                              </p>
                              <div className="price">
                                <span>
                                  {GetDefaultCurrencySymbol()}{HotProduct?.Price}
                                </span>

                                {HotProduct?.DiscountedPrice != undefined && HotProduct?.DiscountedPrice > 0 ?
                                  <span>
                                    {GetDefaultCurrencySymbol()}{HotProduct?.DiscountedPrice}
                                    {" "}
                                  </span>
                                  :
                                  <>
                                  </>
                                }


                              </div>
                            </div>
                            {
                              HotProduct?.DiscEndDate != null && HotProduct?.DiscEndDate != undefined
                                ?
                                <CountDownComponent endDate={HotProduct?.DiscEndDate} />
                                :
                                <>
                                </>
                            }

                          </div>
                        </div>
                        :
                        <>
                        </>
                      }
                    </Col>
                    <Col md="2">
                      <div className="hotdeal-right-nav">
                        <Slider
                          asNavFor={nav2}
                          ref={(slider) => (slider1.current = slider)}
                          vertical={true}
                          {...setting1}
                          slidesToShow={2}
                          swipeToSlide={true}
                          focusOnSelect={true}
                          verticalSwiping={true}>
                          {HotProduct &&
                            HotProduct.ProductImagesJson?.map((img, i) => {
                              return (
                                <div key={i}>
                                  <Media src={adminPanelBaseURL + img.AttachmentURL} alt="hot-deal" className="img-fluid" />
                                </div>
                              );
                            })}
                        </Slider>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="3">
            <div>
              <div className="media-banner border-0">
                <div className="media-banner-box">
                  <div className="media-heading">
                    <h5>Customer Favorites</h5>
                  </div>
                </div>

                {CustomerFavouritProd && CustomerFavouritProd.map((item, i) => (


                  <div key={i} className="media-banner-box">
                    <div className="media">

                      <div style={{ width: "84px", height: "108px" }}>


                        {(() => {

                          let urlViewDetailImage = `/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`;
                          return (
                            <>
                              <Link to={urlViewDetailImage}>

                                {
                                  item?.ProductImagesJson?.slice(0, 1)?.map((img, imgIdx) =>
                                    <>


                                      <Media src={adminPanelBaseURL + img.AttachmentURL}
                                        className="img-fluid"
                                        alt="banner"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                      />

                                    </>

                                  )
                                }

                              </Link>
                            </>
                          );
                        })()}


                      </div>



                      <div className="media-body">
                        <div className="media-contant">
                          <div>
                            <ProductRatingStars Rating={item.Rating == undefined || item.Rating == null ? 5 : item.Rating} />

                            <p>{makeProductShortDescription(item.ShortDescription, 23)}</p>
                            <h6> {GetDefaultCurrencySymbol()}{item.Price}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default TodayHotDeal;
