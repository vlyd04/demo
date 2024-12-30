import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Config from '../../../../helpers/Config';
import { makeProductShortDescription } from '../../../../helpers/ConversionHelper';
import rootAction from '../../../../stateManagment/actions/rootAction';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../../helpers/CommonHelper';
import GlobalEnums from '../../../../helpers/GlobalEnums';
import { Media } from "reactstrap";


const Wishlist = (props) => {
    const dispatch = useDispatch();
    const [adminPanelBaseURL, setadminPanelBaseURL] = useState(Config['ADMIN_BASE_URL']);
    const navigate = useNavigate();
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [openWishlist, setOpenWishlist] = useState(false);
    
    const jsoncustomerWishList = useSelector(state => state.cartReducer.customerWishList);
    const wishListData = JSON.parse(jsoncustomerWishList ?? "[]");
    const wishListCount = wishListData != undefined && wishListData != null ? wishListData.length : 0;


    const handleContinueShopping = () => {
        setOpenWishlist(false);
        setTimeout(() => {
            navigate('/' + getLanguageCodeFromSession() + '/');
        }, 500);
    }

    const makeEmptyFromWishList = () => {


        localStorage.setItem("customerWishList", '[]');
        dispatch(rootAction.cartAction.setCustomerWishList('[]'));

       

    }


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Wishlist"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])


    return (
        <>

            <li className="mobile-wishlist" onClick={() => setOpenWishlist(!openWishlist)}>
                <Link style={{ cursor: "pointer" }}>
                    <i className="icon-heart"></i>
                    <div className="cart-item">
                        <div style={{ cursor: "pointer" }}>
                            {wishListCount != undefined ? wishListCount : 0} {"item"} <span>{"wishlist"}</span>
                        </div>
                    </div>
                </Link>
            </li>

            <div id="wishlist_side" className={`add_to_cart right ${openWishlist ? "open-side" : ""}`}>
                <a href="#" className="overlay" onClick={() => setOpenWishlist(!openWishlist)}></a>
                <div className="cart-inner">
                    <div className="cart_top">
                        <h3>my wishlist</h3>
                        <div className="close-cart" onClick={() => setOpenWishlist(!openWishlist)}>
                            <a href="#">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    {wishListData && wishListData.length > 0 ? (
                        <>
                            <div className="cart_media">
                                <ul className="cart_product">
                                    {wishListData &&
                                        wishListData.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <div className="media">
                                                        <a href="#">
                                                            <Media alt="" className="me-3" src={item.DefaultImage != undefined ? (adminPanelBaseURL + item.DefaultImage) : ""} />
                                                        </a>
                                                        <div className="media-body">
                                                            <a href="#">
                                                                <h4>{makeProductShortDescription(item.ProductName, 30)}</h4>
                                                            </a>
                                                            <h4 className="theme-color">
                                                                <span>{item.Quantity}</span>
                                                                <span>x</span>
                                                            </h4>
                                                            <h5>
                                                                <span> {GetDefaultCurrencySymbol()}{item.Price}</span>
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    {/* <div className="close-circle">
                                                        <a href="#" onClick={() => removeFromWish(item)}>
                                                            <i className="ti-trash" aria-hidden="true"></i>
                                                        </a>
                                                    </div> */}
                                                </li>
                                            );
                                        })}
                                </ul>
                                <ul className="cart_total">
                                    <li>
                                        <div className="buttons">

                                            <Link to="#" className="btn btn-normal btn-block  view-cart"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleContinueShopping();
                                                }}
                                            >
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Continue Shopping", "lbl_wishlist_contshop")
                                                    :
                                                    "Continue Shopping"
                                                }
                                            </Link>

                                        </div>
                                    </li>
                                    <li>
                                        <div className="buttons">

                                            <Link to="#" className="btn btn-normal btn-outline btn-block view-cart"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    makeEmptyFromWishList();
                                                }}
                                            >
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Clear Wishlist", "lbl_wishlist_contshop")
                                                    :
                                                    "Clear Wishlist"
                                                }
                                            </Link>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="empty-cart-cls text-center">
                            <img src="/images/empty-wishlist.png" className="img-fluid mb-4" alt="" />
                            <h3>
                                <strong>Your wishlist is Empty</strong>
                            </h3>
                            <h4>Explore more shortlist some items.</h4>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
}

export default Wishlist












