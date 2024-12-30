import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MakeApiCallSynchronous, MakeApiCallAsync } from '../../../helpers/ApiHelpers';
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import Config from '../../../helpers/Config';


const SizeGuide = (props) => {

    const [SizeList, setSizeList] = useState([]);


    useEffect(() => {
        // declare the data fetching function
        const getSizeList = async () => {


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

            //--Get sizes list
            const sizeResponse = await MakeApiCallAsync(Config.END_POINT_NAMES['GET_SIZE_LIST'], null, param, headers, "POST", true);
            if (sizeResponse != null && sizeResponse.data != null) {
                setSizeList(JSON.parse(sizeResponse.data.data));

                console.log(JSON.parse(sizeResponse.data.data));
            }



        }

        // call the function
        getSizeList().catch(console.error);
    }, [])


    return (
        <>
        
            <Modal isOpen={props.SizeGuide} centered={true} toggle={props.closeSizeGuide}>
                <ModalHeader>
                    Size Guide <i className="fa fa-close modal-close" onClick={props.closeSizeGuide}></i>
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Short Name</th>
                                        <th>Inches</th>
                                        <th>Centimeters</th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        SizeList?.map((item, idx) =>

                                            <tr>
                                                <td>{item.Name}</td>
                                                <td>{item.ShortName}</td>
                                                <td>{item.Inches}</td>
                                                <td>{item.Centimeters}</td>

                                            </tr>
                                        )}





                                </tbody>
                            </table>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default SizeGuide;