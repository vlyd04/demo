import React, { useContext, useEffect, useState, Component } from "react";
import { Row, Col, Dropdown, DropdownToggle } from "reactstrap";
import { useTranslation } from "react-i18next";
import GlobalEnums from '../../../../helpers/GlobalEnums';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel, setLanguageCodeInSession } from '../../../../helpers/CommonHelper';
import { Link } from 'react-router-dom';

const langCodeArray = [
  {
    langCode: "en",
    name: "Engligh"
  },
  {
    langCode: "ar",
    name: "Arabic"
  }
]


const TopHeader = () => {

  const { i18n, t } = useTranslation();
  const [openLang, setOpenLang] = useState(false);
  const [url, setUrl] = useState("");
  const toggleLang = () => {
    setOpenLang(!openLang);
  };

  useEffect(() => {
    const path = window.location.pathname.split("/");
    const urlTemp = path[path.length - 1];
    setUrl(urlTemp);
  }, []);


  const [langCode, setLangCode] = useState('');
  const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
  const handleLangCodeInSession = async (value) => {

    await setLanguageCodeInSession(value);
    await setLangCode(value);

    let homeUrl = '/' + value + '/';
    window.location.href = homeUrl;
    // navigate(homeUrl, { replace: true });
  }

  useEffect(() => {
    // declare the data fetching function
    const dataOperationFunc = async () => {
      let lnCode = getLanguageCodeFromSession();
      setLangCode(lnCode);

      //-- Get website localization data
      let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["TopHeader"], null);
      if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
        await setLocalizationLabelsArray(arryRespLocalization);
      }
    }
    // call the function
    dataOperationFunc().catch(console.error);
  }, [])




  return (
    <div className={`top-header ${url === "layout6" ? "top-header-inverse" : ""}`}>
      <div className="custom-container">
        <Row>
          <Col xl="5" md="7" sm="6">
            <div className="top-header-left">
              <div className="shpping-order">
                <h6>
                  
              
                  {LocalizationLabelsArray.length > 0 ?
                      replaceLoclizationLabel(LocalizationLabelsArray, "free shipping on order over $99", "lbl_thead_freeship")
                      :
                      "free shipping on order over $99"
                    }
                  
                  </h6>
              </div>
              <div className="app-link">
                <h6>
                  <Link to={`/${getLanguageCodeFromSession()}/become-seller`} id="lbl_thead_seller"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {LocalizationLabelsArray.length > 0 ?
                      replaceLoclizationLabel(LocalizationLabelsArray, "Become Seller", "lbl_thead_seller")
                      :
                      "Become Seller"
                    }
                  </Link>
                </h6>
                <ul>

                  <li>
                    <a>
                      <i className="fa fa-android"></i>
                    </a>
                  </li>

                </ul>
              </div>
            </div>
          </Col>
          <Col xl="7" md="5" sm="6">
            <div className="top-header-right">
              <div className="top-menu-block">
                <ul>
                  <li>
                    <a href="#">gift cards</a>
                  </li>
                  <li>
                    <a href="#">Notifications</a>
                  </li>
                  <li>
                    <a href="#">help & contact</a>
                  </li>
                  <li>
                    <a href="#">todays deal</a>
                  </li>
                  <li>
                    <a href="#">track order</a>
                  </li>
                  <li>
                    <a href="#">shipping </a>
                  </li>
                  <li>
                    <a href="#">easy returns</a>
                  </li>
                </ul>
              </div>
              <div className="language-block">
                <div className="language-dropdown">
                  <Dropdown isOpen={openLang} toggle={toggleLang}>
                    <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={openLang} className="language-dropdown-click">
                      {langCodeArray?.find(x => x.langCode == langCode)?.name}
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </DropdownToggle>
                    <ul className={`language-dropdown-open ${openLang ? "" : "open"}`}>

                      <li >
                        <a onClick={() => handleLangCodeInSession("en")} href="#">English</a>
                      </li>
                      <li>
                        <a onClick={() => handleLangCodeInSession("ar")} href="#">Arabic</a>
                      </li>
                    </ul>
                  </Dropdown>
                </div>

              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );

}


export default TopHeader;
