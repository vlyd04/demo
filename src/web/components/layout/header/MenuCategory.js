import React, { Fragment, useContext, useEffect, Component, useState } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Config from "../../../../helpers/Config";
import { MakeApiCallAsync } from "../../../../helpers/ApiHelpers";
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from "../../../../helpers/CommonHelper";
import GlobalEnums from "../../../../helpers/GlobalEnums";
import { makeAnyStringLengthShort, makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from "../../../../helpers/ConversionHelper";
import rootAction from "../../../../stateManagment/actions/rootAction";


const MenuCategory = () => {
    const dispatch = useDispatch();
    const [showState, setShowState] = useState(false);


    const { t } = useTranslation();

    let leftMenuState = useSelector(state => state.commonReducer.isLeftMenuSet);


    const setLeftMenuManual = (value) => {

        dispatch(rootAction.commonAction.setLeftMenu(value));
    }


    const [PopularCategoriesList, setPopularCategories] = useState([]);
    const [langCode, setLangCode] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);

    const forceLoadCategory = (url) => {
        window.location.href = url;
    }


    useEffect(() => {
        // declare the data fetching function
        const getPopularCategories = async () => {

            //--Get language code
            let lnCode = getLanguageCodeFromSession();
            await setLangCode(lnCode);

            const headers = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    PageNo: 1,
                    PageSize: 30,
                    recordValueJson: "[]",
                },
            };


            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_POPULAR_CATEGORIES'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                setPopularCategories(JSON.parse(response.data.data));

            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["PopularCategories"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        // call the function
        getPopularCategories().catch(console.error);
    }, [])



    return (
        <>
            <div className="nav-block" onClick={() => setShowState(!showState)}>
                <div className="nav-left">
                    <nav className="navbar" data-toggle="collapse" data-target="#navbarToggleExternalContent">
                        <button className="navbar-toggler" type="button" onClick={() => setShowState(!showState)}>
                            <span className="navbar-icon">
                                <i className="fa fa-arrow-down"></i>
                            </span>
                        </button>
                        <h5 className="mb-0  text-white title-font">

                            {LocalizationLabelsArray.length > 0 ?
                                replaceLoclizationLabel(LocalizationLabelsArray, " shop By Category", "lbl_shopby_category")
                                :
                                "shop By Category"
                            }
                        </h5>
                    </nav>
                    <div className={`collapse  nav-desk ${showState ? "show" : ""}`} id="navbarToggleExternalContent">
                        <a
                            href="#"
                            onClick={() => {
                                setLeftMenuManual(!leftMenuState);
                                document.body.style.overflow = "visible";
                            }}
                            className={`overlay-cat ${leftMenuState ? "showoverlay" : ""}`}></a>
                        <ul className={`nav-cat title-font ${leftMenuState ? "openmenu" : ""}`}>
                            <li
                                className="back-btn"
                                onClick={() => {
                                    setLeftMenuManual(false);
                                    document.body.style.overflow = "visible";
                                }}>
                                <a>
                                    <i className="fa fa-angle-left"></i>Back
                                </a>
                            </li>


                            {PopularCategoriesList && PopularCategoriesList?.filter(x => x.ParentCategoryID != null && x.ParentCategoryID != undefined)?.map((item, i) => (
                                <li key={i}>
                                    <Link to="#"
                                        onClick={(e) => {
                                            forceLoadCategory(`/${getLanguageCodeFromSession()}/all-products/${item.CategoryID ?? 0}/${replaceWhiteSpacesWithDashSymbolInUrl(item.Name)}`);
                                        }}
                                    >
                                        <Media src={adminPanelBaseURL + item.AttachmentURL} alt="category-product" className="img-fluid" style={{ width: "39px", height: "39px" }} />

                                      
                                        {
                                            langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                ?
                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                    ?
                                                    makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 22)
                                                    :
                                                    makeAnyStringLengthShort(item.Name, 17)
                                                )

                                                :
                                                makeAnyStringLengthShort(item.Name, 17)
                                        }
                                    </Link>
                                </li>
                            ))}







                        </ul>
                    </div>
                </div>
            </div>
        </>
    );

}


export default MenuCategory;
