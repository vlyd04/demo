import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Media, Input, Button, Table } from "reactstrap";

import SiteBreadcrumb from "../../components/layout/SiteBreadcrumb";
import { Helmet } from "react-helmet";
import Config from "../../../helpers/Config";
import { makeProductShortDescription, replaceWhiteSpacesWithDashSymbolInUrl } from "../../../helpers/ConversionHelper";
import { useDispatch, useSelector } from "react-redux";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import rootAction from "../../../stateManagment/actions/rootAction";
import { LOADER_DURATION } from "../../../helpers/Constants";
import { GetDefaultCurrencySymbol, getLanguageCodeFromSession } from "../../../helpers/CommonHelper";

const CompareList = () => {
  const dispatch = useDispatch();
  const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
  const [compareItems, setCompareItems] = useState([]);
  const compareItemsRedux = useSelector(state => state.cartReducer.customerCompareList);
  const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);


  const removeItemFromCompare = (ProductId) => {

    const updatedList = compareItems.filter(p => p.ProductId !== ProductId);

    // Update the productList state
    setCompareItems(updatedList);

    if (updatedList != undefined) {
      let customerCompareLocal = [];
      updatedList.forEach((product) => {
        customerCompareLocal.push({
          ProductId: ProductId
        }
        );
      });

      dispatch(rootAction.cartAction.setCustomerCompareList(customerCompareLocal));
    }



  }


  useEffect(() => {
    // declare the data fetching function
    const dataOperationInUseEffect = async () => {


      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',

      }

      
      let ProductsIds = [];
      if (compareItemsRedux != undefined && compareItemsRedux != null && compareItemsRedux.length > 0) {
        for (let i = 0; i < compareItemsRedux.length; i++) {
          ProductsIds.push({
            ProductId: compareItemsRedux[i].ProductId ?? 0
          });
        }
      }


      const paramCountry = {
        requestParameters: {
          ProductsIds: JSON.stringify(ProductsIds),
          recordValueJson: "[]",
        },
      };


      //--Get products list agains a customer cart
      const responseProducts = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PRODUCTS_LIST_BY_IDS'], null, paramCountry, headers, "POST", true);
      if (responseProducts != null && responseProducts.data != null) {
        let finalData = JSON.parse(responseProducts.data.data);
        await setCompareItems(JSON.parse(responseProducts.data.data));

      }


    }

    //--start loader
    dispatch(rootAction.commonAction.setLoading(true));

    // call the function
    dataOperationInUseEffect().catch(console.error);

    //--stop loader
    setTimeout(() => {
      dispatch(rootAction.commonAction.setLoading(false));
    }, LOADER_DURATION);


    //--scroll page top top becuase the product detail page giving issue
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 500);


  }, [])




  return (
    <>
      <Helmet>
        <title>{siteTitle} - Compare</title>
        <meta name="description" content={siteTitle + " - Compare"} />
        <meta name="keywords" content="Compare"></meta>
      </Helmet>

      <SiteBreadcrumb title="Compare" parent="Home" />

      {/* // <!-- section start --> */}

      <section className="compare-padding section-big-py-space bg-light">
        <div className="custom-container">
          <Row>
            <Col sm="12">
              {compareItems && compareItems.length >= 0 ? (
                <div className="compare-page">
                  <div className="table-wrapper table-responsive">
                    <Table>
                      <thead>
                        <tr className="th-compare">
                          <td>Action</td>
                          {compareItems.map((item, i) => (
                            <td className="item-row" key={i}>
                              <Button type="button" className="remove-compare"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeItemFromCompare(item.ProductId)
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </thead>
                      <tbody id="table-compare">
                        <tr>
                          <th className="product-name">Product Name</th>
                          {compareItems.map((item, i) => (
                            <td className="item-row" key={i}>
                              {makeProductShortDescription(item.ProductName, 45)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th className="product-name">Product Image</th>
                          {compareItems.map((item, i) => (
                            <td className="item-row" key={i}>
                              <Media src={adminPanelBaseURL + item.ProductImagesJson[0].AttachmentURL} alt="product" className="featured-image" />
                              <div className="product-price product_price">
                                <strong>On Sale: </strong>
                                <span>{GetDefaultCurrencySymbol()}{item.Price}</span>
                              </div>
                              <form className="variants clearfix">
                                <Input type="hidden" />
                                <Link to={`/${getLanguageCodeFromSession()}/product-detail/${item.ProductId}/${replaceWhiteSpacesWithDashSymbolInUrl(item.CategoryName) ?? "shop"}/${replaceWhiteSpacesWithDashSymbolInUrl(item.ProductName)}`}
                                  title="Add to Cart"
                                  className="add-to-cart btn btn-normal"
                                >
                                  View Detail
                                </Link>
                              </form>

                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th className="product-name">Product Description</th>
                          {compareItems.map((item, i) => (
                            <td className="item-row" key={i}>
                              <p className="description-compare">{makeProductShortDescription(item.ProductName, 155)}</p>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <th className="product-name">Availability</th>
                          {compareItems.map((item, i) => (
                            <td className="available-stock" key={i}>
                              <p>Available in Stock</p>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="col-sm-12">
                  <div>
                    <div className="col-sm-12 empty-cart-cls text-center">
                      <img src={`static/images/icon-empty-cart.png`} className="img-fluid mb-4" alt="" />
                      <h3>
                        <strong>Your Cart is Empty</strong>
                      </h3>
                      <h4>Explore more shortlist some items.</h4>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </section>


      {/* <!-- Section ends --> */}
    </>
  );
};

export default CompareList;
