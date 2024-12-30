import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import SiteBreadcrumb from "../../components/layout/SiteBreadcrumb";
import Config from "../../../helpers/Config";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import GlobalEnums from "../../../helpers/GlobalEnums";
import { GetLocalizationControlsJsonDataForScreen, ScrollIntoSpecificDiv } from "../../../helpers/CommonHelper";
import rootAction from "../../../stateManagment/actions/rootAction";
import { LOADER_DURATION } from "../../../helpers/Constants";
import ProductBox from "../../components/products/ProductBox";
import ProductsFilterOptions from "../../components/products/ProductsFilterOptions";
import { Helmet } from 'react-helmet';
import emptySearch from '../../../resources/themeContent/images/empty-search.jpg';
import sideBannerImg from '../../../resources/themeContent/images/category/side-banner.png';
import SitePagination from "../../components/shared/SitePagination";
import { SiteLeftSidebarFilter } from "../../components/shared/SiteLeftSidebarFilter";


const AllProducts = () => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [cols, setCols] = useState("col-xl-3 col-md-4 col-6 col-grid-box");
    const [grid, setGrid] = useState(cols);
    const [layout, setLayout] = useState("");


    //--noor code starts here
    const dispatch = useDispatch();
    const search = useLocation().search;
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [RowColCssCls, setRowColCssCls] = useState("col-lg-3 col-md-12");
    const [ProductListMainClass, setProductListMainClass] = useState("col-lg-4 col-sm-6 col-md-4 col-6 products-col-item");
    const [gridClass, setGridClass] = useState("");
    const [ProductsList, setProductsList] = useState([]);
    const [TotalRecords, setTotalRecords] = useState(0);
    const [showPagination, setshowPagination] = useState(false);
    const [PageNo, setPageNo] = useState(1);
    const [PageSize, setPageSize] = useState(10);
    const [OrderByColumnName, setOrderByColumnName] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);


    //--set product id from url
    const params = useParams();
    let categParamArray = [];
    categParamArray.push(parseInt(params.category_id) ?? 0);
    const [CategoryID, setCategoryID] = useState(categParamArray);



    const [SearchTerm, setSearchTerm] = useState(new URLSearchParams(search).get('SearchTerm'));
    const [SizeID, setSizeID] = useState([]);
    const [ColorID, setColorID] = useState(null);
    const [TagID, setTagID] = useState([]);
    const [ManufacturerID, setManufacturerID] = useState([]);
    const [MinPrice, setMinPrice] = useState(null);
    const [MaxPrice, setMaxPrice] = useState(null);
    const [Rating, setRating] = useState(null);


    const setFilterValueInParent = async (e, value, type) => {

        // e.preventDefault();

        //--intialize variables
        let categoriesIdsCommaSeperated = CategoryID.length > 0 ? CategoryID.join(",") : "";
        let brandsIdsCommaSeperated = ManufacturerID.length > 0 ? ManufacturerID.join(",") : "";
        let sizeIdsCommaSeperated = SizeID.length > 0 ? SizeID.join(",") : "";
        let tagsIdsCommaSeperated = TagID.length > 0 ? TagID.join(",") : "";
        let minPriceLocal = MinPrice;
        let maxPriceLocal = MaxPrice;
        let colorIdLocal = ColorID;
        let ratingLocal = Rating;

    
        if (type == "category") {

            let updatedCategories = [...CategoryID];
            const index = updatedCategories.indexOf(value);

            if (index === -1) {
                updatedCategories.push(value);
            } else {
                updatedCategories.splice(index, 1);
            }
            updatedCategories = updatedCategories.filter((num) => num !== 0);

            await setCategoryID(updatedCategories);
            categoriesIdsCommaSeperated = updatedCategories.join(",");


        } else if (type == "brand") {

            let updatedBrands = [...ManufacturerID];
            const index = updatedBrands.indexOf(value);

            if (index === -1) {
                updatedBrands.push(value);
            } else {
                updatedBrands.splice(index, 1);
            }
            updatedBrands = updatedBrands.filter((num) => num !== 0);

            await setManufacturerID(updatedBrands);
            brandsIdsCommaSeperated = updatedBrands.join(",");


        } else if (type == "size") {

            let updatedSize = [...SizeID];
            const index = updatedSize.indexOf(value);

            if (index === -1) {
                updatedSize.push(value);
            } else {
                updatedSize.splice(index, 1);
            }
            updatedSize = updatedSize.filter((num) => num !== 0);

            await setSizeID(updatedSize);
            sizeIdsCommaSeperated = updatedSize.join(",");


        } else if (type == "price") {

            // setTimeout(() => {
            //     const priceArray = value.split("-");
            //     setMinPrice(priceArray[0]);
            //     setMaxPrice(priceArray[1]);
            // }, 100);

            const priceArray = value.split("-");
            await setMinPrice(priceArray[0]);
            await setMaxPrice(priceArray[1]);

            minPriceLocal = priceArray[0];
            maxPriceLocal = priceArray[1];
          

           

        } else if (type == "color") {

            await setColorID(value);
            colorIdLocal = value;
           

        }
        else if (type == "rating") {

            await setRating(value);
            ratingLocal = value;
            

        } else if (type == "tag") {


            let updatedTags = [...TagID];
            const index = updatedTags.indexOf(value);

            if (index === -1) {
                updatedTags.push(value);
            } else {
                updatedTags.splice(index, 1);
            }
            updatedTags = updatedTags.filter((num) => num !== 0);

            await setTagID(updatedTags);
            tagsIdsCommaSeperated = updatedTags.join(",");

        }

        await getAllProductsAfterAnyFilterChange(1, categoriesIdsCommaSeperated, brandsIdsCommaSeperated, sizeIdsCommaSeperated, minPriceLocal, maxPriceLocal, ratingLocal, tagsIdsCommaSeperated, colorIdLocal, null);

    }

    //--this function called from the ProductsFiltersOption component
    const setPageSizeFromProductFilter = async (e) => {

        setPageSize(parseInt(e.target.value));
        await getAllProductsAfterAnyFilterChange(1, null, null, null, null, null, null, null, null, null);

    }

    const setSortByFilter = async (e) => {

        setOrderByColumnName(parseInt(e.target.value));
        await getAllProductsAfterAnyFilterChange(1, null, null, null, null, null, null, null, null, e.target.value);

    }

    //--this function called from the SitePagination component
    const setCurrentPage = async (pageNumber) => {


        setTimeout(async () => {
            await getAllProductsAfterAnyFilterChange(pageNumber, null, null, null, null, null, null, null, null, null);
        }, 200);



    }

    const getAllProductsAfterAnyFilterChange = async (pageNumber, _categoryId, _manufacturerId, _sizeId,
        _minPrice, _maxPrice, _rating, _tagId, _colorId, _orderByColumnName) => {


        try {


            //--start loader
            dispatch(rootAction.commonAction.setLoading(true));

            await setPageNo(pageNumber);

            let headersFromPage = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            let paramFromPage = {
                requestParameters: {
                    SearchTerm: SearchTerm,
                    SizeID: _sizeId ??  SizeID.join(","),
                    ColorID: _colorId ?? ColorID,
                    CategoryID: _categoryId ?? CategoryID.join(","),
                    TagID: _tagId ??  TagID.join(","),
                    ManufacturerID: _manufacturerId ??  ManufacturerID.join(","),
                    MinPrice: _minPrice ?? MinPrice,
                    MaxPrice: _maxPrice ?? MaxPrice,
                    Rating: _rating ?? Rating,
                    OrderByColumnName: _orderByColumnName ?? OrderByColumnName,
                    PageNo: pageNumber ?? PageNo,
                    PageSize: PageSize,
                    recordValueJson: "[]",
                },
            };

            setshowPagination(false);


            let responseAllProducts = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_All_PRODUCTS'], null, paramFromPage, headersFromPage, "POST", true);
            if (responseAllProducts != null && responseAllProducts.data != null) {

                await setProductsList(JSON.parse(responseAllProducts.data.data));
                let AllProducts = JSON.parse(responseAllProducts.data.data);
                await setTotalRecords(parseInt(AllProducts[0]?.TotalRecords ?? 0))
                console.log(JSON.parse(responseAllProducts.data.data));

                if (AllProducts.length > 0) {
                    await setshowPagination(true);
                }

            }


            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

            //--Scroll to main div
            ScrollIntoSpecificDiv("all_products_main_sec", "smooth");

        }
        catch (error) {

            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

        }






    }

    const setLeftSidebarOpenCloseFromFilter = async (e, value) => {
        e.preventDefault();
        await setLeftSidebarOpen(value);

    }

    useEffect(() => {

        const getAllProducts = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    SearchTerm: SearchTerm,
                    SizeID:  SizeID.join(","),
                    ColorID: ColorID,
                    CategoryID: CategoryID.join(","),
                    TagID:  TagID.join(","),
                    ManufacturerID:  ManufacturerID.join(","),
                    MinPrice: MinPrice,
                    MaxPrice: MaxPrice,
                    Rating: Rating,
                    OrderByColumnName: OrderByColumnName,
                    PageNo: PageNo,
                    PageSize: PageSize,
                    recordValueJson: "[]",
                },
            };

            setshowPagination(false);


            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_All_PRODUCTS'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {

                await setProductsList(JSON.parse(response.data.data));
                let AllProducts = JSON.parse(response.data.data);
                await setTotalRecords(parseInt(AllProducts[0]?.TotalRecords ?? 0))
                console.log(JSON.parse(response.data.data));

                if (AllProducts.length > 0) {
                    await setshowPagination(true);
                }

            }


            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["AllProducts"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getAllProducts().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])
    //--noor code ends here

    return (
        <>
            <Helmet>
                <title>{siteTitle} - All Products</title>
                <meta name="description" content={siteTitle + " - All Products"} />
                <meta name="keywords" content="All Products"></meta>
            </Helmet>
            <SiteBreadcrumb title="Products" parent="Home" />
            <section className="section-big-pt-space section-big-pb-space ratio_asos bg-light">
                <div className="collection-wrapper">
                    <div className="custom-container">
                        <Row>
                            <Col
                                sm="3"
                                style={{
                                    left: leftSidebarOpen ? "-15px" : "",
                                }}
                                id="filter"
                                className="collection-filter category-page-side">
                                <div className="sticky-sidebar">
                                    <SiteLeftSidebarFilter
                                        setFilterValueInParent={setFilterValueInParent}
                                        setLeftSidebarOpenCloseFromFilter={setLeftSidebarOpenCloseFromFilter}
                                    />

                                    {/* <div className="collection-sidebar-banner">
                                        <a href="#">
                                            <img src={sideBannerImg} className="img-fluid " alt="" />
                                        </a>
                                    </div> */}
                                </div>
                            </Col>

                            {/* <Collection cols="col-xl-3 col-md-4 col-6 col-grid-box" layoutList="" /> */}
                            <Col className="collection-content">
                                <div className="page-main-content">
                                    <Row>
                                        <Col sm="12">

                                            <div className="collection-product-wrapper">

                                                <div className="product-top-filter">
                                                    <ProductsFilterOptions
                                                        setPageSizeFromProductFilter={setPageSizeFromProductFilter}
                                                        setLeftSidebarOpenCloseFromFilter={setLeftSidebarOpenCloseFromFilter}
                                                        setSortByFilter={setSortByFilter}
                                                        setLayout={setLayout}
                                                        setGrid={setGrid}
                                                        cols={cols}
                                                        layout={layout}
                                                        PageNo={PageNo}
                                                        PageSize={PageSize}
                                                        TotalRecords={ProductsList != undefined && ProductsList.length > 0 && ProductsList[0].TotalRecords != undefined && ProductsList[0].TotalRecords != 0 ? ProductsList[0].TotalRecords : 0}
                                                    />
                                                </div>

                                                {/* Product Grid */}
                                                <div className={`product-wrapper-grid ${layout}`}>
                                                    <Row>
                                                        {/* Product Box */}
                                                        {!ProductsList || ProductsList.length === 0 ? (
                                                            <Col xs="12">
                                                                <div>
                                                                    <div className="col-sm-12 empty-cart-cls text-center">
                                                                        <img src={emptySearch} className="img-fluid mb-4" alt="" />
                                                                        <h3>
                                                                            <strong>Your Cart is Empty</strong>
                                                                        </h3>
                                                                        <h4>Explore more shortlist some items.</h4>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        ) : (
                                                            ProductsList &&
                                                            ProductsList?.map((itm, i) => (
                                                                <div className={grid} key={i}>
                                                                    <div className="product">
                                                                        <div>

                                                                            <ProductBox
                                                                                hoverEffect={""}
                                                                                item={itm}
                                                                                layout={layout}
                                                                                ProductDetailPageForceUpload={false}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </Row>
                                                </div>
                                                {/* Pagination */}
                                                <div className="product-pagination loadmore-pagination">
                                                    <div className="theme-paggination-block">


                                                        <Row>
                                                            <Col xl="12" md="12" sm="12">
                                                                {
                                                                    showPagination == true ?
                                                                        <SitePagination
                                                                            TotalRecords={TotalRecords}
                                                                            CurrentPage={PageNo}
                                                                            PageSize={PageSize}
                                                                            setCurrentPage={setCurrentPage}
                                                                        />

                                                                        :
                                                                        <>
                                                                        </>
                                                                }

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </section>



        </>
    );
};

export default AllProducts;
