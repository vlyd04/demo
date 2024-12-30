import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { AddCustomerWishList, AddProductToCart } from '../../../helpers/CartHelper';
import Img from "../../../helpers/utils/BgImgRatio";
import myImage from '../../../resources/custom/images/product_main_2.jpg';
import { makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from "../../../helpers/ConversionHelper";
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from "../../../helpers/CommonHelper";
import Config from "../../../helpers/Config";
import ProductRatingStars from "./ProductRatingStars";
import rootAction from "../../../stateManagment/actions/rootAction";
import { debounce } from "lodash";
import { showErrorMsg } from "../../../helpers/ValidationHelper";
import { LOADER_DURATION } from "../../../helpers/Constants";
import GlobalEnums from "../../../helpers/GlobalEnums";


const ProductBox = ({ item, hoverEffect, layout, ProductDetailPageForceUpload }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);
    const [imgsrc, setImgsrc] = useState("");

    const [compare, addCompare] = useState("");
    const [wishList, addWish] = useState("");
    const [onSale, setOnSale] = useState(item.DiscountedPrice != undefined && item.DiscountedPrice != null && item.DiscountedPrice > 0);
    const customerCompareList = useSelector(state => state.cartReducer.customerCompareList);
    const [langCode, setLangCode] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);


    const imgChange = (src) => {
        setImgsrc(src);
    };


    const reloadProductDetail = (_productId, _categoryName, _productName) => {

        let productDetailUrlFromForceReload = `/${getLanguageCodeFromSession()}/product-detail/${_productId}/${replaceWhiteSpacesWithDashSymbolInUrl(_categoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(_productName)}`

        if (ProductDetailPageForceUpload != undefined && ProductDetailPageForceUpload != null && ProductDetailPageForceUpload == true && _productId != undefined) {
            navigate(productDetailUrlFromForceReload, { replace: true });
            window.location.reload();
        }
    }

    const HandleCustomerWishList = (ProductID, ProductName, Price, DiscountedPrice, DiscountId, IsDiscountCalculated, CouponCode, defaultImage) => {


        let customerWishList = AddCustomerWishList(ProductID, ProductName, Price, DiscountedPrice, DiscountId, IsDiscountCalculated, CouponCode, 0, '', 0, '', 1, defaultImage);

        //--store in storage
        localStorage.setItem("customerWishList", customerWishList);
        dispatch(rootAction.cartAction.setCustomerWishList(customerWishList));

    }

    const handleCompareList = (ProductId) => {



        try {



            //--check if product already exists
            if (customerCompareList == undefined || customerCompareList?.filter(obj => obj.ProductId == ProductId).length == 0) {
                let customerCompareLocal = [];
                customerCompareLocal = customerCompareList == undefined ? [] : customerCompareList;
                customerCompareLocal.push({
                    ProductId: ProductId

                });

                console.log(customerCompareLocal);
                dispatch(rootAction.cartAction.setCustomerCompareList(customerCompareLocal));
            }

            navigate('/' + getLanguageCodeFromSession() + '/compare');
        }
        catch (err) {
            console.log(err);
            showErrorMsg("An error occured. Please try again!");

        }


    }

    useEffect(() => {
        // declare the data fetching function
        const dataOperationInUseEffect = async () => {

            //--Get language code
            let lnCode = getLanguageCodeFromSession();
            await setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["ProductBox_1"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }



        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        dataOperationInUseEffect().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])

    return (
        <Fragment>
            <div className="product-box">
                <div className="product-imgbox">
                    <div className="product-front">
                        {/* <Img src={myImage} className="img-fluid" alt="product" /> */}

                        {(() => {

                            let urlViewDetailImage = `/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`;
                            return (
                                <>
                                    <Link to={urlViewDetailImage} onClick={() => reloadProductDetail(item.ProductId, item.CategoryName, item.ProductName)}>

                                        {
                                            item?.ProductImagesJson?.slice(0, 1)?.map((img, imgIdx) =>
                                                <>

                                                    <Img src={adminPanelBaseURL + img.AttachmentURL} className="img-fluid" alt="product" />
                                                </>

                                            )
                                        }

                                    </Link>
                                </>
                            );
                        })()}



                    </div>
                    <ul className="product-thumb-list">
                        {/* {images.map((pic, i) => (
                            <li className={`grid_thumb_img ${pic.src === imgsrc ? "active" : ""}`} key={i}>
                                <a>
                                    <Img
                                        src={`/images/${pic.src}`}
                                        className="img-fluid"
                                        onMouseEnter={() => imgChange(pic.src)}
                                        alt={pic.src}
                                        onClick={() => {
                                            imgChange(pic.src);
                                        }}
                                    />
                                </a>
                            </li>
                        ))} */}
                    </ul>
                    <div className={`product-icon ${hoverEffect}`}>

                        <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}>
                            <i className="ti-bag"></i>
                        </Link>
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                HandleCustomerWishList(item.ProductId, item.ProductName, item.Price, item.DiscountedPrice, item.DiscountId, item.IsDiscountCalculated, item.CouponCode, (item?.ProductImagesJson[0]?.AttachmentURL != undefined ? item?.ProductImagesJson[0]?.AttachmentURL : ""))
                            }}
                        >
                            <i className="ti-heart" aria-hidden="true"></i>
                        </a>
                        <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`} title="Quick View" >
                            <i className="ti-search" aria-hidden="true"></i>
                        </Link>
                        <a href="#" title="Compare"
                            onClick={(e) => {
                                e.preventDefault();
                                handleCompareList(item.ProductId)
                            }}
                        >
                            <i className="ti-reload" aria-hidden="true"></i>
                        </a>
                    </div>
                    {item?.MarkAsNew && (
                        <div className="new-label1">
                            <div>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "new", "lbl_productbox_1_new")
                                    :
                                    "new"
                                }
                            </div>
                        </div>
                    )}
                    {onSale && <div className="on-sale1">

                        {LocalizationLabelsArray.length > 0 ?
                            replaceLoclizationLabel(LocalizationLabelsArray, "on sale", "lbl_productbox_1_onsale")
                            :
                            "on sale"
                        }
                    </div>}
                </div>
                <div className="product-detail detail-inline ">
                    <div className="detail-title">
                        <div className="detail-left">

                            <ProductRatingStars Rating={item.Rating == undefined || item.Rating == null ? 5 : item.Rating} />

                            {layout === "list-view" ? (
                                <p>
                                    {makeProductShortDescription(item.ShortDescription, 45)}
                                </p>
                            ) : (
                                ""
                            )}
                            <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}>
                                <h6 className="price-title">{makeProductShortDescription(item.ProductName, 50)}</h6>
                            </Link>

                        </div>
                        <div className="detail-right">

                            {item.DiscountedPrice != undefined && item.DiscountedPrice > 0 ?
                                <div className="check-price">
                                    {GetDefaultCurrencySymbol()}{item.DiscountedPrice}
                                    {" "}
                                </div>
                                :
                                <span className="dis-empty-value">
                                    {'\u00A0'}{'\u00A0'}
                                </span>
                            }

                            <div className="price">
                                <div className="price">

                                    {GetDefaultCurrencySymbol()}{item.Price}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};
export default ProductBox;
