import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Label, Input, Form, FormGroup } from "reactstrap";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../../helpers/CommonHelper';
import GlobalEnums from '../../../../helpers/GlobalEnums';
import rootAction from '../../../../stateManagment/actions/rootAction';
import { LOADER_DURATION } from '../../../../helpers/Constants';

const MenuUserSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openAccount, setOpenAccount] = useState(false);
  const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
  const [langCode, setLangCode] = useState('');

  const loginUserDataJson = useSelector(state => state.userReducer.user);
  const loginUser = JSON.parse(loginUserDataJson ?? "{}");

  const handleUpdateProfileUrl = (e) => {
    e.preventDefault();
    setOpenAccount(false);
    navigate('/' + getLanguageCodeFromSession() + '/update-profile');
  }

  const handleOrderHistoryUrl = (e) => {
    e.preventDefault();
    setOpenAccount(false);
    navigate('/' + getLanguageCodeFromSession() + '/orders-history');
  }

  const HandleLogout = (e) => {

    localStorage.setItem("user", JSON.stringify('{}'));
    dispatch(rootAction.userAction.setUser('{}'));
    setOpenAccount(false);
    navigate('/', { replace: true });
}

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
      <li className="mobile-user onhover-dropdown" onClick={() => setOpenAccount(!openAccount)}>
        <a href="#">
          <i className="icon-user"></i>
        </a>
      </li>

      <div id="myAccount" className={`add_to_cart right account-bar ${openAccount ? "open-side" : ""}`}>
        <a href="#" className="overlay" onClick={() => setOpenAccount(!openAccount)}></a>
        <div className="cart-inner">
          <>
            <div className="cart_top">
              <h3>my account</h3>
              <div className="close-cart">
                <a href="#" onClick={() => setOpenAccount(!openAccount)}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </div>
           
            <Form className="userForm">

              <FormGroup>
                {loginUser != null && loginUser != undefined && loginUser.UserID != undefined && loginUser.UserID > 0 ? (

                  <>
                    <div className="title_login">
                      <Link to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateProfileUrl(e);
                        }}
                        id="lbl_loginmodal_profile"
                      >
                        {LocalizationLabelsArray.length > 0 ?
                          replaceLoclizationLabel(LocalizationLabelsArray, "Update Profile", "lbl_loginmodal_profile")
                          :
                          "Update Profile"
                        }
                      </Link>

                    </div>
                    <div className="title_login">
                      <Link to="#" className="return-store"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOrderHistoryUrl(e);
                        }}
                        id="lbl_loginmodal_orderhistory"
                      >
                        {LocalizationLabelsArray.length > 0 ?
                          replaceLoclizationLabel(LocalizationLabelsArray, "Order History", "lbl_loginmodal_orderhistory")
                          :
                          "Order History"
                        }
                      </Link>
                    </div>



                    <Link to="#" className="btn btn-rounded btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        HandleLogout(e);
                      }}
                      id="lbl_mgmenu_logout"
                    >
                      {LocalizationLabelsArray.length > 0 ?
                        replaceLoclizationLabel(LocalizationLabelsArray, "Logout", "lbl_mgmenu_logout")
                        :
                        "Logout"
                      }

                    </Link>

                  </>


                ) : (


                  <Link to={`/${getLanguageCodeFromSession()}/login`} id="lbl_mgmenu_login" className="btn btn-rounded btn-block"
                  onClick={(e) => {
                    setOpenAccount(false);
                  }}
                  >
                    {LocalizationLabelsArray.length > 0 ?
                      replaceLoclizationLabel(LocalizationLabelsArray, "Login", "lbl_mgmenu_login")
                      :
                      "Login"
                    }
                  </Link>

                )}
              </FormGroup>

            </Form>
          </>
        </div>
      </div>
    </>
  );
};

export default MenuUserSection;
