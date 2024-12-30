import React, { useEffect, useState } from 'react';


const ProductRatingStars = (props) => {
    const [rating, setRating] = useState(props.Rating);


    return (
        <>



            {(() => {

                switch (parseInt(rating)) {

                    case 5:
                        return (
                            <ul className="custom-rating">
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                            </ul>
                        );
                    case 4:
                        return (

                            <ul className="custom-rating">
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                            </ul>
                        );
                    case 3:
                        return (

                            <ul className="custom-rating">
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                            </ul>
                        );

                    case 2:
                        return (
                            <ul className="custom-rating">
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                                <i className="fa fa-star custom-grey-star"></i>
                            </ul>
                        );
                    default:
                        return (//--return 5 as default
                            <ul className="custom-rating">
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                                <i className="fa fa-star custom-yellow-star"></i>
                            </ul>
                        );
                }
            })()}

        </>
    );
}

export default ProductRatingStars;