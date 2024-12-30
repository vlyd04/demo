import React, { Fragment, useContext, useEffect, Component, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Media, Input, DropdownToggle, DropdownMenu, InputGroupText, DropdownItem, InputGroup, ButtonDropdown } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import logoImage from '../../../../resources/custom/images/noor_shop_logo_3.jpg';
import rootAction from "../../../../stateManagment/actions/rootAction";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from "../../../../helpers/CommonHelper";
import { showInfoMsg } from "../../../../helpers/ValidationHelper";
import { MakeApiCallAsync } from "../../../../helpers/ApiHelpers";
import Config from "../../../../helpers/Config";
import GlobalEnums from "../../../../helpers/GlobalEnums";
import { makeAnyStringLengthShort, makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from "../../../../helpers/ConversionHelper";

const SearchHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [PopularCategoriesList, setPopularCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState(0);
    const [categoryText, setCategoryText] = useState("All Category");
    const [SearchTerm, setSearchTerm] = useState("");
    const leftMenuState = useSelector(state => state.commonReducer.isLeftMenuSet);
    const [leftMenu, setLeftMenu] = useState(leftMenuState);
    const [langCode, setLangCode] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const totalCartItems = useSelector(state => state.cartReducer.totalCartItems);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const { t } = useTranslation();

    const setLeftMenuManual = (value) => {

        setLeftMenu(value);
        dispatch(rootAction.commonAction.setLeftMenu(value));
    }

    const hangleCategory = (id, text) => {

        setSearchCategory(id ?? 0);
        setCategoryText(text);
    }

    const handleCart = (event) => {
        event.preventDefault();

        if (totalCartItems != null && totalCartItems != null && totalCartItems > 0) {
            navigate('/' + getLanguageCodeFromSession() + '/cart');
        } else {
            showInfoMsg('No item exists in your cart');
        }

    }

    const submitSearchForm = (event) => {
        event.preventDefault();

        let categ = searchCategory ?? 0;
        if (SearchTerm != null && SearchTerm != undefined && SearchTerm.length > 1) {

            let url = "/";
            if (categoryText != undefined && categoryText != "All Category") {
                url = "/" + getLanguageCodeFromSession() + "/all-products/" + categ + "/" + replaceWhiteSpacesWithDashSymbolInUrl(categoryText) + "?SearchTerm=" + SearchTerm;
            } else {
                url = "/" + getLanguageCodeFromSession() + "/all-products/" + categ + "/all-categories?SearchTerm=" + SearchTerm;
            }

            window.location.href = url;

            // navigate(url, { replace: true });
            // window.location.reload();
        } else {
            showInfoMsg('Enter something then search');
        }
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
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["WebsiteSearchHeader"], null);
         
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        // call the function
        getPopularCategories().catch(console.error);
    }, [])


    return (
        <>

            <Container>
                <Row>
                    <Col md="12">
                        <div className="main-menu-block">
                            <div
                                onClick={() => {
                                    setLeftMenuManual(!leftMenu);
                                    document.body.style.overflow = "hidden";
                                }}
                                className="sm-nav-block">
                                <span className="sm-nav-btn">
                                    <i className="fa fa-bars"></i>
                                </span>
                            </div>
                            <div className="logo-block">
                                <a href="/#">
                                    <Media src={logoImage} className="img-fluid  " alt="logo" />
                                </a>
                            </div>
                            <div className="input-block">
                                <div className="input-box">
                                    <form className="big-deal-form" onSubmit={submitSearchForm}>
                                        <InputGroup>
                                            <InputGroupText onClick={(e) => submitSearchForm(e)}>
                                                <span className="search">
                                                    <i
                                                        className="fa fa-search"></i>
                                                </span>
                                            </InputGroupText>
                                            <Input
                                                value={SearchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
                                                <DropdownToggle key={"search-menu-toggle"} caret>
                                                    {categoryText}
                                                </DropdownToggle>
                                                <DropdownMenu key={"search-menu"}>
                                                    <DropdownItem onClick={(e) => hangleCategory(0, 'All Category')}>

                                                        {LocalizationLabelsArray.length > 0 ?
                                                            replaceLoclizationLabel(LocalizationLabelsArray, "All Category", "lbl_allcatg_search_hdr")
                                                            :
                                                            "All Category"
                                                        }
                                                    </DropdownItem>

                                                    {PopularCategoriesList && PopularCategoriesList?.filter(x => x.ParentCategoryID != null && x.ParentCategoryID != undefined)?.map((item, i) => (
                                                        <DropdownItem onClick={(e) => hangleCategory(item.CategoryID, makeProductShortDescription(

                                                            (langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                ?
                                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                    ?
                                                                    makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 14)
                                                                    :
                                                                    makeAnyStringLengthShort(item.Name, 14)
                                                                )

                                                                :
                                                                makeAnyStringLengthShort(item.Name, 14)
                                                            )

                                                            , 14))}>

                                                            {
                                                                langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                    ?
                                                                    (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                        ?
                                                                        makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 17)
                                                                        :
                                                                        makeAnyStringLengthShort(item.Name, 17)
                                                                    )

                                                                    :
                                                                    makeAnyStringLengthShort(item.Name, 17)
                                                            }
                                                        </DropdownItem>
                                                    ))}


                                                </DropdownMenu>
                                            </ButtonDropdown>
                                        </InputGroup>
                                    </form>
                                </div>
                            </div>
                            <div
                                className="cart-block cart-hover-div">
                                <div className="cart ">
                                    <span className="cart-product"> {totalCartItems ?? 0} </span>
                                    <ul>
                                        <li className="mobile-cart">
                                            <Link to="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCart(e);
                                                }}
                                            >
                                                <i className="icon-shopping-cart "></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className={`cart-item`}>
                                    <h5>

                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "shopping", "lbl_search_hdr_shopping")
                                            :
                                            "shopping"
                                        }
                                    </h5>
                                    <h5>
                                        {LocalizationLabelsArray.length > 0 ?
                                            replaceLoclizationLabel(LocalizationLabelsArray, "cart", "lbl_search_hdr_cart")
                                            :
                                            "cart"
                                        }
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );

}


export default SearchHeader;
