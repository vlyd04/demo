import React, { Component, useContext, useEffect, useState } from 'react';
import useOutSideClick from '../../../../helpers/utils/outSideClick'
import useMobileSize from '../../../../helpers/utils/isMobile'
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../../helpers/CommonHelper';
import GlobalEnums from '../../../../helpers/GlobalEnums';
import rootAction from '../../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../../helpers/Constants';


const MenuBar = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [langCode, setLangCode] = useState('');

    const [menuData, setmenuData] = useState(
        [
            {
                title: "Home",
                type: "non-sub",
            },
            {
                title: "All Products",
                type: "non-sub",
            },
            {
                title: "Categories",
                type: "sub",
            }
        ]
    );
    const { ref, isComponentVisible, setIsComponentVisible } = useOutSideClick(false);
    const mobileSize = useMobileSize();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState();
    const [isSubNavOpen, setIsSubNavOpen] = useState();
    const path = window.location.pathname;


    useEffect(() => {

        const getDataInUseEffect = async () => {


            //--Get language code
            let lnCode = getLanguageCodeFromSession();
            await setLangCode(lnCode);


            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            }


            const param = {
                requestParameters: {
                    PageNo: 1,
                    PageSize: 100,
                    recordValueJson: "[]",
                },
            };


            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["MegaMenu"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getDataInUseEffect().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);
    }, [])


    return (
        <>

            {path !== "/Layouts/layout3" && (
                <li>
                    <div
                        className="mobile-back text-right"
                        onClick={() => {
                            props.setMenuResponsive(false);
                            document.body.style.overflow = "visible";
                        }}
                        
                        >
                        Back<i className="fa fa-angle-right ps-2" aria-hidden="true"></i>
                    </div>
                </li>
            )}



            {/* {menuData.map((menuItem, i) => {
                return (
                   
                    <li key={i}>
                        <a
                            className="dark-menu-item has-submenu"
                            onClick={() => {
                                setIsComponentVisible(true);
                                setIsOpen(menuItem.title !== isOpen && menuItem.title);
                            }}>
                            {t(menuItem.title)}
                            <span className={`sub-arrow ${(path === "/Layouts/layout3" || mobileSize) && (isOpen === menuItem.title ? "minus" : "plus")}`}></span>
                        </a>

                      
                    </li>
                );
            })} */}

            <li>

                <Link to={`/${getLanguageCodeFromSession()}/`} className="dark-menu-item has-submenu" id="lbl_mgmenu_home">
                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "Home", "lbl_mgmenu_home")
                        :
                        "Home"
                    }
                </Link>
            </li>
            <li>

                <Link to={`/${getLanguageCodeFromSession()}/all-products/0/all-categories`} className="dark-menu-item has-submenu" id="lbl_mgmenu_products">
                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "All Products", "lbl_mgmenu_products")
                        :
                        "All Products"
                    }
                </Link>
            </li>
            <li>

                <Link to={`/${getLanguageCodeFromSession()}/contact-us`} id="lbl_thead_contct" className="dark-menu-item has-submenu">

                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "Contact", "lbl_thead_contct")
                        :
                        "Contact"
                    }
                </Link>
            </li>
            <li>

                <Link to={`/${getLanguageCodeFromSession()}/faq`} id="lbl_thead_faq" className="dark-menu-item has-submenu">

                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, " FAQ's", "lbl_thead_faq")
                        :
                        "FAQ's"
                    }

                </Link>
            </li>
            <li>

                <Link to={`/${getLanguageCodeFromSession()}/about`} className="dark-menu-item has-submenu" id="lbl_thead_about">
                    {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "About", "lbl_thead_about")
                        :
                        "About"
                    }



                </Link>
            </li>

        </>
    );
};

export default MenuBar;





