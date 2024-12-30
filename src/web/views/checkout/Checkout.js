import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import BestFacilities from '../../components/shared/BestFacilities';
import { useSelector, useDispatch } from 'react-redux';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { showErrorMsg, showInfoMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { MakeApiCallSynchronous, MakeApiCallAsync, GetLoadSTRPPublishable } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import rootAction from '../../../stateManagment/actions/rootAction';
import OrderSummary from '../../components/cart/OrderSummary';
import { makePriceRoundToTwoPlaces, makeProductShortDescription } from '../../../helpers/ConversionHelper';
import { Helmet } from 'react-helmet';
import { Input, Label, Form, Row, Col, FormGroup, Modal, ModalBody, Button } from "reactstrap";


//--strip
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutStripForm from '../../components/cart/CheckoutStripForm';
import { GetDefaultCurrencyCode, GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';

//--Paypal
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import GlobalEnums from '../../../helpers/GlobalEnums';


// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRP_PUBLISHABLE_KEY);



const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const [showCardSectionStripe, setshowCardSectionStripe] = useState(false);
    const [showCardSectionPaypal, setshowCardSectionPaypal] = useState(false);
    const [PaymentMethod, setPaymentMethod] = useState(process.env.REACT_APP_STRIPE_PAYMENT_METHOD ?? 5);
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [OrderNote, setOrderNote] = useState('');
    const [CartSubTotal, setCartSubTotal] = useState(0);
    const [ShippingSubTotal, setShippingSubTotal] = useState(0);
    const [OrderTotal, setOrderTotal] = useState(0);
    const [OrderTotalAfterDiscount, setOrderTotalAfterDiscount] = useState(0);
    const [cartProductsData, setCartProductsData] = useState(0);
    const [CouponCode, setCouponCode] = useState('');
    const [IsCouponCodeApplied, setIsCouponCodeApplied] = useState(false);
    const [IsAlreadyDiscountApplied, setIsAlreadyDiscountApplied] = useState(false);
    const [CouponCodeCssClass, setCouponCodeCssClass] = useState('cart-coupon-code');
    const [paypalOrderID, setPaypalOrderID] = useState(false);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);



    const loginUserDataJson = useSelector(state => state.userReducer.user);
    const loginUser = JSON.parse(loginUserDataJson ?? "{}");

    const cartJsonDataSession = useSelector(state => state.cartReducer.cartItems);
    const cartItemsSession = JSON.parse(cartJsonDataSession ?? "[]");


    if (loginUser == undefined || loginUser.UserID == undefined || loginUser.UserID < 1) {
        navigate('/' + getLanguageCodeFromSession() + '/login');
    }

    if (cartItemsSession == undefined || cartItemsSession == null || cartItemsSession.length < 1) {
        showInfoMsg('Your cart is empty');
        navigate('/' + getLanguageCodeFromSession() + '/');
    }

    const GetCouponCodeInfo = async () => {

        if (IsCouponCodeApplied) {
            showInfoMsg('Coupon code is already applied!');
            return false;
        }


        let isValid = validateAnyFormField('Coupon Code', CouponCode, 'text', null, 30, true);
        if (isValid == false) {
            return false;
        }



        const headersCoupon = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }

        const paramCoupon = {
            requestParameters: {
                CouponCode: CouponCode,
                cartJsonData: JSON.stringify(cartItemsSession),
            },
        };


        const couponResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_COUPON_CODE_DISCOUNT'], Config['COMMON_CONTROLLER_SUB_URL'], paramCoupon, headersCoupon, "POST", true);


        if (couponResponse != null && couponResponse.data != null) {

            let copounData = JSON.parse(couponResponse.data.data);
            console.log(copounData);
            if (copounData != undefined && copounData.DiscountValueAfterCouponAppliedWithQuantity != undefined && copounData.DiscountValueAfterCouponAppliedWithQuantity > 0) {
                setOrderTotalAfterDiscount((OrderTotal - copounData.DiscountValueAfterCouponAppliedWithQuantity ?? 0));
                setIsCouponCodeApplied(true);
            } else {
                showErrorMsg('Invalid coupon code!');
            }

        }



    }

    const handleCheckoutOnSubmit = async (e) => {
        

        try {
            e.preventDefault();

            //-- First Disable all forms
            setshowCardSectionStripe(false);
            setshowCardSectionPaypal(false);

            if (PaymentMethod === process.env.REACT_APP_STRIPE_PAYMENT_METHOD) {
                setshowCardSectionStripe(true);
            } else if (PaymentMethod === process.env.REACT_APP_PAYPAL_PAYMENT_METHOD) {
                setshowCardSectionPaypal(true);
            }
            else if (PaymentMethod === process.env.REACT_APP_CASH_ON_DELIVERY_PAYMENT_METHOD) {
                let isYes = window.confirm("Do you really want place order?");
                if (isYes) {

                    //--start loader
                    dispatch(rootAction.commonAction.setLoading(true));


                    PlaceAndConfirmCustomerOrder(null);

                    //--stop loader
                    setTimeout(() => {
                        dispatch(rootAction.commonAction.setLoading(false));
                    }, LOADER_DURATION);

                }
            }
        } catch (err) {
            showErrorMsg("An error occured. Please try again!");
            console.log(err.message);
            if (PaymentMethod === process.env.REACT_APP_STRIPE_PAYMENT_METHOD) {
                HandleStripCardModal();
                HandlePaypalCardModal();
            }

            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);
        }



    }


    const PlaceAndConfirmCustomerOrder = async (StripPaymentToken, payPalOrderConfirmJson = "{}") => {

        try {

            const headersStrip = {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const paramSrip = {
                requestParameters: {
                    UserID: loginUser.UserID,
                    OrderNote: OrderNote,
                    cartJsonData: JSON.stringify(cartItemsSession),
                    CouponCode: IsCouponCodeApplied == true ? CouponCode : "",
                    PaymentMethod: PaymentMethod,
                    paymentToken: StripPaymentToken ?? "",
                    payPalOrderConfirmJson: payPalOrderConfirmJson ?? "",
                    recordValueJson: "[]",
                },
            };



            const stripServerResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['POST_CUSTOMER_ORDER'], Config['COMMON_CONTROLLER_SUB_URL'], paramSrip, headersStrip, "POST", true);
            if (stripServerResponse != null && stripServerResponse.data != null && stripServerResponse.status == 200) {
                let stripServerResponseDetail = JSON.parse(stripServerResponse.data.data != undefined && stripServerResponse.data.data != "" ? stripServerResponse.data.data : "[]");

                if (stripServerResponseDetail.length > 0 && stripServerResponseDetail[0].ResponseMsg != undefined && stripServerResponseDetail[0].ResponseMsg == "Order Placed Successfully") {
                    showSuccessMsg("Order Placed Successfully!");




                    setTimeout(function () {
                        navigate('/' + getLanguageCodeFromSession() + '/');

                        //--clear customer cart
                        dispatch(rootAction.cartAction.setCustomerCart('[]'));
                        dispatch(rootAction.cartAction.SetTotalCartItems(0));
                        localStorage.setItem("cartItems", "[]");

                    }, 1000);


                } else {
                    showErrorMsg("An error occured. Please try again!");

                }

            } else {
                showErrorMsg("An error occured. Please try again!");

            }


            if (PaymentMethod === process.env.REACT_APP_STRIPE_PAYMENT_METHOD) {
                HandleStripCardModal();
            } else if (PaymentMethod === process.env.REACT_APP_PAYPAL_PAYMENT_METHOD) {
                HandlePaypalCardModal();
            }





        } catch (err) {
            showErrorMsg("An error occured. Please try again!");
            console.log(err.message);
            if (PaymentMethod === process.env.REACT_APP_STRIPE_PAYMENT_METHOD) {
                HandleStripCardModal();
            }

            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

        }


    }


    const HandleStripCardModal = () => {
        setshowCardSectionStripe(!showCardSectionStripe);
    }

    const HandlePaypalCardModal = () => {
        setshowCardSectionPaypal(!showCardSectionPaypal);
    }

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        description: "Sunflower",
                        amount: {
                            //currency_code: "USD",
                            currency_code: GetDefaultCurrencyCode(),
                            value: OrderTotalAfterDiscount != undefined && OrderTotalAfterDiscount > 0 ? OrderTotalAfterDiscount : OrderTotal,
                        },
                    },
                ],
                // not needed if a shipping address is actually needed
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                },
            })
            .then((paypalOrderID) => {
                setPaypalOrderID(paypalOrderID);
                return paypalOrderID;
            });
    };

    // check paypal Approval
    const onApprove = (data, actions) => {

        return actions.order.capture().then(function (details) {
            const { payer } = details;
            //setSuccess(true); replace with your own

            //-- Set paypal json response if approve
            let JsonDetail = JSON.stringify(details);

            //--start loader
            dispatch(rootAction.commonAction.setLoading(true));

            setTimeout(() => {
                PlaceAndConfirmCustomerOrder(null, JsonDetail);
            }, 500);

            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);


            HandlePaypalCardModal();
        });
    };

    //capture likely error for paypal
    const onError = (data, actions) => {
        HandlePaypalCardModal();
        showErrorMsg("An error occured. Please try again!");
    };


    useEffect(() => {
        // declare the data fetching function
        const dataOperationInUseEffect = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }

            //--Get cart data
            const paramCart = {
                requestParameters: {
                    cartJsonData: JSON.stringify(cartItemsSession),
                    recordValueJson: "[]",
                },
            };


            const customerCartResponse = await MakeApiCallAsync(Config.END_POINT_NAMES["GET_CUSTOMER_CART_ITEMS"], Config['COMMON_CONTROLLER_SUB_URL'], paramCart, headers, "POST", true);
            if (customerCartResponse != null && customerCartResponse.data != null) {

                let finalData = JSON.parse(customerCartResponse.data.data);
                console.log(finalData);

                if (finalData != null) {
                    setTimeout(() => {

                        setCartProductsData(finalData.productsData);
                        setCartSubTotal(finalData.cartSubTotal);
                        setShippingSubTotal(finalData.shippingSubTotal);
                        setOrderTotal(finalData.orderTotal);

                        if (finalData.productsData.length > 0 && finalData.productsData.some(el => el.DiscountedPrice > 0)) {
                            setIsAlreadyDiscountApplied(true);
                        }

                    }, 500);
                }




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


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["Checkout"], null);
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
                <title>{siteTitle} - Checkout</title>
                <meta name="description" content={siteTitle + " - Checkout"} />
                <meta name="keywords" content="Checkout"></meta>
            </Helmet>
            <SiteBreadcrumb title="Checkout" parent="Home" />


            <section className="section-big-py-space bg-light">
                <div className="custom-container">
                    <div className="checkout-page contact-page">
                        <div className="checkout-form">
                            <Form onSubmit={handleCheckoutOnSubmit}>
                                <Row>
                                    <Col lg="6" sm="12" xs="12">
                                        <div className="checkout-title">
                                            <h3>
                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Billing Details", "lbl_check_billdetail")
                                                    :
                                                    "Billing Details"
                                                }
                                            </h3>
                                        </div>
                                        <div className="theme-form">
                                            <Row className="check-out ">
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Country", "lbl_check_country")
                                                            :
                                                            "Country"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="CountryName"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.CountryName}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "First Name", "lbl_check_fname")
                                                            :
                                                            "First Name"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="FirstName"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.FirstName}
                                                    />

                                                </FormGroup>

                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Last Name", "lbl_check_lname")
                                                            :
                                                            "Last Name"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="LastName"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.LastName}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Shipping Address", "lbl_check_shipadrs")
                                                            :
                                                            "Shipping Address"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.AddressLineOne}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "City", "lbl_check_city")
                                                            :
                                                            "City"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.CityName}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "State / Province", "lbl_check_province")
                                                            :
                                                            "State / Province"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.StateName}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Postcode / Zip", "lbl_check_postcode")
                                                            :
                                                            "Postcode / Zip"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="zip"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.PostalCode}
                                                    />

                                                </FormGroup>

                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Email Address", "lbl_check_email")
                                                            :
                                                            "Email Address"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.EmailAddress}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-6 col-sm-6 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Phone", "lbl_check_phone")
                                                            :
                                                            "Phone"
                                                        }
                                                    </Label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                        readOnly
                                                        value={loginUser.MobileNo}
                                                    />

                                                </FormGroup>
                                                <FormGroup className="col-md-12 col-sm-12 col-xs-12">
                                                    <Label className="field-label">
                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "Order Note", "lbl_check_phone")
                                                            :
                                                            "Order Note"
                                                        }
                                                    </Label>


                                                    <textarea name="OrderNote" id="OrderNote" cols="30" rows="6" placeholder="Order Notes" className="form-control"
                                                        value={OrderNote}
                                                        onChange={(e) => setOrderNote(e.target.value)}
                                                    />

                                                </FormGroup>








                                            </Row>
                                        </div>
                                    </Col>
                                    <Col lg="6" sm="12" xs="12">
                                        <div className="checkout-details theme-form  section-big-mt-space">

                                            {
                                                cartProductsData != undefined && cartProductsData != null && cartProductsData.length > 0
                                                    ?
                                                    <>
                                                        <div className="order-table table-responsive">
                                                            <table className="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col" id="lbl_hdr_check_prdname">
                                                                            {LocalizationLabelsArray.length > 0 ?
                                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Product Name", "lbl_hdr_check_prdname")
                                                                                :
                                                                                "Product Name"
                                                                            }
                                                                        </th>
                                                                        <th scope="col" id="lbl_hdr_check_price">
                                                                            {LocalizationLabelsArray.length > 0 ?
                                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Price", "lbl_hdr_check_price")
                                                                                :
                                                                                "Price"
                                                                            }
                                                                        </th>
                                                                        <th scope="col" id="lbl_hdr_check_qty">
                                                                            {LocalizationLabelsArray.length > 0 ?
                                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Quantity", "lbl_hdr_check_qty")
                                                                                :
                                                                                "Quantity"
                                                                            }
                                                                        </th>
                                                                        <th scope="col" id="lbl_hdr_check_total">
                                                                            {LocalizationLabelsArray.length > 0 ?
                                                                                replaceLoclizationLabel(LocalizationLabelsArray, "Total", "lbl_hdr_check_total")
                                                                                :
                                                                                "Total"
                                                                            }
                                                                        </th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {cartProductsData?.map((data, idx) => (

                                                                        <tr key={idx}>
                                                                            <td className="product-name">
                                                                            {
                                                                                        makeProductShortDescription(data.ProductName, 50)
                                                                                    }
                                                                            </td>

                                                                            <td className="product-name">
                                                                                <span className="unit-amount">
                                                                                    {data.DiscountedPrice != undefined && data.DiscountedPrice > 0 ?
                                                                                        <>
                                                                                            <del style={{ color: "#9494b9" }}>{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(data.Price)}</del> &nbsp; {GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(data.DiscountedPrice)}
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            {GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(data.Price)}
                                                                                        </>
                                                                                    }
                                                                                </span>
                                                                            </td>

                                                                            <td className="product-name">
                                                                                {data.Quantity}
                                                                            </td>

                                                                            {(() => {

                                                                                let itemSubTotal = (data.DiscountedPrice != undefined && data.DiscountedPrice > 0 ? data.DiscountedPrice : data.Price) * (data.Quantity ?? 1);

                                                                                return (

                                                                                    <td className="product-total">
                                                                                        <span className="subtotal-amount">{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(itemSubTotal)}</span>
                                                                                    </td>
                                                                                );

                                                                            })()}


                                                                        </tr>
                                                                    ))}

                                                                    <tr>
                                                                        <td className="order-subtotal" colSpan={3}>
                                                                            <span id="lbl_check_cartsubtotal" className="count">
                                                                                {LocalizationLabelsArray.length > 0 ?
                                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Cart Subtotal", "lbl_check_cartsubtotal")
                                                                                    :
                                                                                    "Cart Subtotal"
                                                                                }
                                                                            </span>
                                                                        </td>


                                                                        <td className="order-subtotal-price">
                                                                            <span className="order-subtotal-amount">{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(CartSubTotal)}</span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="order-shipping" colSpan={3}>
                                                                            <span id="lbl_check_shipping">
                                                                                {LocalizationLabelsArray.length > 0 ?
                                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Shipping", "lbl_check_shipping")
                                                                                    :
                                                                                    "Shipping"
                                                                                }
                                                                            </span>
                                                                        </td>


                                                                        <td className="shipping-price">
                                                                            <span>{GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(ShippingSubTotal)}</span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="total-price" colSpan={3}>
                                                                            <span id="lbl_check_ordtotal" className='order-total-check-lbl'>
                                                                                {LocalizationLabelsArray.length > 0 ?
                                                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Order Total", "lbl_check_ordtotal")
                                                                                    :
                                                                                    "Order Total"
                                                                                }
                                                                            </span>
                                                                        </td>



                                                                        <td className="product-subtotal">
                                                                            <span className="order-total-check-val">
                                                                                {OrderTotalAfterDiscount != undefined && OrderTotalAfterDiscount > 0
                                                                                    ?
                                                                                    <>
                                                                                        <del>{GetDefaultCurrencySymbol()} {makePriceRoundToTwoPlaces(OrderTotal)}</del>&nbsp; &nbsp; {GetDefaultCurrencySymbol()}{makePriceRoundToTwoPlaces(OrderTotalAfterDiscount)}
                                                                                    </>



                                                                                    :
                                                                                    `${GetDefaultCurrencySymbol()} ${makePriceRoundToTwoPlaces(OrderTotal)}`
                                                                                }

                                                                            </span>
                                                                        </td>
                                                                    </tr>


                                                                    <tr style={{ display: IsAlreadyDiscountApplied ? "none" : '' }}>
                                                                        <td className="total-price" colSpan={3}>
                                                                            <div className='login-form'>
                                                                                <div className='form-group' style={{ marginBottom: '0' }}>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="phone"
                                                                                        className={`form-control ${IsCouponCodeApplied ? CouponCodeCssClass : ''}`}
                                                                                        placeholder='Enter Coupon Code'
                                                                                        value={CouponCode}
                                                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                                                        maxLength={30}
                                                                                    />

                                                                                </div>

                                                                            </div>

                                                                        </td>



                                                                        <td className="product-subtotal">

                                                                            <div class="text-center">
                                                                                <button class="btn btn-rounded btn-outline"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        GetCouponCodeInfo();
                                                                                    }}
                                                                                >
                                                                                    {LocalizationLabelsArray.length > 0 ?
                                                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Apply Coupon", "lbl_check_applycpn")
                                                                                        :
                                                                                        "Apply Coupon"
                                                                                    }
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                    </>
                                            }

                                            <div className="payment-box">
                                                <div className="upper-box">
                                                    <div className="payment-options">
                                                        <ul>
                                                            <li>
                                                                <div className="radio-option">
                                                                    <input type="radio" name="payment-group" id="payment-credit-card" defaultChecked={true} onClick={(e) => setPaymentMethod("5")} />
                                                                    <label htmlFor="payment-credit-card">
                                                                        Credit Card
                                                                    </label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="radio-option">
                                                                    <input type="radio" name="payment-group" id="payment-paypal" onClick={(e) => setPaymentMethod("2")} />
                                                                    <label htmlFor="payment-paypal">
                                                                        PayPal
                                                                    </label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="radio-option">
                                                                    <input type="radio" name="payment-group" id="payment-cash" onClick={(e) => setPaymentMethod("6")} />
                                                                    <label htmlFor="payment-cash">
                                                                        Cash on delivery
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                {cartProductsData != undefined && cartProductsData != null && cartProductsData.length > 0 && (
                                                    <div className="text-right">

                                                        <button type="submit" className="btn-normal btn">
                                                            Place Order
                                                        </button>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>


            <BestFacilities />

            {/*Stripe card section starts here */}
            {
                showCardSectionStripe == true
                    ?


                    <Modal isOpen={showCardSectionStripe} toggle={HandleStripCardModal} centered={true} size="lg" className="theme-modal" id="exampleModal" role="dialog" aria-hidden="true">
                        <ModalBody className="modal-content">
                            <Button className="close" data-dismiss="modal" aria-label="Close"
                                onClick={(e) => {
                                    e.preventDefault();
                                    HandleStripCardModal();
                                }}
                            >
                                <span aria-hidden="true">×</span>
                            </Button>
                            <div className="news-latter">
                                <div className="modal-bg">
                                    <div className="offer-content">
                                        <div>
                                            <h2>Card Details!</h2>
                                            <p>
                                                Provide your card detail<br /> and confirm final order!
                                            </p>


                                            <Elements stripe={stripePromise}>
                                                <CheckoutStripForm

                                                    UserID={loginUser.UserID}
                                                    OrderNote={OrderNote}
                                                    cartJsonData={JSON.stringify(cartItemsSession)}
                                                    ShippingSubTotal={ShippingSubTotal}
                                                    OrderTotal={OrderTotal}
                                                    OrderTotalAfterDiscount={OrderTotalAfterDiscount}
                                                    CouponCode={CouponCode}
                                                    HandleStripCardModal={HandleStripCardModal}
                                                    PlaceAndConfirmCustomerOrder={PlaceAndConfirmCustomerOrder}

                                                />
                                            </Elements>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>


                    :
                    <>
                    </>
            }

            {/* Stripe card section ends here */}

            {/* Paypal card section starts here */}



            {
                showCardSectionPaypal == true
                    ?

                    <PayPalScriptProvider
                        options={{
                            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                        }}
                    >


                        <Modal isOpen={showCardSectionPaypal} toggle={HandlePaypalCardModal} centered={true} size="lg" className="theme-modal" id="exampleModal" role="dialog" aria-hidden="true">
                            <ModalBody className="modal-content">
                                <Button className="close" data-dismiss="modal" aria-label="Close"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        HandlePaypalCardModal();
                                    }}
                                >
                                    <span aria-hidden="true">×</span>
                                </Button>
                                <div className="news-latter">
                                    <div className="modal-bg">
                                        <div className="offer-content">
                                            <div>
                                                <h2>PayPal Options!</h2>

                                               
                                                    <PayPalButtons
                                                        style={{ layout: "vertical" }}
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                    />
                                               

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>

                    </PayPalScriptProvider>

                    :
                    <>
                    </>


            }



            {/* Paypal card section ends here */}


        </>
    );
}

export default Checkout;
