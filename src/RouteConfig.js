import React from "react";
import { BrowserRouter, Routes, Link, Route, Navigate } from "react-router-dom";
import LoadingScreen from "./web/components/shared/LoadingScreen";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./web/views/home/Index";
import Navbar from "./web/components/layout/header/Navbar";
import Footer from "./web/components/layout/Footer";
import BecomeVendor from "./web/views/signup/BecomeVendor";
import Login from "./web/views/login/Login";
import Signup from "./web/views/signup/Signup";
import About from "./web/views/about/About";
import FaqPage from "./web/views/faq/FaqPage";
import ContactUs from "./web/views/contactUs/Index";
import ProductDetail from "./web/views/products/ProductDetail";
import Cart from "./web/views/checkout/Cart";
import AllProducts from "./web/views/products/AllProducts";
import OrdersHistory from "./web/views/signup/OrdersHistory";
import Checkout from "./web/views/checkout/Checkout";
import UpdateProfile from "./web/views/signup/UpdateProfile";
import Refresh from "./web/views/common/Refresh";
import ResetPassword from "./web/views/login/ResetPassword";
import GoTop from "./web/components/layout/GoTop";
import CompareList from "./web/views/compare/Index";
import Campaign from "./web/views/campaign/Campaign";



export default function RouteConfig() {

    return (
        <>

            <LoadingScreen />
            <Navbar />

            <Routes>

                {/* Routes without language code starts here */}
                <Route path="/all-products/:category_id/:category_name" element={<AllProducts />} />
                <Route path="/product-detail/:product_id/:category/:product_name" default element={<ProductDetail />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/" default element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/campaign/:campaign_id/:campaign_main_title" default element={<Campaign />} />
                <Route path="/orders-history" element={<OrdersHistory />} />
                <Route path="/refresh" element={<Refresh/>} />
                <Route path="/become-seller" element={<BecomeVendor />} />
                <Route path="/compare" element={<CompareList />} />
                {/* Routes without language code ends here */}

                {/* Routes with language code starts here */}
                <Route path="/:langCode/" element={<Home />} />
                <Route path="/:langCode/all-products/:category_id/:category_name" element={<AllProducts />} />
                <Route path="/:langCode/product-detail/:product_id/:category/:product_name" default element={<ProductDetail />} />
                <Route path="/:langCode/contact-us" element={<ContactUs />} />
                <Route path="/:langCode/login" element={<Login />} />
                <Route path="/:langCode/signup" element={<Signup />} />
                <Route path="/:langCode/reset-password" element={<ResetPassword />} />
                <Route path="/:langCode/checkout" element={<Checkout />} />
                <Route path="/:langCode/about" element={<About />} />
                <Route path="/:langCode/faq" element={<FaqPage />} />
                <Route path="/:langCode/cart" element={<Cart />} />
                <Route path="/:langCode/update-profile" element={<UpdateProfile />} />
                <Route path="/:langCode/campaign/:campaign_id/:campaign_main_title" default element={<Campaign />} />
                <Route path="/:langCode/orders-history" element={<OrdersHistory />} />
                <Route path="/:langCode/refresh" element={<Refresh />} />
                <Route path="/:langCode/become-seller" element={<BecomeVendor />} />
                <Route path="/:langCode/compare" element={<CompareList />} />
                {/* Routes with language code ends here */}

                
            </Routes>


            <Footer layoutLogo="layout-2"/>
            <GoTop/>


            {/* <WhatsappChatButton /> */}



            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                draggable={true}
                pauseOnHover={true}
                closeOnClick={true}
                theme="colored"
            />




        </>
    );
}
