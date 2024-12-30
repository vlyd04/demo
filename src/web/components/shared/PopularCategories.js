import React, { useEffect, useState } from 'react';
import { Row, Col, Media, Container } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import Config from '../../../helpers/Config';
import myImage from '../../../resources/themeContent/images/layout-2/collection-banner/2.jpg';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import { MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { makeAnyStringLengthShort, replaceWhiteSpacesWithDashSymbolInUrl } from '../../../helpers/ConversionHelper';

var settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 6,
  slidesToScroll: 6,
  responsive: [
    {
      breakpoint: 1367,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

const CategoryList = [
  { img: "/images/layout-1/rounded-cat/1.png", category: "Flower" },
  { img: "/images/layout-1/rounded-cat/2.png", category: "Furniture" },
  { img: "/images/layout-1/rounded-cat/3.png", category: "Bag" },
  { img: "/images/layout-1/rounded-cat/4.png", category: "Tools" },
  { img: "/images/layout-1/rounded-cat/5.png", category: "Grocery" },
  { img: "/images/layout-1/rounded-cat/6.png", category: "Camera" },
  { img: "/images/layout-1/rounded-cat/7.png", category: "cardigans" },
];

const PopularCategories = () => {
  const [PopularCategoriesList, setPopularCategories] = useState([]);
  const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);
  const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
  const [langCode, setLangCode] = useState('');

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
          PageSize: 20,
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

      {
        PopularCategoriesList != undefined && PopularCategoriesList != null && PopularCategoriesList.length > 0
          ?
          <>
            <div className="title6 ">
              <h4>   {LocalizationLabelsArray.length > 0 ?
                replaceLoclizationLabel(LocalizationLabelsArray, " Popular Categories!", "lbl_popct_category")
                :
                " Popular Categories!"
              }
              </h4>
            </div>

            <section className="rounded-category rounded-category-inverse">
              <Container>
                <Row>
                  <Col>
                    <div className="slide-6 no-arrow">
                      <Slider {...settings}>
                        {PopularCategoriesList && PopularCategoriesList.map((item, i) => (
                          <div key={i}>
                            <div className="category-contain">
                              <a href="#">
                                <div className="img-wrapper">
                                  <Media src={adminPanelBaseURL + item.AttachmentURL} alt="category"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} className=""
                                    title={
                                      langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                        ?
                                        (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                          ?
                                          makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 22)
                                          :
                                          makeAnyStringLengthShort(item.Name, 22)
                                        )

                                        :
                                        makeAnyStringLengthShort(item.Name, 22)
                                    }

                                  />
                                </div>
                                <div>
                                  <div className="btn-rounded">

                                    {(() => {


                                      let allProductsUrl = `/${getLanguageCodeFromSession()}/all-products/${item.CategoryID ?? 0}/${replaceWhiteSpacesWithDashSymbolInUrl(item.Name)}`
                                      console.log(allProductsUrl);

                                      return (
                                        <>
                                          <Link to={allProductsUrl} style={{ color: 'inherit', textDecoration: 'none' }}>

                                            {

                                              langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                ?
                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                  ?
                                                  makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 22)
                                                  :
                                                  makeAnyStringLengthShort(item.Name, 22)
                                                )

                                                :
                                                makeAnyStringLengthShort(item.Name, 22)
                                            }


                                          </Link>
                                        </>
                                      );
                                    })()}

                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </>
          :
          <>
          </>
      }


    </>
  );
};

export default PopularCategories;