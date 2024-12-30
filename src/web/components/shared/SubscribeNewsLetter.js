import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import Config from '../../../helpers/Config';
import { showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { Input } from "reactstrap";

const SubscribeNewsLetter = () => {

    const [SubscriberEmail, setSubscriberEmail] = useState('');
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    const submitSubscribeForm = async (event) => {
        
        event.preventDefault();

        let isValid = false;
        let validationArray = [];

        //--validation for email
        isValid = validateAnyFormField('Email', SubscriberEmail, 'email', null, 200, true);
        if (isValid == false) {
            validationArray.push({
                isValid: isValid
            });
        }

        //--check if any field is not valid
        if (validationArray != null && validationArray.length > 0) {

            isValid = false;
            return false;
        } else {
            isValid = true;
        }

        if (isValid) {


            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const param = {
                requestParameters: {
                    SubscriberEmail: SubscriberEmail
                },
            };


            //--make api call for data operation
            const response = await MakeApiCallAsync(Config.END_POINT_NAMES['INSERT_SUBSCRIBER'], null, param, headers, "POST", true);
            if (response != null && response.data != null) {
                let detail = JSON.parse(response.data.data);
                if (detail[0].ResponseMsg == "Saved Successfully") {
                    showSuccessMsg("You have successfully subscribed to news channel!");

                    //--Empty form
                    setSubscriberEmail("");


                } else {
                    showErrorMsg("An error occured. Please try again later!");
                }
            }
        }

    }


    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["SubscribeNewsLetter"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])



    return (
        <>
            <div className="subscribe-section">
                <div className="row">
                    <div className="col-md-5 ">
                        <div className="subscribe-block">
                            <div className="subscrib-contant ">
                                <h4 id="lbl_subsc_ournewsltr">

                                    {LocalizationLabelsArray.length > 0 ?
                                        replaceLoclizationLabel(LocalizationLabelsArray, "Subscribe to newsletter", "lbl_subsc_ournewsltr")
                                        :
                                        "Subscribe to newsletter"
                                    }

                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 ">
                        <div className="subscribe-block">
                            <div className="subscrib-contant">
                                <form onSubmit={submitSubscribeForm} id="subscribe_form">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <i className="fa fa-envelope-o"></i>
                                            </span>
                                        </div>
                                        <Input
                                            type="email"
                                            className="form-control"
                                            placeholder="your email"
                                            name="EMAIL"
                                            required={true}
                                            autoComplete="off"
                                            value={SubscriberEmail}
                                            onChange={(e) => setSubscriberEmail(e.target.value)}
                                        />
                                        <div className="input-group-prepend">
                                            <button type="submit" className="subscribe-bnt input-group-text telly">
                                                <i className="fa fa-telegram"></i>
                                            </button>
                                            {/* <span className="input-group-text telly">
                                                <i className="fa fa-telegram"></i>
                                            </span> */}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}


export default SubscribeNewsLetter;
