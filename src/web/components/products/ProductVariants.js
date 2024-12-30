import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import { GetDefaultCurrencySymbol } from '../../../helpers/CommonHelper';
import { Modal, ModalBody, Button } from "reactstrap";
import Config from '../../../helpers/Config';


const ProductVariants = (props) => {

    const [ProductId, setProductId] = useState(props.ProductId);




    useEffect(() => {
        // declare the data fetching function
        const getProductAllAttributesById = async () => {

            const headersProdAttribte = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }


            const paramProdAttribute = {
                requestParameters: {
                    ProductId: ProductId,
                    recordValueJson: "[]",
                },
            };


            //--Get product all attributes by product id
            const responseProdAttributes = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_PRODUCT_ALL_ATTRIBUTES_BY_ID'], null, paramProdAttribute, headersProdAttribte, "POST", true);
            if (responseProdAttributes != null && responseProdAttributes.data != null) {

                //await setProductAllAttributes(JSON.parse(responseProdAttributes.data.data).filter(x=>x.AttributeDisplayName!="Colors" && x.AttributeDisplayName!="Size"));
                await props.setProductAllAttributes(JSON.parse(responseProdAttributes.data.data));
            }


        }


        // call the function
        getProductAllAttributesById().catch(console.error);


    }, [])


    return (
        <>



            <Modal isOpen={props.showProductVariantsPopup} toggle={props.closeProductVariantPopup} centered={true} size="lg" className="theme-modal" id="exampleModal" role="dialog" aria-hidden="true">
                <ModalBody className="modal-content">
                    <Button className="close" data-dismiss="modal" aria-label="Close"
                        onClick={(e) => {
                            e.preventDefault();
                            props.closeProductVariantPopup();
                        }}
                    >
                        <span aria-hidden="true">×</span>
                    </Button>
                    <div className="news-latter">
                        <div className="modal-bg">
                            <div className="offer-content">
                                <div>
                                    <h2 style={{ marginBottom: "23px" }}>Product Variants!</h2>


                                    <ul className="list-group">




                                        {(() => {
                                            let attributeNames = props.productAllAttributes.map(({ ProductAttributeID, AttributeDisplayName }) => ({ ProductAttributeID, AttributeDisplayName }));
                                            attributeNames = attributeNames?.filter(x => x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Color'] && x.ProductAttributeID != Config.PRODUCT_ATTRIBUTE_ENUM['Size']);
                                            let uniqueAttributeNames = [...new Map(attributeNames.map((item) => [item["ProductAttributeID"], item])).values(),];
                                            return (
                                                uniqueAttributeNames?.map((atrItem, atrIdx) =>

                                                    <li className="list-group-item">

                                                        <h3 className="product-variant-title">{atrItem.AttributeDisplayName}</h3>

                                                        {(() => {
                                                            let RowData = props.productAllAttributes?.filter(x => x.ProductAttributeID == atrItem.ProductAttributeID)
                                                            return (
                                                                RowData?.map((rowItem, rowIdx) =>
                                                                    <div className="form-check form-check-inline">
                                                                        <input type="radio"
                                                                            className="form-check-input"
                                                                            name={rowItem.ProductAttributeID + rowItem.AttributeDisplayName}
                                                                            id={rowItem.ProductAttributeID + rowItem.AttributeDisplayName + rowItem.PrimaryKeyValue}
                                                                            value={rowItem.PrimaryKeyValue}
                                                                            onChange={(e) => props.setProductVariantsFromPopup(e.target.value, rowItem.ProductAttributeID)}
                                                                        />
                                                                        <label className="form-check-label" for={rowItem.ProductAttributeID + rowItem.AttributeDisplayName + rowItem.PrimaryKeyValue}>
                                                                            {rowItem.AdditionalPrice != undefined && rowItem.AdditionalPrice > 0 ?
                                                                                rowItem.PrimaryKeyDisplayValue + '\xa0\xa0' + " ( +" + GetDefaultCurrencySymbol() + rowItem.AdditionalPrice + ")"
                                                                                :
                                                                                rowItem.PrimaryKeyDisplayValue
                                                                            }

                                                                        </label>


                                                                    </div>
                                                                )
                                                            );
                                                        })()}


                                                    </li>
                                                )

                                            );


                                        })()}





                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>




        </>
    );
}

export default ProductVariants;