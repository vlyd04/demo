import React, { useEffect, useState } from 'react';
import SiteBreadcrumb from '../../components/layout/SiteBreadcrumb';
import { Helmet } from 'react-helmet';
import Config from '../../../helpers/Config';
import { getLanguageCodeFromSession, GetLocalizationControlsJsonDataForScreen, replaceLoclizationLabel } from '../../../helpers/CommonHelper';
import GlobalEnums from '../../../helpers/GlobalEnums';
import { Collapse, Card, CardHeader, Container, Row, Col } from "reactstrap";


const faqData = [
    {
      qus: "What Shipping Methods are Available?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
    {
      qus: " What are shipping times and costs?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
    {
      qus: "What payment methods can I use?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
    {
      qus: "What Shipping Methods are Available?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
    {
      qus: "What payment methods can I use?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
    {
      qus: "What are shipping times and costs?",
      ans: "it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years,All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures",
    },
  ];


const FaqPage = () => {
    const [siteTitle, setSiteTitle] = useState(Config['SITE_TTILE']);
    const [LocalizationLabelsArray, setLocalizationLabelsArray] = useState([]);
    const [langCode, setLangCode] = useState('');
    const [id, setId] = useState(0);

    useEffect(() => {
        // declare the data fetching function
        const dataOperationFunc = async () => {
            let lnCode = getLanguageCodeFromSession();
            setLangCode(lnCode);

            //-- Get website localization data
            let arryRespLocalization = await GetLocalizationControlsJsonDataForScreen(GlobalEnums.Entities["FaqPage"], null);
            if (arryRespLocalization != null && arryRespLocalization != undefined && arryRespLocalization.length > 0) {
                await setLocalizationLabelsArray(arryRespLocalization);
            }
        }
        // call the function
        dataOperationFunc().catch(console.error);
    }, [])



    return (
        <>
            <Helmet>
                <title>{siteTitle} - Frequently Asked Questions (FAQ)</title>
                <meta name="description" content={siteTitle + " - Frequently Asked Questions (FAQ)"} />
                <meta name="keywords" content="Frequently Asked Questions, FAQ"></meta>
            </Helmet>

            <SiteBreadcrumb 
            title= {LocalizationLabelsArray.length > 0 ?
                replaceLoclizationLabel(LocalizationLabelsArray, "FAQ", "lbl_faq_pagetitle")
                :
                "FAQ"
            }
            
            parent="Home" />

            <section className="faq-section section-big-py-space bg-light">
                <Container>
                    <Row>
                        <Col sm="12">
                            <div className="accordion theme-accordion" id="accordionExample">
                                {faqData.map((faq, i) => (
                                    <Card key={i}>
                                        <CardHeader id="headingOne">
                                            <h5 className={`mb-0 ${id === i ? "show" : ""}`}>
                                                <button
                                                    className="btn btn-link"
                                                    type="button"
                                                    data-toggle="collapse"
                                                    onClick={() => {
                                                        id === i ? setId(null) : setId(i);
                                                    }}
                                                    data-target="#collapseOne"
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne">
                                                    {faq.qus}
                                                </button>
                                            </h5>
                                        </CardHeader>
                                        <Collapse isOpen={id === i} id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div className="card-body">
                                                <p>{faq.ans}</p>
                                            </div>
                                        </Collapse>
                                    </Card>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


        </>
    );

}

export default FaqPage;
