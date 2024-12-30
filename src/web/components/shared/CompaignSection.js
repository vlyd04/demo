import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Media } from "reactstrap";
import { Link } from 'react-router-dom';
import Config from "../../../helpers/Config";
import { MakeApiCallAsync } from "../../../helpers/ApiHelpers";
import rootAction from "../../../stateManagment/actions/rootAction";
import { LOADER_DURATION } from "../../../helpers/Constants";
import { makeAnyStringLengthShort } from "../../../helpers/ConversionHelper";
import { getLanguageCodeFromSession } from "../../../helpers/CommonHelper";





const CompaignSection = () => {
    const dispatch = useDispatch();
    const [CampaignList, setCampaignList] = useState([]);
    const [adminPanelBaseURL, setBaseUrl] = useState(Config['ADMIN_BASE_URL']);

    useEffect(() => {
        // declare the data fetching function
        const getCampaignList = async () => {

             
            const headersCampaign = {
                // customerid: userData?.UserID,
                // customeremail: userData.EmailAddress,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                   
            }


            const paramCampaign = {
                requestParameters: {
                    recordValueJson: "[]",
                },
            };

            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_WEB_CAMPAIGN_LIST'], null, paramCampaign, headersCampaign, "POST", true);
            if (response != null && response.data != null) {
                await setCampaignList(JSON.parse(response.data.data));
                console.log(JSON.parse(response.data.data));
            }


        }

        //--start loader
        dispatch(rootAction.commonAction.setLoading(true));

        // call the function
        getCampaignList().catch(console.error);

        //--stop loader
        setTimeout(() => {
            dispatch(rootAction.commonAction.setLoading(false));
        }, LOADER_DURATION);

    }, [])


    return (
        <section className="collection-banner section-py-space">
            <div className="container-fluid">
                <Row className="collection2">
                    {CampaignList && CampaignList?.slice(0,3)?.map((item, i) => (
                      
                        <Col md="4" key={i}>
                            <div className="collection-banner-main banner-1 p-left">
                                <div className="collection-img">
                                    <Media src={adminPanelBaseURL + item.CoverPictureUrl} className="img-fluid bg-img " alt="banner" />
                                </div>
                                <div className="collection-banner-contain ">
                                    <div>
                                        <h3>{ makeAnyStringLengthShort(item.DiscountTitle, 25)}</h3>
                                        <h4>{ makeAnyStringLengthShort(item.MainTitle, 35)}</h4>
                                        <div className="shop">
                                            <Link
                                               to={`/${getLanguageCodeFromSession()}/campaign/${item.CampaignId}/${item.MainTitle}`}
                                               >
                                               View Detail
                                            </Link>

                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

export default CompaignSection;
