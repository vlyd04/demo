import React, { useEffect, useState } from 'react';
import { MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import ProductBox from "./ProductBox";
import Skeleton from "../products/Skeleton/Skeleton";
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { Link } from 'react-router-dom';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import Slider from "react-slick";
import { Row, Col } from "reactstrap";



var settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
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

const RelatedProducts = (props) => {

    const dispatch = useDispatch();
    const [ProductId, setProductId] = useState(props.ProductId);
    const [ProductsList, setProductsList] = useState([]);
    const [ProductListMainClass, setProductListMainClass] = useState("col-lg-3 col-sm-6 col-6");
    const [PaginationInfo, setPaginationInfo] = useState({
        PageNo: 1,
        PageSize: 20,
        TotalRecords: 0
    });
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);



    useEffect(() => {
        // declare the data fetching function
        const getRelatedProductsList = async () => {


            const headers = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    ProductId: ProductId,
                    PageNo: PaginationInfo.PageNo,
                    PageSize: PaginationInfo.PageSize,
                    recordValueJson: "[]",
                },
            };

            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_RELATED_PRODUCTS_LIST'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {

                let ProductData = JSON.parse(response.data.data);

                if (ProductData != undefined && ProductData.length > 0) {

                    let slidesToShow = 6;
                    for (let i = 0; i < slidesToShow; i++) {
                        //--just concating productData with existing data if size is less slidesToShow 
                        //--so that items are complete for slide show other wise it will create issue in display
                        ProductData = ProductData.concat(ProductData);
                        if (ProductData.length > slidesToShow) {
                            break;
                        }
                    }
                    await setProductsList(ProductData);
                }

            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["RelatedProducts"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getRelatedProductsList().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])

    return (
        <>

            {ProductsList != null && ProductsList != undefined && ProductsList.length > 0 ?
                <section className="section-big-py-space  ratio_asos bg-light">
                    <div className="custom-container">
                        <Row>
                            <Col className="product-related">
                                <h2>
                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Related Products", "lbl_related_rltproduct")
                                        :
                                        "Related Products"
                                    }
                                </h2>
                            </Col>
                        </Row>

                        {!ProductsList || ProductsList.length === 0 ? (
                            <Skeleton />
                        ) : (
                            <Row>
                                <Col className="product">
                                    <Slider {...settings}>
                                        {ProductsList &&
                                            ProductsList.map((itm, i) => (
                                                <div key={i}>


                                                    <ProductBox

                                                        item={itm}
                                                        layout=""
                                                        ProductDetailPageForceUpload={true}

                                                    />

                                                </div>
                                            ))}
                                    </Slider>
                                </Col>
                            </Row>
                        )}
                    </div>
                </section>

                :
                <>
                </>
            }
        </>
    );

}


export default RelatedProducts;
