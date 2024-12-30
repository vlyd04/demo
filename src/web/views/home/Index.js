import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Config from '../../../helpers/Config';
import BannerSlider from '../../components/home/BannerSlider';
import PopularCategories from '../../components/shared/PopularCategories';
import DiscountBannerOmg from '../../components/shared/DiscountBannerOmg';
import NewProducts from '../../components/products/NewProducts';
import CompaignSection from '../../components/shared/CompaignSection';
import TodayHotDeal from '../../components/products/TodayHotDeal';
import CustomerTestimonial from '../../components/shared/CustomerTestimonial';
import PopularProducts from '../../components/products/PopularProducts';
import ContactBanner from '../../components/shared/ContactBanner';


const Home = () => {
    const navigate = useNavigate();
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);

    return (
        <>

            <Helmet>
                <title>{siteTitle} - Home</title>
                <meta name="description" content={siteTitle + " - Home"} />
                <meta name="keywords" content="Home"></meta>
            </Helmet>

            <div className="bg-light">
                <BannerSlider />
                <PopularCategories />
                <DiscountBannerOmg/>
                <NewProducts effect="icon-inline"/>
                <CompaignSection/>
                <TodayHotDeal/>
                <CustomerTestimonial/>
                <PopularProducts hoverEffect = "icon-inline"/>
                <ContactBanner/>
            </div>
        </>
    );

}

export default Home;


