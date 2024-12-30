import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import { getLanguageCodeFromSession } from "../../../../helpers/CommonHelper";
import { replaceWhiteSpacesWithDashSymbolInUrl } from "../../../../helpers/ConversionHelper";
import { showInfoMsg } from "../../../../helpers/ValidationHelper";


const MobileSearch = () => {
  const [searchCategory, setSearchCategory] = useState(0);
  const [categoryText, setCategoryText] = useState("All Category");
  const [SearchTerm, setSearchTerm] = useState("");

  const submitSearchForm = (event) => {
    event.preventDefault();
    
    let categ = searchCategory ?? 0;
    if (SearchTerm != null && SearchTerm != undefined && SearchTerm.length > 1) {

        let url = "/";
        if(categoryText != undefined && categoryText != "All Category"){
            url = "/" + getLanguageCodeFromSession() + "/all-products/" + categ + "/"+replaceWhiteSpacesWithDashSymbolInUrl(categoryText)+"?SearchTerm=" + SearchTerm;
        }else{
            url = "/" + getLanguageCodeFromSession() + "/all-products/" + categ + "/all-categories?SearchTerm=" + SearchTerm;
        }
        
        document.getElementById("search-overlay").style.display = "none";
        window.location.href = url;

        // navigate(url, { replace: true });
        // window.location.reload();
    } else {
        showInfoMsg('Enter something then search');
    }
}



  useEffect(() => {
    
   // document.getElementById("search-overlay").style.display = "none";
  });
  const closeSearch = () => {
    
    document.getElementById("search-overlay").style.display = "none";
  };

  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "flex";
  };
  return (
    <>
      <li className="onhover-div mobile-search">
        <i className="icon-search" onClick={openSearch}></i>
      </li>
      <div id="search-overlay" className="search-overlay" style={{display:"none"}}>
        <div>
          <span className="close-mobile-search" onClick={closeSearch} title="Close Overlay">
            ×
          </span>
          <div className="overlay-content">
            <Container>
              <Row>
                <Col xl="12">
                  <Form onSubmit={submitSearchForm}>
                    <FormGroup>
                      <Input type="text" className="form-control" id="exampleInputPassword1" placeholder="Search a Product" 
                       value={SearchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </FormGroup>
                    <Button type="submit" className="btn btn-primary" onClick={(e) => submitSearchForm(e)}>
                      <i className="fa fa-search"></i>
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSearch;
