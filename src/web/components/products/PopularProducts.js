import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from "reactstrap";
import ProductBox from "./ProductBox";
import Skeleton from "../products/Skeleton/Skeleton";
import Slider from "react-slick";
import Config from "../../../helpers/Config";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import { GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from "../../../helpers/CommonHelper";
import GlobalEnums from "../../../helpers/GlobalEnums";
import rootAction from "../../../stateManagment/actions/rootAction";
import { LOADER_DURATION } from "../../../helpers/Constants";

var settings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
        {
            breakpoint: 1700,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                infinite: true,
            },
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
            },
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
    ],
};

const productCollection = [
    {
        "__typename": "Product",
        "id": 31,
        "title": "pink babysuit",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "kids",
        "brand": "babyhug",
        "category": "kids",
        "price": 75,
        "new": true,
        "sale": true,
        "discount": 40,
        "stock": 15,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "31.1",
                "sku": "sku31",
                "size": "m",
                "color": "pink",
                "image_id": 3111
            },
            {
                "__typename": "VariantType",
                "id": "31.2",
                "sku": "skul31",
                "size": "m",
                "color": "red",
                "image_id": 3112
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 3111,
                "id": "31.1",
                "alt": "pink",
                "src": "kids/product/14.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 3112,
                "id": "31.2",
                "alt": "red",
                "src": "kids/product/15.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 43,
        "title": "shoes 1",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "shoes",
        "brand": "decathlon",
        "category": "shoes",
        "price": 150,
        "new": true,
        "sale": true,
        "discount": 60,
        "stock": 4,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "43.1",
                "sku": "sku43",
                "size": "35",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.2",
                "sku": "skumg43",
                "size": "35",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.3",
                "sku": "skums43",
                "size": "36",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.4",
                "sku": "skusp43",
                "size": "36",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.5",
                "sku": "skusg43",
                "size": "37",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.6",
                "sku": "skusb43",
                "size": "37",
                "color": "black",
                "image_id": 4312
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 4311,
                "id": "43.1",
                "alt": "brown",
                "src": "pro/1.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 4312,
                "id": "43.2",
                "alt": "black",
                "src": "pro/19.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 31,
        "title": "pink babysuit",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "kids",
        "brand": "babyhug",
        "category": "kids",
        "price": 75,
        "new": true,
        "sale": true,
        "discount": 40,
        "stock": 15,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "31.1",
                "sku": "sku31",
                "size": "m",
                "color": "pink",
                "image_id": 3111
            },
            {
                "__typename": "VariantType",
                "id": "31.2",
                "sku": "skul31",
                "size": "m",
                "color": "red",
                "image_id": 3112
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 3111,
                "id": "31.1",
                "alt": "pink",
                "src": "kids/product/14.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 3112,
                "id": "31.2",
                "alt": "red",
                "src": "kids/product/15.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 43,
        "title": "shoes 1",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "shoes",
        "brand": "decathlon",
        "category": "shoes",
        "price": 150,
        "new": true,
        "sale": false,
        "discount": 60,
        "stock": 4,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "43.1",
                "sku": "sku43",
                "size": "35",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.2",
                "sku": "skumg43",
                "size": "35",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.3",
                "sku": "skums43",
                "size": "36",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.4",
                "sku": "skusp43",
                "size": "36",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.5",
                "sku": "skusg43",
                "size": "37",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.6",
                "sku": "skusb43",
                "size": "37",
                "color": "black",
                "image_id": 4312
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 4311,
                "id": "43.1",
                "alt": "brown",
                "src": "pro/1.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 4312,
                "id": "43.2",
                "alt": "black",
                "src": "pro/19.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 31,
        "title": "pink babysuit",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "kids",
        "brand": "babyhug",
        "category": "kids",
        "price": 75,
        "new": true,
        "sale": false,
        "discount": 40,
        "stock": 15,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "31.1",
                "sku": "sku31",
                "size": "m",
                "color": "pink",
                "image_id": 3111
            },
            {
                "__typename": "VariantType",
                "id": "31.2",
                "sku": "skul31",
                "size": "m",
                "color": "red",
                "image_id": 3112
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 3111,
                "id": "31.1",
                "alt": "pink",
                "src": "kids/product/14.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 3112,
                "id": "31.2",
                "alt": "red",
                "src": "kids/product/15.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 43,
        "title": "shoes 1",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "shoes",
        "brand": "decathlon",
        "category": "shoes",
        "price": 150,
        "new": true,
        "sale": false,
        "discount": 60,
        "stock": 4,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "43.1",
                "sku": "sku43",
                "size": "35",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.2",
                "sku": "skumg43",
                "size": "35",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.3",
                "sku": "skums43",
                "size": "36",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.4",
                "sku": "skusp43",
                "size": "36",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.5",
                "sku": "skusg43",
                "size": "37",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.6",
                "sku": "skusb43",
                "size": "37",
                "color": "black",
                "image_id": 4312
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 4311,
                "id": "43.1",
                "alt": "brown",
                "src": "pro/1.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 4312,
                "id": "43.2",
                "alt": "black",
                "src": "pro/19.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 43,
        "title": "shoes 1",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "shoes",
        "brand": "decathlon",
        "category": "shoes",
        "price": 150,
        "new": true,
        "sale": false,
        "discount": 60,
        "stock": 4,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "43.1",
                "sku": "sku43",
                "size": "35",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.2",
                "sku": "skumg43",
                "size": "35",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.3",
                "sku": "skums43",
                "size": "36",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.4",
                "sku": "skusp43",
                "size": "36",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.5",
                "sku": "skusg43",
                "size": "37",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.6",
                "sku": "skusb43",
                "size": "37",
                "color": "black",
                "image_id": 4312
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 4311,
                "id": "43.1",
                "alt": "brown",
                "src": "pro/1.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 4312,
                "id": "43.2",
                "alt": "black",
                "src": "pro/19.jpg"
            }
        ]
    },
    {
        "__typename": "Product",
        "id": 43,
        "title": "shoes 1",
        "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
        "type": "shoes",
        "brand": "decathlon",
        "category": "shoes",
        "price": 150,
        "new": true,
        "sale": true,
        "discount": 60,
        "stock": 4,
        "variants": [
            {
                "__typename": "VariantType",
                "id": "43.1",
                "sku": "sku43",
                "size": "35",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.2",
                "sku": "skumg43",
                "size": "35",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.3",
                "sku": "skums43",
                "size": "36",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.4",
                "sku": "skusp43",
                "size": "36",
                "color": "black",
                "image_id": 4312
            },
            {
                "__typename": "VariantType",
                "id": "43.5",
                "sku": "skusg43",
                "size": "37",
                "color": "brown",
                "image_id": 4311
            },
            {
                "__typename": "VariantType",
                "id": "43.6",
                "sku": "skusb43",
                "size": "37",
                "color": "black",
                "image_id": 4312
            }
        ],
        "images": [
            {
                "__typename": "ImageType",
                "image_id": 4311,
                "id": "43.1",
                "alt": "brown",
                "src": "pro/1.jpg"
            },
            {
                "__typename": "ImageType",
                "image_id": 4312,
                "id": "43.2",
                "alt": "black",
                "src": "pro/19.jpg"
            }
        ]
    }
]


const PopularProducts = ({ hoverEffect }) => {
    const dispatch = useDispatch();
    const [ProductsList, setProductsList] = useState([]);
    const [ProductListMainClass, setProductListMainClass] = useState("col-lg-3 col-sm-6 col-6");
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [PaginationInfo, setPaginationInfo] = useState({
        PageNo: 1,
        PageSize: 20,
        TotalRecords: 0
    });

    useEffect(() => {
        // declare the data fetching function
        const dataOperationInUserEffect = async () => {


            const headers = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    PageNo: PaginationInfo.PageNo,
                    PageSize: PaginationInfo.PageSize,
                    recordValueJson: "[]",
                },
            };

            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_POPULAR_PRODUCTS_LIST'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                await setProductsList(JSON.parse(response.data.data));
                console.log(JSON.parse(response.data.data));
            }


            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["PopularProducts"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        dataOperationInUserEffect().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])



    return (
        <>
            <div className="title1 section-my-space">
                <h4>

                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "Popular Products", "lbl_popprd_title")
                        :
                        "Popular Products"
                    }
                </h4>
            </div>
            <div className="product section-pb-space mb--5">
                <div className="custom-container">
                    <Row>
                        <Col className="pe-0">
                            <div className="product-slide-6 ratio_asos no-arrow">

                                <div>
                                    {!ProductsList || ProductsList.length < 0 ? (
                                        <Skeleton />
                                    ) : (
                                        <Slider {...settings}>
                                            {ProductsList &&
                                                ProductsList.map((itm, i) => (
                                                    <div key={i}>
                                                        <ProductBox
                                                            hoverEffect={hoverEffect}
                                                            item={itm}
                                                            layout=""
                                                            ProductDetailPageForceUpload={false}

                                                        />
                                                    </div>
                                                ))}
                                        </Slider>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default PopularProducts;
