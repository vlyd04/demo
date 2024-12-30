import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Input, Label, Row, Col, Form, FormGroup } from "reactstrap";
import Config from "../../../helpers/Config";
import SiteBreadcrumb from "../../components/layout/SiteBreadcrumb";
import BestFacilities from '../../components/shared/BestFacilities';
import { LOADER_DURATION } from '../../../helpers/Constants';
import { showErrorMsg, showSuccessMsg, validateAnyFormField } from '../../../helpers/ValidationHelper';
import { MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import rootAction from '../../../stateManagment/actions/rootAction';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';




const BecomeVendor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [EmailAddress, setEmailAddress] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [MobileNo, setMobileNo] = useState('');
    const [AddressLineOne, setAddressLineOne] = useState('');
    const [StateProvinceId, setStateProvinceId] = useState('');
    const [CityId, setCityId] = useState('');
    const [PostalCode, setPostalCode] = useState('');
    const [CountryID, setCountryID] = useState('');
    const [CountriesList, setCountriesList] = useState([]);
    const [StatesProvincesList, setStatesProvincesList] = useState([]);
    const [CitiesList, setCitiesList] = useState([]);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);

    const HandleStateProvinceChagne = async (value) => {
        if (value != undefined) {
            await setStateProvinceId(value);

            //--load city data when state changed
            await LoadCitiesData(value);
        }

    }

    const HandleCountryChange = async (value) => {
        if (value != undefined) {
            await setCountryID(value);

            //--load state province data
            await LoadStateProvinceData(value);
        }

    }

    const LoadCitiesData = async (StateValue) => {
        const headersCity = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }


        const paramCity = {
            requestParameters: {
                StateProvinceId: StateValue ?? StateProvinceId,
                recordValueJson: "[]",
            },
        };

        //--Get cities list
        const responseCities = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_CITIES_LIST'], null, paramCity, headersCity, "POST", true);
        if (responseCities != null && responseCities.data != null) {
            await setCitiesList(JSON.parse(responseCities.data.data));

        }
    }

    const LoadStateProvinceData = async (CountryValue) => {
        const headersStateProvince = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }


        const paramStateProvince = {
            requestParameters: {
                CountryId: CountryValue ?? CountryID,
                recordValueJson: "[]",
            },
        };

        //--Get state province list
        const responseStatesProvince = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_STATES_PROVINCES_LIST'], null, paramStateProvince, headersStateProvince, "POST", true);
        if (responseStatesProvince != null && responseStatesProvince.data != null) {
            await setStatesProvincesList(JSON.parse(responseStatesProvince.data.data));

        }
    }
    const handleSellerSignupForm = async (event) => {
        event.preventDefault();

        try {


            let isValid = false;
            let validationArray = [];


            isValid = validateAnyFormField('First Name', FirstName, 'text', null, 200, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }


            isValid = validateAnyFormField('Last Name', LastName, 'text', null, 150, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            isValid = validateAnyFormField('Email', EmailAddress, 'email', null, 150, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            isValid = validateAnyFormField('Password', Password, 'password', null, 150, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            isValid = validateAnyFormField('Confirm Password', ConfirmPassword, 'password', null, 150, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            isValid = validateAnyFormField('Country', CountryID, 'text', null, 150, true);
            if (isValid == false) {
                validationArray.push({
                    isValid: isValid
                });
            }

            isValid = validateAnyFormField('Home address', AddressLineOne, 'text', null, 600, true);
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

            //--check if password equals
            if (Password != ConfirmPassword) {
                showErrorMsg("Password does not match!");
                isValid = false;
            }

            let pasdf = await makePassEnc(Password);

            if (isValid) {





                const headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }

                const param = {
                    requestParameters: {
                        FirstName: FirstName,
                        LastName: LastName,
                        EmailAddress: EmailAddress,
                        Password: pasdf,
                        MobileNo: MobileNo,
                        AddressLineOne: AddressLineOne,
                        CityId: CityId ?? -999,
                        StateProvinceId: StateProvinceId ?? -999,
                        PostalCode: PostalCode,
                        CountryID: CountryID ?? -999,
                    },
                };




                //--make api call for data operation
                const response = await MakeApiCallAsync(Config.END_POINT_NAMES['CREATE_VENDOR_REQUEST'], null, param, headers, "POST", true);
                if (response != null && response.data != null) {
                    let userData = JSON.parse(response.data.data);
                    if (userData.length > 0 && userData[0].ResponseMsg != undefined && userData[0].ResponseMsg == "Saved Successfully") {
                        showSuccessMsg("Your request for seller created successfully!");

                        navigate('/' + getLanguageCodeFromSession() + '/');


                    } else if (userData.length > 0 && userData[0].ResponseMsg != undefined && userData[0].ResponseMsg == "Email already exists!") {
                        showErrorMsg("Email already exists!");
                        return false;
                    } else {
                        showErrorMsg("An error occured. Please try again!");
                        return false;
                    }
                }
            }



        } catch (err) {
            console.log(err);
            showErrorMsg("An error occured. Please try again!");

            return false;

        } finally {
            //--stop loader
            setTimeout(() => {
                dispatch(rootAction.commonAction.setLoading(false));
            }, LOADER_DURATION);

        }
    }

    const makePassEnc = async (ps) => {

        let pasRet = ps;
        const headersEnc = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }

        const paramEnc = {
            requestParameters: {
                Password: Password
            },
        };


        const responseEnc = await MakeApiCallAsync(Config.END_POINT_NAMES['EN_UR_DROW_PASS_RNDOM'], Config['COMMON_CONTROLLER_SUB_URL'], paramEnc, headersEnc, "POST", true);


        if (responseEnc != null && responseEnc.data != null) {
            let encData = JSON.parse(responseEnc.data.data);
            pasRet = encData?.Password;
        }

        return pasRet;
    }

    useEffect(() => {
        // declare the data fetching function
        const dataOperationInUseEffect = async () => {

            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const paramCountry = {
                requestParameters: {

                    recordValueJson: "[]",
                },
            };


            //--Get countreis list
            const responseCountries = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_COUNTRIES_LIST'], null, paramCountry, headers, "POST", true);
            if (responseCountries != null && responseCountries.data != null) {
                await setCountriesList(JSON.parse(responseCountries.data.data));

            }

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["BecomeVendor"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
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


    }, [])

    return (
        <>

            <Helmet>
                <title>{siteTitle} - Become Seller</title>
                <meta name="description" content={siteTitle + " - Become Seller"} />
                <meta name="keywords" content="Become Seller"></meta>
            </Helmet>
            <SiteBreadcrumb title="Become Seller" parent="home" />
            {/* <!-- personal deatail section start --> */}
            <section className="login-page section-big-py-space bg-light">
                <div className="custom-container">


                    <Row className="row">
                        <Col xl="8" lg="8" md="8" className="offset-xl-2 offset-lg-2 offset-md-2">
                            <div className="theme-card">
                                {/* <h3 className="text-center">Login</h3> */}
                                <Form className="theme-form" onSubmit={handleSellerSignupForm}>
                                    <div className="form-row row">
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="FirstName">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "First Name", "lbl_becomeseller_fname")
                                                        :
                                                        "First Name"
                                                    }
                                                    <span className="required-field">*</span></Label>
                                                <Input type="text" className="form-control" placeholder="Enter first name" id="FirstName" name="FirstName"
                                                    required={true}
                                                    value={FirstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="LastName">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Last Name", "lbl_becomeseller_lname")
                                                        :
                                                        "Last Name"
                                                    }
                                                    <span className="required-field">*</span></Label>
                                                <Input type="text" className="form-control" placeholder="Enter last name" id="LastName" name="LastName"
                                                    required={true}
                                                    value={LastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="EmailAddress">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Email", "lbl_becomeseller_email")
                                                        :
                                                        "Email"
                                                    }
                                                    <span className="required-field">*</span></Label>
                                                <Input type="email" className="form-control" placeholder="Enter email" id="EmailAddress" name="EmailAddress"
                                                    required={true}
                                                    value={EmailAddress}
                                                    onChange={(e) => setEmailAddress(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="select_input">
                                            <FormGroup>
                                                <Label htmlFor="CountryID">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Country", "lbl_becomeseller_country")
                                                        :
                                                        "Country"
                                                    }
                                                    <span className="required-field">*</span></Label>
                                                <select
                                                    className="form-control"
                                                    name="CountryID"
                                                    id="CountryID"
                                                    required={true}
                                                    value={CountryID}
                                                    onChange={(e) => HandleCountryChange(e.target.value)}
                                                >
                                                    <option value="-999">Select Country</option>
                                                    {
                                                        CountriesList?.map((item, idx) =>

                                                            <option value={item.CountryID}>{item.CountryName}</option>

                                                        )}


                                                </select>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="StateProvinceId">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "State/Province", "lbl_becomeseller_province")
                                                        :
                                                        "State/Province"
                                                    }
                                                </Label>

                                                <select
                                                    className="form-control"
                                                    name="StateProvinceId"
                                                    id="StateProvinceId"
                                                    required={false}
                                                    value={StateProvinceId}
                                                    onChange={(e) => HandleStateProvinceChagne(e.target.value)}
                                                >
                                                    <option value="-999">Select State</option>
                                                    {
                                                        StatesProvincesList?.map((item, idx) =>

                                                            <option value={item.StateProvinceID}>{item.StateName}</option>

                                                        )}


                                                </select>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="CityId">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "City", "lbl_becomeseller_city")
                                                        :
                                                        "City"
                                                    }
                                                </Label>

                                                <select
                                                    className="form-control"
                                                    name="CityId"
                                                    id="CityId"
                                                    required={false}
                                                    value={CityId}
                                                    onChange={(e) => setCityId(e.target.value)}
                                                >
                                                    <option value="-999">Select City</option>
                                                    {
                                                        CitiesList?.map((item, idx) =>

                                                            <option value={item.CityID}>{item.CityName}</option>

                                                        )}


                                                </select>

                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="MobileNo">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Mobile No", "lbl_becomeseller_contact")
                                                        :
                                                        "Mobile No"
                                                    }
                                                </Label>
                                                <Input type="text" className="form-control" placeholder="Enter mobile no" id="MobileNo" name="MobileNo"
                                                    value={MobileNo}
                                                    onChange={(e) => setMobileNo(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="PostalCode">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Postal Code", "lbl_becomeseller_pcode")
                                                        :
                                                        "Postal Code"
                                                    }
                                                </Label>
                                                <Input type="number" className="form-control" placeholder="Enter postal code" id="PostalCode" name="PostalCode"
                                                    value={PostalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="Password">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Password", "lbl_becomeseller_password")
                                                        :
                                                        "Password"
                                                    }
                                                    <span className="required-field">*</span>
                                                </Label>
                                                <Input type="password" className="form-control" placeholder="Enter your password" id="Password" name="Password"
                                                    required={true}
                                                    value={Password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="ConfirmPassword">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Confirm Password", "lbl_becomeseller_confpassword")
                                                        :
                                                        "Confirm Password"
                                                    }
                                                    <span className="required-field">*</span>
                                                </Label>
                                                <Input type="password" className="form-control" placeholder="Confirm Password" id="ConfirmPassword" name="ConfirmPassword"
                                                    required={true}
                                                    value={ConfirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label htmlFor="AddressLineOne">
                                                    {LocalizationLabelsArray.length > 0 ?
                                                        replaceLoclizationLabel(LocalizationLabelsArray, "Home Address", "lbl_becomeseller_homeadr")
                                                        :
                                                        "Home Address"
                                                    }
                                                    <span className="required-field">*</span></Label>
                                                <Input type="text" className="form-control" placeholder="Enter home address" id="AddressLineOne" name="AddressLineOne"
                                                    required={true}
                                                    value={AddressLineOne}
                                                    onChange={(e) => setAddressLineOne(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md="12">
                                            <button className="btn btn-sm btn-normal mb-lg-5" type="submit">

                                                {LocalizationLabelsArray.length > 0 ?
                                                    replaceLoclizationLabel(LocalizationLabelsArray, "Save setting", "lbl_becomeseller_save")
                                                    :
                                                    "Save setting"
                                                }
                                            </button>
                                        </Col>
                                    </div>
                                </Form>


                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
            {/* <!-- Section ends --> */}

            <BestFacilities />
        </>
    );
};

export default BecomeVendor;
