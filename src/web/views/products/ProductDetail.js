import React, { useContext, useEffect, useRef, useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Media, Form, Input, Label } from "reactstrap";
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductService from "../../components/products/ProductService";
import SidePopularProducts from "../../components/products/SidePopularProducts";
import SiteBreadcrumb from "../../components/layout/SiteBreadcrumb";
import { useDispatch } from "react-redux";
import Config from "../../../helpers/Config";
import { showErrorMsg, showInfoMsg, showSuccessMsg, validateAnyFormField } from "../../../helpers/ValidationHelper";
import GlobalEnums from "../../../helpers/GlobalEnums";
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from "../../../helpers/CommonHelper";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import rootAction from "../../../stateManagment/actions/rootAction";
import { LOADER_DURATION } from "../../../helpers/Constants";
import { calculatePriceDiscountPercentage, makePriceRoundToTwoPlaces, makeProductShortDescription, setProductDescriptionImagesUrl } from "../../../helpers/ConversionHelper";
import ProductRatingStars from "../../components/products/ProductRatingStars";
import { AddCustomerWishList, AddProductToCart } from "../../../helpers/CartHelper";
import ProductDetailImages from "../../components/products/ProductDetailImages";
import RelatedProducts from "../../components/products/RelatedProducts";
import ProductVariants from "../../components/products/ProductVariants";
import { Helmet } from 'react-helmet';
import SizeGuide from "../../components/shared/SizeGuide";


const ProductDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [qty, setQuantity] = useState(1);
    const [max, setMax] = useState(1);
    const [min, setMin] = useState(1);
    const [ActiveSize, setActiveSize] = useState(
        {
            SizeID: 0,
            ShortName: ""
        }
    );

    const [ActiveColor, setActiveColor] = useState(
        {
            ColorID: 0,
            ColorName: ""
        }
    );

    const [sizeGuide, setSizeGuide] = useState(false);
    const [productDetail, setProductDetail] = useState({});
    const [productReviews, setProductReviews] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [allProductImages, setAllProductImages] = useState([]);
    const [filterProductImages, setFilterProductImages] = useState([]);
    const [productAllAttributes, setProductAllAttributes] = useState([]);
    const [productSelectedAttributes, setProductSelectedAttributes] = useState([]);
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const [showProductVariantsPopup, setShowProductVariantsPopup] = useState(false);
    const [productActualPrice, setProductActualPrice] = useState(0.00);
    const [productDiscountedPrice, setProductDiscountedPrice] = useState(0.00);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    //--set review variables
    const [ReviewerName, setReviewerName] = useState('');
    const [ReviewerEmail, setReviewerEmail] = useState('');
    const [ReviewTitle, setReviewTitle] = useState('');
    const [ReviewBody, setReviewBody] = useState('');
    const [ReviewRating, setReviewRating] = useState(1);

    //--set product id from url
    const params = useParams();
    const [ProductId, setProductId] = useState(params.product_id ?? 0);

    const DecreaseItem = () => {

        if (qty > 1) {
            setQuantity((qty) - 1);
        }
    }

    const IncrementItem = () => {
        if (productDetail.OrderMaximumQuantity != undefined && productDetail.OrderMaximumQuantity != null && productDetail.OrderMaximumQuantity > 0) {
            if ((qty + 1) > productDetail.OrderMaximumQuantity) {
                showErrorMsg(`Can not add more than ${productDetail.OrderMaximumQuantity} for this product`);
            } else {
                setQuantity((qty) + 1);
            }
        } else {
            if (qty < 10) {
                setQuantity((qty) + 1);
            }
        }

    }




    const [activeTab, setActiveTab] = useState("1");
    const [filterOpen, setFilterOpen] = useState(false);

    const [stock, setStock] = useState("InStock");


    const handleClick = (newRating) => {
        setReviewRating(newRating);
    };

    const openSizeGuide = () => {
        setSizeGuide(true);
    }

    const closeSizeGuide = () => {
        setSizeGuide(false);
    }

    const openProductVariants = () => {
        setShowProductVariantsPopup(true);
    }

    const closeProductVariantPopup = () => {
        setShowProductVariantsPopup(false);
    }

    const setProductVariantsFromPopup = (PrimaryKeyValue, ProductAttributeID) => {

        let tempProdAttr = [];
        tempProdAttr = productSelectedAttributes;

        let isAttributeExists = tempProdAttr?.find(x => x.ProductAttributeID == ProductAttributeID);

        //--If attribute already exists then just update its value
        if (isAttributeExists != null && isAttributeExists != undefined && isAttributeExists.ProductAttributeID > 0) {
            let objIndex = tempProdAttr.findIndex((obj => obj.ProductAttributeID == ProductAttributeID));
            tempProdAttr[objIndex].PrimaryKeyValue = PrimaryKeyValue;

        } else {
            tempProdAttr.push({
                ProductId: ProductId,
                ProductAttributeID: ProductAttributeID,
                PrimaryKeyValue: PrimaryKeyValue,

            });
        }

        //--Set in product selected attributes
        setProductSelectedAttributes(tempProdAttr);




        //--Set any extra price if associated with this attribute
        let additionalPrice = 0;
        for (let index = 0; index < tempProdAttr.length; index++) {
            let priceData = productAllAttributes?.find(x => x.ProductAttributeID == tempProdAttr[index].ProductAttributeID && x.PrimaryKeyValue == tempProdAttr[index].PrimaryKeyValue);
            if (priceData != null && priceData != undefined && priceData.AdditionalPrice != undefined && priceData.AdditionalPrice > 0) {
                additionalPrice = additionalPrice + priceData.AdditionalPrice;
            }

        }


        //--Set product actual price
        setProductActualPrice(makePriceRoundToTwoPlaces(productDetail.Price + additionalPrice));

        //--Set product discounted price
        setProductDiscountedPrice(makePriceRoundToTwoPlaces(productDetail.DiscountedPrice + additionalPrice));

        //--Set Product images according to product color
        if (ProductAttributeID == Config.PRODUCT_ATTRIBUTE_ENUM['Color']) {
            mappedProductImagesWithColor(PrimaryKeyValue);
        }

        console.log(productSelectedAttributes);
    }

    const mappedProductImagesWithColor = (ColorId) => {
        try {
            const filteredItems = allProductImages.filter(({ ColorID }) => ColorID == ColorId);
            if (filteredItems != null && filteredItems != undefined && filteredItems.length > 0) {
                setFilterProductImages(filteredItems);
            }
        } catch (error) {
            console.error(error.message);

            setFilterProductImages(allProductImages);
        }
    }

    const HandleAddToCart = (isBuyNowBtn) => {

        if(productDetail == undefined || productDetail.ProductId == undefined || productDetail.ProductId < 1){
            showErrorMsg("Invalid product!");
            return false;
        }

        if (productDetail?.StockQuantity != null && productDetail?.StockQuantity != undefined
            && productDetail.StockQuantity < 1) {
            showInfoMsg("Product is out of stock. Can't add it in the cart!");
            return false;
        }

        //--check if size selected
        if (productDetail?.ProductSizesJson?.length != undefined && productDetail?.ProductSizesJson?.length > 0) {
            if (ActiveSize.SizeID == undefined || ActiveSize.SizeID < 1) {
                showInfoMsg("Select size of product!");
                return false;
            }
        }

        //--check if color selected
        if (productDetail?.ProductColorsJson?.length != undefined && productDetail?.ProductColorsJson.length > 0) {
            if (ActiveColor.ColorID == undefined || ActiveColor.ColorID < 1) {
                showInfoMsg("Select color of product!");
                return false;
            }
        }

        //--validate all others attributes except color and size because its already validated above
        let localAttributes = productAllAttributes?.filter(x => x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Color'] && x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Size']);
        for (let index = 0; index < localAttributes.length; index++) {
            const elementAttr = localAttributes[index];
            if (elementAttr?.IsRequiredAttribute != undefined && elementAttr?.IsRequiredAttribute == true) {
                if (!productSelectedAttributes.some(x => x.ProductAttributeID === elementAttr.ProductAttributeID)) {
                    showInfoMsg("Please select " + elementAttr.AttributeDisplayName + " variant!");
                    return false;
                }
            }
        }

        //--check if quantity selected
        if (qty == undefined || qty < 1) {
            showInfoMsg("Select quantity!");
            return false;
        }

        let defaultImage = (productDetail?.ProductImagesJson?.length > 0) ? productDetail.ProductImagesJson[0].AttachmentURL : '';
        let cartItems = AddProductToCart(ProductId, qty, productSelectedAttributes, defaultImage);

        // reduxStore.dispatch(rootAction.cartAction.setCustomerCart(cartItems));
        // reduxStore.dispatch(rootAction.cartAction.SetTotalCartItems(JSON.parse(cartItems).length));

        dispatch(rootAction.cartAction.setCustomerCart(cartItems));
        dispatch(rootAction.cartAction.SetTotalCartItems(JSON.parse(cartItems).length));

        if (isBuyNowBtn != undefined && isBuyNowBtn == true) {
            navigate('/' + getLanguageCodeFromSession() + '/cart');
        }
    }


    const SubmitReviewForm = async () => {



        let isValid = false;
        let validationArray = [];

        //--validation for name
        isValid = validateAnyFormField('Name', ReviewerName, 'text', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--validation for email
        isValid = validateAnyFormField('Email', ReviewerEmail, 'email', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--validation for title of review
        isValid = validateAnyFormField('Review Title', ReviewTitle, 'text', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--validation for body of review
        isValid = validateAnyFormField('Review Body', ReviewBody, 'text', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--validation for product id of review
        isValid = validateAnyFormField('Product Id', ProductId, 'number', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--check if any field is not valid
        if (validationArray != null && validationArray.length > 0) {

            isValid = false;
            return false;
        } else {
            isValid = true;
        }


        if (isValid) {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    ProductId: ProductId,
                    ReviewerName: ReviewerName,
                    ReviewerEmail: ReviewerEmail,
                    ReviewTitle: ReviewTitle,
                    ReviewBody: ReviewBody,
                    ReviewRating: ReviewRating,
                },
            };


            //--make api call for saving review data
            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['INSERT_PRODUCT_REVIEW'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                let detail = JSON.parse(response.data.data);
                if (detail[0].ResponseMsg == "Saved Successfully") {
                    showSuccessMsg("Your review submitted successfully!");

                    //--Empty form
                    await setReviewerName("");
                    await setReviewerEmail("");
                    await setReviewTitle("");
                    await setReviewBody("");

                } else {
                    showErrorMsg("An error occured. Please try again later!");
                }
            }
        }


    }

    const HandleCustomerWishList = () => {

        let defaultImageWishList = (productDetail?.ProductImagesJson?.length > 0) ? productDetail.ProductImagesJson[0].AttachmentURL : '';
        let customerWishList = AddCustomerWishList(ProductId, productDetail?.ProductName, productDetail.Price, productDetail.DiscountedPrice, productDetail.DiscountId, productDetail.IsDiscountCalculated, productDetail.CouponCode, ActiveSize.SizeID, ActiveSize.ShortName, 0, '', qty, defaultImageWishList);

        //--store in storage
        localStorage.setItem("customerWishList", customerWishList);
        dispatch(rootAction.cartAction.setCustomerWishList(customerWishList));

    }



    useEffect(() => {
        // declare the data fetching function
        const getProductDetail = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    ProductId: ProductId,
                    recordValueJson: "[]",
                },
            };



            //--Get product detail
            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PRODUCT_DETAIL'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                let detail = JSON.parse(response.data.data);
                console.log("Product detail: ");
                console.log(detail);
                await setProductDetail(detail[0]);


                //--Set product All images
                await setAllProductImages(detail[0]?.ProductImagesJson);

                //--Set product filtered images
                await setFilterProductImages(detail[0]?.ProductImagesJson);

                //--Set product actual price
                await setProductActualPrice(detail[0].Price);

                //--Set product discounted price
                await setProductDiscountedPrice(detail[0].DiscountedPrice);

            }



            //--Get product reviews
            const responseReviews = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PRODUCT_REVIEWS'], null, param, headers, "POST", true);
            if (responseReviews != null && responseReviews.data != null) {
                await setProductReviews(JSON.parse(responseReviews.data.data));

            }

            //--Get payment methods
            const responsePaymentMethods = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PAYMENT_METHODS'], null, param, headers, "POST", true);
            if (responsePaymentMethods != null && responsePaymentMethods.data != null) {
                await setPaymentMethods(JSON.parse(responsePaymentMethods.data.data));

            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getProductDetail().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

        //--scroll page top top becuase the product detail page giving issue
        setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, 500);


    }, [])

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["ProductDetail"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])


    return (
        <>
            <Helmet>
                <title>{siteTitle} Product Detail - {productDetail?.MetaTitle != undefined ? productDetail?.MetaTitle : ""}</title>
                <meta name="description" content={siteTitle + " - " + productDetail?.MetaDescription != undefined ? productDetail?.MetaDescription : "product description"} />
                <meta name="keywords" content={productDetail?.MetaKeywords != undefined ? productDetail?.MetaKeywords : "product description"}></meta>
            </Helmet>

            <SiteBreadcrumb title="Product Detail" parent="Home" />
            <section className="section-big-pt-space bg-light">
                <div className="collection-wrapper">

                    <div className="custom-container">
                        <Row>
                            <Col
                                sm="3"
                                className="collection-filter"
                                style={{
                                    left: filterOpen ? "-15px" : "",
                                }}>

                                <div className="">
                                    <div className="collection-mobile-back">
                                        <span className="filter-back" onClick={() => setFilterOpen(!filterOpen)}>
                                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                                            back
                                        </span>
                                    </div>
                                </div>
                                <ProductService />
                                <SidePopularProducts />
                            </Col>
                            <Col sm="12" lg="9" xs="12">
                                <Row>
                                    <Col xl="12">
                                        <div className="filter-main-btn mb-sm-4">
                                            <span className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
                                                <i className="fa fa-filter" aria-hidden="true"></i> filter
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="5">


                                        {
                                            filterProductImages?.length > 0 ?
                                                <ProductDetailImages
                                                    ProductImages={filterProductImages}
                                                />
                                                :
                                                <>
                                                </>
                                        }

                                    </Col>
                                    <Col lg="7" className="rtl-text">
                                        <div className="product-right">
                                            <h2> {makeProductShortDescription(productDetail?.ProductName, 40)}</h2>
                                            <h4>

                                                {productDiscountedPrice != undefined && productDiscountedPrice > 0 ?
                                                    <>
                                                        <del>
                                                            {GetDefaultCurrencySymbol()}{productDiscountedPrice}
                                                        </del>
                                                        <span>{calculatePriceDiscountPercentage(productActualPrice, productDiscountedPrice)}</span>
                                                    </>
                                                    :
                                                    <>

                                                    </>

                                                }



                                            </h4>
                                            <h3 style={{ marginBottom: '5px' }}>
                                                {GetDefaultCurrencySymbol()}{productActualPrice}
                                            </h3>{" "}

                                            {
                                                productDetail?.Rating != undefined && productDetail.Rating != null ?
                                                    <div className="product-det-rating-sec">
                                                        <ProductRatingStars Rating={productDetail.Rating} />
                                                        <Link to="#" className="rating-count">
                                                            {productDetail.TotalReviews} <span id="lbl_prd_det_reviews">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "reviews", "lbl_prd_det_reviews")
                                                                    :
                                                                    "reviews"
                                                                }

                                                            </span>
                                                        </Link>
                                                    </div>
                                                    :
                                                    <>
                                                    </>
                                            }



                                            {/* {swatch ? <ImageSwatch item={item} changeColorVar={changeColorVar} /> : ""} */}
                                            <div className="product-description border-product">

                                                <div className="product-info-custom">
                                                    <div className="product-info-custom-item">
                                                        <span className="product-info-custom-label">Vendor:</span>
                                                        <span className="product-info-custom-value">{productDetail?.VendorName}</span>
                                                    </div>






                                                    <div className="product-info-custom-item">
                                                        <span className="product-info-custom-label">Availability:</span>

                                                        {(() => {

                                                            if (productDetail?.DisplayStockQuantity != undefined && productDetail.DisplayStockQuantity == true) {

                                                                if (productDetail.StockQuantity != null && productDetail.StockQuantity != undefined && productDetail.StockQuantity > 0) {
                                                                    return (
                                                                        <>

                                                                            <span id="lbl_prd_det_instock" style={{ color: '#4CBB17' }}>
                                                                                {LocalizationLabelsArray.length > 0 ?
                                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "In Stock", "lbl_prd_det_instock")
                                                                                    :
                                                                                    "In Stock"
                                                                                }
                                                                            </span>

                                                                            <span className="product-info-custom-value"> ({productDetail.StockQuantity} items)</span>

                                                                        </>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <>
                                                                            <span className="product-info-custom-value">Out of stock</span>

                                                                        </>
                                                                    );
                                                                }


                                                            }

                                                        })()}


                                                    </div>




                                                    <div className="product-info-custom-item">
                                                        <span className="product-info-custom-label">Brand:</span>
                                                        <span className="product-info-custom-value">{productDetail?.ManufacturerName}</span>
                                                    </div>
                                                </div>




                                                {
                                                    productDetail?.ProductColorsJson != undefined
                                                        && productDetail?.ProductColorsJson != null
                                                        && productDetail?.ProductColorsJson.length > 0
                                                        ?
                                                        <h6 className="product-title">select color</h6>
                                                        :
                                                        <>
                                                        </>
                                                }


                                                <ul class="color-variant">

                                                    {
                                                        productDetail?.ProductColorsJson?.map((item, idx) =>




                                                            <li key={idx} title="color of product"
                                                                className={(ActiveColor.ColorID === item.ColorID) ? "product-color-cell-active" : ""}
                                                                style={{ backgroundColor: `${item.HexCode}` }}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setActiveColor(
                                                                        {
                                                                            ColorID: item.ColorID,
                                                                            ColorName: item.ColorName
                                                                        }
                                                                    );
                                                                    setProductVariantsFromPopup(item.ColorID, Config.PRODUCT_ATTRIBUTE_ENUM['Color']);
                                                                }}
                                                            >

                                                            </li>


                                                        )}



                                                </ul>

                                                {
                                                    productDetail?.ProductSizesJson != undefined
                                                        && productDetail?.ProductSizesJson != null
                                                        && productDetail?.ProductSizesJson.length > 0
                                                        ?
                                                        <h6 className="product-title size-text">
                                                            select size{" "}
                                                            <span>
                                                                <a data-toggle="modal" data-target="#sizemodal" 
                                                                 onClick={(e) => {
                                                                    e.preventDefault();
                                                                    openSizeGuide();
                                                                   
                                                                }}
                                                                
                                                                >
                                                                    size chart
                                                                </a>
                                                            </span>
                                                        </h6>
                                                        :
                                                        <>
                                                        </>
                                                }



                                                <div className="size-box-custom">
                                                    <ul>

                                                        {
                                                            productDetail?.ProductSizesJson?.map((item, idx) =>


                                                                <li key={idx}
                                                                    className={(ActiveSize.SizeID === item.SizeID) ? "active" : null}
                                                                >
                                                                    <Link to="#"

                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setActiveSize(
                                                                                {
                                                                                    SizeID: item.SizeID,
                                                                                    ShortName: item.ShortName
                                                                                }
                                                                            );
                                                                            setProductVariantsFromPopup(item.SizeID, Config.PRODUCT_ATTRIBUTE_ENUM['Size']);
                                                                        }}

                                                                    >
                                                                        {item.ShortName}
                                                                    </Link>
                                                                </li>

                                                            )}


                                                    </ul>
                                                </div>




                                                {
                                                    productAllAttributes != undefined &&
                                                        productAllAttributes?.filter(x => x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Color']
                                                            && x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Size']).length > 0
                                                        ?

                                                        <>



                                                            <div className="size-box-custom mt-4">
                                                                <div class="col-sm-4">
                                                                    <Link to="#"
                                                                        class="btn btn-white btn-outline" style={{ padding: "16px 18px" }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            openProductVariants();
                                                                        }}
                                                                    >
                                                                        {LocalizationLabelsArray != undefined && LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Select Variants", "lbl_prd_det_btn_variant")
                                                                            :
                                                                            "Select Variants"
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </div>

                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }



                                            </div>
                                            <div className="product-description border-product">
                                                {stock !== "InStock" ? <span className="instock-cls">{stock}</span> : ""}
                                                <h6 className="product-title">quantity</h6>
                                                <div className="qty-box">
                                                    <div className="input-group">
                                                        <span className="input-group-prepend">
                                                            <button type="button" className="btn quantity-left-minus" data-type="minus" data-field="" onClick={DecreaseItem}>
                                                                <i className="ti-angle-left"></i>
                                                            </button>
                                                        </span>
                                                        <Input type="text" name="quantity" className="form-control input-number"
                                                            value={qty}
                                                            min={min}
                                                            max={max}
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                        />
                                                        <span className="input-group-prepend">
                                                            <button type="button" className="btn quantity-right-plus" data-type="plus" data-field="" onClick={IncrementItem}>
                                                                <i className="ti-angle-right"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="product-buttons">
                                                <Link
                                                    to="#"
                                                    className="btn btn-normal"
                                                    id="lbl_prd_det_addcart"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        HandleAddToCart(false);
                                                    }}
                                                >
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Add to Cart", "lbl_prd_det_addcart")
                                                        :
                                                        "Add to Cart"
                                                    }
                                                </Link>
                                                <Link to="#" className="btn btn-normal"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        HandleAddToCart(true);
                                                    }}
                                                >
                                                    buy now
                                                </Link>
                                            </div>
                                            <div className="border-product">
                                                <h6 className="product-title">product details</h6>
                                                <p>
                                                    {makeProductShortDescription(productDetail?.ShortDescription, 245)}
                                                </p>
                                            </div>
                                            <div className="border-product">
                                                <div className="product-icon">
                                                    <ul className="product-social">
                                                        <li>

                                                            <Link to="https://www.facebook.com/nashad.mehsud?mibextid=ZbWKwL" target="_blank">
                                                                <i className="fa fa-facebook"></i>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="https://www.linkedin.com/in/noor-uddin-6b1992212/" target="_blank">
                                                                <i className="fa fa-linkedin"></i>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="https://www.youtube.com/channel/UCN8LCF6Mak0Zi0l-WTnxvMg" target="_blank">
                                                                <i className="fa fa-youtube-play"></i>
                                                            </Link>
                                                        </li>

                                                    </ul>
                                                    <div className="d-inline-block">
                                                        <button
                                                            className="wishlist-btn"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                HandleCustomerWishList();
                                                            }}
                                                        >
                                                            <i className="fa fa-heart"></i>
                                                            <span className="title-font">
                                                                {LocalizationLabelsArray.length > 0 ?
                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Add to Wishlist", "lbl_prd_det_addwish")
                                                                    :
                                                                    "Add to Wishlist"
                                                                }
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Col>
                                </Row>
                                <section className="tab-product tab-exes creative-card creative-inner mb-0">
                                    <Row>
                                        <Col sm="12" lg="12">
                                            <Nav tabs className="nav-material" id="top-tab" role="tablist">
                                                <NavItem>
                                                    <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => setActiveTab("1")}>
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Description", "lbl_prd_det_desc")
                                                            :
                                                            "Description:"
                                                        }
                                                        <div className="material-border"></div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => setActiveTab("2")}>
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Additional information", "lbl_prd_det_addinfo")
                                                            :
                                                            "Additional information:"
                                                        }
                                                        <div className="material-border"></div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => setActiveTab("3")}>
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Shipping", "lbl_prd_det_shipinfo")
                                                            :
                                                            "Shipping"
                                                        }
                                                        <div className="material-border"></div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => setActiveTab("4")}>
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Why Buy From Us", "lbl_prd_det_whybuy")
                                                            :
                                                            "Why Buy From Us"
                                                        }
                                                        <div className="material-border"></div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={activeTab === "5" ? "active" : ""} onClick={() => setActiveTab("5")}>
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Reviews", "lbl_prd_det_reviewstab")
                                                            :
                                                            "Reviews"
                                                        }
                                                        <div className="material-border"></div>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent className="nav-material" activeTab={activeTab}>
                                                <TabPane tabId="1">
                                                    <div className="prod-det-desc-box text-center" style={{ marginTop: "20px", marginLeft: "10px", marginBottom: "10px", marginRight: "10px" }}>
                                                        {
                                                            productDetail?.FullDescription != undefined ?
                                                                <div dangerouslySetInnerHTML={{ __html: setProductDescriptionImagesUrl(productDetail.FullDescription) }}>
                                                                </div>
                                                                :
                                                                <>
                                                                </>
                                                        }
                                                    </div>

                                                </TabPane>
                                                <TabPane tabId="2">
                                                    <div className="mt-3 text-center">
                                                        <div className="single-product-tables">

                                                            <div class="product-info-custom">
                                                                <div class="product-info-custom-item">
                                                                    <span class="product-info-custom-label">
                                                                        {LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Tags:", "lbl_prd_det_head_tags")
                                                                            :
                                                                            "Tags:"
                                                                        }
                                                                    </span>
                                                                    <span class="product-info-custom-value">
                                                                        {
                                                                            productDetail?.ProductTagsJson?.map((item, idx) =>
                                                                                <>
                                                                                    {item.TagName}
                                                                                    {idx !== productDetail.ProductTagsJson - 1 && ',  '}
                                                                                </>

                                                                            )}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPane>
                                                <TabPane tabId="3">
                                                    <div className="m-3">
                                                        <div className="single-product-tables">

                                                            <div class="product-info-custom">
                                                                <div class="product-info-custom-item">
                                                                    <span class="product-info-custom-label">
                                                                        {LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Shipping Free: ", "lbl_prd_det_head_shippingfree")
                                                                            :
                                                                            "Shipping Free: "
                                                                        }
                                                                    </span>
                                                                    <span class="product-info-custom-value">
                                                                        {productDetail?.IsShippingFree == true ? "Yes" : "No"}
                                                                    </span>
                                                                </div>
                                                                <div class="product-info-custom-item">
                                                                    <span class="product-info-custom-label">
                                                                        {LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Delivery Methods: ", "lbl_prd_det_head_deliverymethod")
                                                                            :
                                                                            "Delivery Methods: "
                                                                        }
                                                                    </span>
                                                                    <span class="product-info-custom-value">

                                                                        {
                                                                            productDetail?.ProductShipMethodsJson?.map((item, index) =>

                                                                                <>
                                                                                    {item.ShippingMethodName}
                                                                                    {index !== productDetail.ProductShipMethodsJson.length - 1 && ', '}
                                                                                </>

                                                                            )}
                                                                    </span>
                                                                </div>
                                                                <div class="product-info-custom-item">
                                                                    <span class="product-info-custom-label">
                                                                        {LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Estimated Shipping Days: ", "lbl_prd_det_head_est_shippingdays")
                                                                            :
                                                                            "Estimated Shipping Days: "
                                                                        }
                                                                    </span>

                                                                    <span class="product-info-custom-value">
                                                                        {productDetail?.EstimatedShippingDays}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPane>
                                                <TabPane tabId="4">

                                                    <div className="m-3">
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <dl>
                                                                    <dt>Here are 5 more great reasons to buy from us:</dt>

                                                                    <dd style={{ marginTop: "10px" }}>- Secure online transactions</dd>
                                                                    <dd>- Very affordable pricing</dd>
                                                                    <dd>- Fast and reliable shipping</dd>
                                                                    <dd>- Excellent customer service</dd>
                                                                    <dd>- High-quality products</dd>

                                                                </dl>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPane>
                                                <TabPane tabId="5">

                                                    {
                                                        productReviews != null && productReviews != undefined && productReviews.length > 0
                                                            ?
                                                            <Row>
                                                                <Col sm="12" lg="12">
                                                                    <div className="title2 mt-3 " style={{ textAlign: "left" }}><h4 style={{ textTransform: 'none', display: "inline-block" }}>Customer Reviews</h4></div>

                                                                    <div className="mt-3">
                                                                        {
                                                                            productReviews?.map((item, idx) =>
                                                                                <div class="review-item-prod-detail">

                                                                                    <ProductRatingStars Rating={item.Rating == undefined || item.Rating == null ? 5 : item.Rating} />

                                                                                    <h3>{item.Title}</h3>
                                                                                    <span>
                                                                                        <strong>{item.ReviewerName}
                                                                                        </strong> {'on '}
                                                                                        <strong>{item.ReviewDate}</strong>
                                                                                    </span>
                                                                                    <p> {
                                                                                        makeProductShortDescription(item.Body, 500)
                                                                                    }</p>
                                                                                </div>

                                                                            )}



                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                            :
                                                            <>
                                                            </>
                                                    }





                                                    <Form>
                                                        <div className="form-row row">
                                                            <Col md="12" className="mt-4" style={{ borderTop: '1px solid #dddddd' }}>
                                                                <div className="title2 mt-3 " style={{ textAlign: "left" }}>
                                                                    <h4 style={{ textTransform: 'none', display: "inline-block" }}>
                                                                        {LocalizationLabelsArray.length > 0 ?
                                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Write a Review", "lbl_prd_det_writereview")
                                                                            :
                                                                            "Write a Review"
                                                                        }
                                                                    </h4>
                                                                </div>
                                                                <div className="">
                                                                    <Label className="mb-0">Rating</Label>
                                                                    <div className="star-rating-review-form">
                                                                        {[1, 2, 3, 4, 5].map((num) => (
                                                                            <span
                                                                                key={num}
                                                                                className={num == 1 || num <= ReviewRating ? 'star-filled' : 'star-empty'}
                                                                                onClick={() => handleClick(num)}
                                                                            >
                                                                                &#9733;
                                                                            </span>
                                                                        ))}
                                                                    </div>

                                                                </div>
                                                            </Col>
                                                            <Col md="6">
                                                                <Label htmlFor="name" id="lbl_prd_det_name">
                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Name", "lbl_prd_det_name")
                                                                        :
                                                                        "Name"
                                                                    }
                                                                </Label>
                                                                <Input type="text" className="form-control" id="name" name="name" placeholder="Enter Your name" required
                                                                    value={ReviewerName}
                                                                    onChange={(e) => setReviewerName(e.target.value)}
                                                                />



                                                            </Col>
                                                            <Col md="6">
                                                                <Label htmlFor="email" id="lbl_prd_det_email">
                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Email", "lbl_prd_det_email")
                                                                        :
                                                                        "Email"
                                                                    }
                                                                </Label>
                                                                <Input type="text" className="form-control" id="email" name="email" placeholder="Enter your email" required
                                                                    value={ReviewerEmail}
                                                                    onChange={(e) => setReviewerEmail(e.target.value)}
                                                                />


                                                            </Col>
                                                            <Col md="12">
                                                                <Label htmlFor="review-title" id="lbl_prd_det_reviewtitle">
                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Review Title", "lbl_prd_det_reviewtitle")
                                                                        :
                                                                        "Review Title"
                                                                    }
                                                                </Label>
                                                                <Input type="text" className="form-control" id="review-title" name="review-title" placeholder="Enter your Review Subjects" required

                                                                    value={ReviewTitle}
                                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col md="12">
                                                                <Label htmlFor="review-body" id="lbl_prd_det_bodyreview">

                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Body of Review (1000)", "lbl_prd_det_bodyreview")
                                                                        :
                                                                        "Body of Review (1000)"
                                                                    }
                                                                </Label>
                                                                <textarea className="form-control" rows={4} placeholder="Write Your Testimonial Here" name="review-body" id="review-body"
                                                                    required={true}
                                                                    value={ReviewBody}
                                                                    onChange={(e) => setReviewBody(e.target.value)}
                                                                />



                                                            </Col>
                                                            <Col md="12">
                                                                <button className="btn btn-normal" type="button"
                                                                    onClick={() => SubmitReviewForm()}
                                                                >
                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Submit Review", "lbl_prd_det_submitreview")
                                                                        :
                                                                        "Submit Review"
                                                                    }
                                                                </button>
                                                            </Col>
                                                        </div>
                                                    </Form>

                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </section>
                            </Col>
                        </Row>
                    </div>

                </div>
            </section>

            <RelatedProducts ProductId={ProductId} />

            <ProductVariants
                ProductId={ProductId}
                showProductVariantsPopup={showProductVariantsPopup}
                closeProductVariantPopup={closeProductVariantPopup}
                setProductVariantsFromPopup={setProductVariantsFromPopup}
                productAllAttributes={productAllAttributes}
                setProductAllAttributes={setProductAllAttributes}
            />


            {sizeGuide ? <SizeGuide
                closeSizeGuide={closeSizeGuide}
                openSizeGuide={openSizeGuide}
                SizeGuide={SizeGuide}
            /> : ''}
        </>
    );
};

export default ProductDetail;
