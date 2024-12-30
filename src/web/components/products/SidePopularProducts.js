import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { makeAnyStringLengthShort, makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from '../../../helpers/ConversionHelper';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { Media } from "reactstrap";



const SidePopularProducts = () => {
    const dispatch = useDispatch();

    const [PopularProductsList, setPopularProductsList] = useState([]);
    const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    const GetPopularProductsForLeftSideBar = async () => {

        const headersPouplarProducts = {
            // customerid: userData?.UserID,
            // customeremail: userData.EmailAddress,
            Accept: 'application/json',
            'Content-Type': 'application/json',

        }


        const paramPouplarProducts = {
            requestParameters: {
                PageNo: 1,
                PageSize: 10,
                recordValueJson: "[]",
            },
        };

        const responsePopularProducts = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_POPULAR_PRODUCTS_LIST'], null, paramPouplarProducts, headersPouplarProducts, "POST", true);
        if (responsePopularProducts != null && responsePopularProducts.data != null) {
            await setPopularProductsList(JSON.parse(responsePopularProducts.data.data));
            console.log(JSON.parse(responsePopularProducts.data.data));
        }
    }

    const forceLoadProduct =(url) =>{
       window.location.href=url;
    }


    useEffect(() => {

        const GetFiltersAllValues = async () => {

            //--get popular products list
            await GetPopularProductsForLeftSideBar();

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["SiteLeftSidebarFilter"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }

        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        GetFiltersAllValues().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);
    }, [])



    return (

        <>
          

            <div className="theme-card creative-card creative-inner">
                <h5 className="title-border">
                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "Popular Products", "lbl_lftfilt_pop_prod")
                        :
                        "Popular Products"
                    }
                </h5>
                <div className="offer-slider slide-1">
                    <div>
                        {
                            PopularProductsList?.map((item, idx) =>
                                <div className="media">
                                    <Link to='#' 
                                 
                                    onClick={(e) => {
                                       
                                        forceLoadProduct(`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`);
                                    }}
                                    >
                                        
                                    {
                                        item?.ProductImagesJson?.slice(0, 1).map((img, imgIdx) =>
                                            <>
                                                 <Media className="img-fluid " src={adminPanelBaseURL + img.AttachmentURL} alt="side popular product" />

                                            </>

                                        )
                                    }
                                       
                                    </Link>
                                    <div className="media-body align-self-center">
                                       
                                       

                                        <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}>
                                            <h6>{makeProductShortDescription(item.ProductName, 20)}</h6>
                                        </Link>
                                        <h4>{GetDefaultCurrencySymbol()}{item.Price}</h4>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>



        </>

    );
}

export default SidePopularProducts;