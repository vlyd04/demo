import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Container, Input, Label, Collapse, Media } from "reactstrap";
import ProductRatingStars from "../products/ProductRatingStars";
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { useSelector, useDispatch } from 'react-redux';
import rootAction from '../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { makeAnyStringLengthShort, makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from '../../../helpers/ConversionHelper';
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';


export const SiteLeftSidebarFilter = (props) => {

    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
    const [isBrandOpen, setIsBrandOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const toggleBrand = () => setIsBrandOpen(!isBrandOpen);
    const toggleSize = () => setIsSizeOpen(!isSizeOpen);
    const toggleRating = () => setIsRatingOpen(!isRatingOpen);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const toggleTag = () => setIsTagOpen(!isTagOpen);

    const [isColorOpen, setIsColorOpen] = useState(true);
    const toggleColor = () => setIsColorOpen(!isColorOpen);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [radioChecked, setRadioChecked] = useState(null);

    const handleBrands = (brand) => {
        return brand;
    }
    const togglePrice = (brand) => {
        setIsPriceOpen(!isPriceOpen);
    }

    const dispatch = useDispatch();
    const [RowColCssCls, setRowColClass] = useState(props.RowColCssCls);
    const [currentSelection, setcurrentSelection] = useState(false);
    const [collection, setCollection] = useState(false);
    const [brand, setBrand] = useState(false);
    const [size, setSize] = useState(false);
    const [price, setPrice] = useState(false);
    const [color, setColor] = useState(false);
    const [tag, setTag] = useState(false);
    const [rating, setRating] = useState(false);
    const [SizeList, setSizeList] = useState([]);
    const [CategoriesList, setCategoriesList] = useState([]);
    const [ManufacturerList, setManufacturerList] = useState([]);
    const [TagsList, setTagsList] = useState([]);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [langCode, setLangCode] = useState('');
    const [defaultCurrency, setDefaultCurrency] = useState(GetDefaultCurrencySymbol());

    const [PriceValuesArray, setPriceValuesArray] = useState(
        [
            {
                id: "10-100",
                name: `${defaultCurrency}10 - ${defaultCurrency}100`
            },
            {
                id: "100-200",
                name: `${defaultCurrency}100 - ${defaultCurrency}200`
            },
            {
                id: "200-300",
                name: `${defaultCurrency}200 - ${defaultCurrency}300`
            },
            {
                id: "300-400",
                name: `${defaultCurrency}300 - ${defaultCurrency}400`
            },
            {
                id: "400-500",
                name: `${defaultCurrency}400 - ${defaultCurrency}500`
            },
            {
                id: "500-600",
                name: `${defaultCurrency}500 - ${defaultCurrency}600`
            },
            {
                id: "600-1000000000",
                name: `Above ${defaultCurrency}600`
            }
        ]
    );


    const clearFilter = (e) => {

        window.location.reload();
    }


    useEffect(() => {

        const GetFiltersAllValues = async () => {


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

            //--Get categories list
            const categoriesResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CATEGORIES_LIST'], null, param, headers, "POST", true);
            if (categoriesResponse != null && categoriesResponse.data != null) {
                await setCategoriesList(JSON.parse(categoriesResponse.data.data));
                console.log(JSON.parse(categoriesResponse.data.data))

            }

            //--Get sizes list
            const sizeResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_SIZE_LIST'], null, param, headers, "POST", true);
            if (sizeResponse != null && sizeResponse.data != null) {
                await setSizeList(JSON.parse(sizeResponse.data.data));
            }

            //--Get manufacturer list
            const manufacturerResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_MANUFACTURER_LIST'], null, param, headers, "POST", true);
            if (manufacturerResponse != null && manufacturerResponse.data != null) {
                await setManufacturerList(JSON.parse(manufacturerResponse.data.data));

            }

            //--Get popular tags
            const tagsResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_TAGS_LIST'], null, param, headers, "POST", true);
            if (tagsResponse != null && tagsResponse.data != null) {
                await setTagsList(JSON.parse(tagsResponse.data.data));

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

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //--Get language code
            let lnCode = getLanguageCodeFromSession();
            await setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["SiteLeftSidebarFilter"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])




    return (
        <>

            <div className="collection-filter-block creative-card creative-inner category-side">

                <div className="collection-mobile-back">
                    <span className="filter-back"
                        onClick={(e) => {
                            props.setLeftSidebarOpenCloseFromFilter(e, false);
                        }}
                    >
                        <i className="fa fa-angle-left" aria-hidden="true"></i> back
                    </span>
                </div>

                {
                    CategoriesList != undefined && CategoriesList != null && CategoriesList.length > 0
                        ?
                        <div className="collection-collapse-block open">
                            <h3 className="collapse-block-title mt-0" onClick={toggleCategory}>

                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Category", "lbl_lftfilt_category")
                                    :
                                    "Category"
                                }
                            </h3>
                            <Collapse isOpen={isCategoryOpen}>
                                <div className="collection-collapse-block-content">
                                    <div className="collection-brand-filter">
                                        <ul className="category-list">

                                            {CategoriesList?.map((item, idx) => {

                                                if (CategoriesList.filter(obj => obj.ParentCategoryID == item.CategoryID).length > 0) {
                                                    return (
                                                        <>
                                                            <li style={{ marginTop: "21px" }}>
                                                                <div>


                                                                    <Link to="#!">
                                                                        {

                                                                            langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                                ?
                                                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                                    ?
                                                                                    makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                                    :
                                                                                    makeAnyStringLengthShort(item.Name, 30)
                                                                                )

                                                                                :
                                                                                makeAnyStringLengthShort(item.Name, 30)
                                                                        }
                                                                    </Link>
                                                                    <div style={{ marginLeft: "20px", fontSize: "12px", lineHeight: "14px" }}>
                                                                        {CategoriesList.filter(obj => obj.ParentCategoryID == item.CategoryID).map((elementChild, idxChild) => {

                                                                            return (
                                                                                <>


                                                                                    <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                                                                        <Input
                                                                                            onChange={(e) => {
                                                                                                props.setFilterValueInParent(e, elementChild.CategoryID, "category");

                                                                                            }}
                                                                                            type="checkbox"
                                                                                            className="custom-control-input"
                                                                                            id={`category_${idxChild}`}
                                                                                        />
                                                                                        <label className="custom-control-label">
                                                                                            {

                                                                                                langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                                                    ?
                                                                                                    (elementChild.LocalizationJsonData != null && elementChild.LocalizationJsonData.length > 0
                                                                                                        ?
                                                                                                        makeAnyStringLengthShort(elementChild.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                                                        :
                                                                                                        makeAnyStringLengthShort(elementChild.Name, 30)
                                                                                                    )

                                                                                                    :
                                                                                                    makeAnyStringLengthShort(elementChild.Name, 30)
                                                                                            }
                                                                                        </label>
                                                                                    </div>



                                                                                </>
                                                                            );
                                                                        })}

                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </>
                                                    );
                                                } else {
                                                    return null;
                                                }


                                            })}


                                        </ul>
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                        :
                        <>

                        </>

                }

                {
                    ManufacturerList != undefined && ManufacturerList != null && ManufacturerList.length > 0
                        ?
                        <div className="collection-collapse-block open">
                            <h3 className="collapse-block-title mt-0" onClick={toggleBrand}>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Brands", "lbl_lftfilt_brand")
                                    :
                                    "Brands"
                                }
                            </h3>
                            <Collapse isOpen={isBrandOpen}>
                                <div className="collection-collapse-block-content">
                                    <div className="collection-brand-filter">


                                        {ManufacturerList &&
                                            ManufacturerList?.slice(0, 10)?.map((item, idx) =>


                                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                                    <Input
                                                        onChange={(e) => {
                                                            props.setFilterValueInParent(e, item.ManufacturerID, "brand");

                                                        }}
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id={`brad_${idx}`}
                                                    />
                                                    <label className="custom-control-label">{item.Name}</label>
                                                </div>


                                            )}



                                    </div>
                                </div>
                            </Collapse>
                        </div>

                        :

                        <>
                        </>
                }

                {
                    SizeList != undefined && SizeList != null && SizeList.length > 0
                        ?
                        <div className="collection-collapse-block open">
                            <h3 className="collapse-block-title mt-0" onClick={toggleSize}>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Size", "lbl_lftfilt_size")
                                    :
                                    "Size"
                                }
                            </h3>
                            <Collapse isOpen={isSizeOpen}>
                                <div className="collection-collapse-block-content">
                                    <div className="collection-brand-filter">


                                        {SizeList &&
                                            SizeList?.slice(0, 10)?.map((item, idx) =>


                                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                                    <Input
                                                        onChange={(e) => {
                                                            props.setFilterValueInParent(e, item.SizeID, "size");

                                                        }}
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id={`size_${idx}`}
                                                    />
                                                    <label className="custom-control-label">
                                                        {

                                                            langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                ?
                                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                    ?
                                                                    makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                    :
                                                                    makeAnyStringLengthShort(item.ShortName, 30)
                                                                )

                                                                :
                                                                makeAnyStringLengthShort(item.ShortName, 30)
                                                        }
                                                    </label>
                                                </div>


                                            )}



                                    </div>
                                </div>
                            </Collapse>
                        </div>

                        :

                        <>
                        </>
                }

                {
                    PriceValuesArray != undefined && PriceValuesArray != null && PriceValuesArray.length > 0
                        ?

                        <div className="collection-collapse-block border-0 open">
                            <h3 className="collapse-block-title" onClick={togglePrice}>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Price", "lbl_lftfilt_price")
                                    :
                                    "Price"
                                }
                            </h3>
                            <Collapse isOpen={isPriceOpen}>
                                <div className="collection-collapse-block-content">
                                    <div className="collection-brand-filter">

                                        {
                                            PriceValuesArray?.map((item, idx) =>

                                                <div className="custom-control custom-checkbox collection-filter-checkbox">
                                                    <Input
                                                        onClick={(e) => {
                                                            props.setFilterValueInParent(e, item.id, "price");

                                                        }}
                                                        type="radio"
                                                        name="price-filter"
                                                        className="custom-control-input"
                                                        id="hundred"
                                                        checked={radioChecked === item.id}
                                                        onChange={() => setRadioChecked(item.id)}
                                                    />
                                                    <Label className="custom-control-label">{item.name}</Label>
                                                </div>
                                            )}


                                    </div>
                                </div>
                            </Collapse>
                        </div>
                        :
                        <>
                        </>
                }

                <div className="collection-collapse-block open">
                    <h3 className="collapse-block-title mt-0" onClick={toggleRating}>
                        {LocalizationLabelsArray.length > 0 ?
                            replaceLoclizationLabel(LocalizationLabelsArray, "Rating", "lbl_lftfilt_rating")
                            :
                            "Rating"
                        }
                    </h3>
                    <Collapse isOpen={isRatingOpen}>
                        <div className="collection-collapse-block-content">
                            <div className="collection-brand-filter">
                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                    <Link to="#"
                                        onClick={(e) => { props.setFilterValueInParent(e, 5, "rating"); }}>
                                        <ProductRatingStars Rating={5} />
                                    </Link>
                                </div>
                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                    <Link to="#"
                                        onClick={(e) => { props.setFilterValueInParent(e, 4, "rating"); }}
                                    >
                                        <ProductRatingStars Rating={4} />
                                    </Link>
                                </div>
                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                    <Link to="#"
                                        onClick={(e) => { props.setFilterValueInParent(e, 3, "rating"); }}
                                    >
                                        <ProductRatingStars Rating={3} />
                                    </Link>
                                </div>
                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                    <Link to="#"
                                        onClick={(e) => { props.setFilterValueInParent(e, 2, "rating"); }}
                                    >
                                        <ProductRatingStars Rating={2} />
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </Collapse>
                </div>


                {
                    TagsList != undefined && TagsList != null && TagsList.length > 0
                        ?
                        <div className="collection-collapse-block open">
                            <h3 className="collapse-block-title mt-0" onClick={toggleTag}>
                                {LocalizationLabelsArray.length > 0 ?
                                    replaceLoclizationLabel(LocalizationLabelsArray, "Popular Tags", "lbl_lftfilt_tags")
                                    :
                                    "Popular Tags"
                                }
                            </h3>
                            <Collapse isOpen={isTagOpen}>
                                <div className="collection-collapse-block-content">
                                    <div className="collection-brand-filter">


                                        {TagsList &&
                                            TagsList?.slice(0, 10)?.map((item, idx) =>


                                                <div className="custom-control custom-checkbox collection-filter-checkbox" >
                                                    <Input
                                                        onChange={(e) => {
                                                            props.setFilterValueInParent(e, item.TagID, "tag");

                                                        }}
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id={`tag_${idx}`}
                                                    />
                                                    <label className="custom-control-label">
                                                        {

                                                            langCode != null && langCode == Config.LANG_CODES_ENUM["Arabic"]
                                                                ?
                                                                (item.LocalizationJsonData != null && item.LocalizationJsonData.length > 0
                                                                    ?
                                                                    makeAnyStringLengthShort(item.LocalizationJsonData?.find(l => l.langId == Config.LANG_CODES_IDS_ENUM["Arabic"])?.text, 30)
                                                                    :
                                                                    makeAnyStringLengthShort(item.TagName, 30)
                                                                )

                                                                :
                                                                makeAnyStringLengthShort(item.TagName, 30)
                                                        }
                                                    </label>
                                                </div>


                                            )}



                                    </div>
                                </div>
                            </Collapse>
                        </div>

                        :

                        <>
                        </>
                }





                <Row>
                    <Col xs="12" md="12" lg="12" className="text-center">
                        <Link
                            class="btn btn-normal btn-block"
                            onClick={(e) => {
                                clearFilter(e);

                            }}
                        >
                            
                            {LocalizationLabelsArray.length > 0 ?
                                replaceLoclizationLabel(LocalizationLabelsArray, "Clear All Filter", "lbl_lftfilt_clearfilter")
                                :
                                "Clear All Filter"
                            }
                        </Link>
                    </Col>
                </Row>



            </div>

            <LeftSideBarPopularProducts />


        </>


    );
};


export const LeftSideBarPopularProducts = () => {
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
                        PopularProductsList?.slice(0, 5)?.map((item, idx) =>
                            <div className="media">
                                {
                                    item?.ProductImagesJson?.slice(0, 1).map((img, imgIdx) =>
                                        <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}
                                        >
                                            <Media className="img-fluid " src={adminPanelBaseURL + img.AttachmentURL} alt="" />
                                        </Link>

                                    )
                                }

                                <div className="media-body align-self-center">
                                    <ProductRatingStars Rating={item.Rating == undefined || item.Rating == null ? 5 : item.Rating} />

                                    <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}
                                    >
                                        <h6>{makeProductShortDescription(item.ProductName, 20)}</h6>
                                    </Link>
                                    <h4>{GetDefaultCurrencySymbol()}{item.Price}</h4>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>

    );
}


