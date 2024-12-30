import React, { useState } from "react";
import { Media } from "reactstrap";



const giftData = [
  {
    img1: "/images/icon/1.png",
    img2: "/images/icon/currency.png",
    title: "Billion Days",
    desc: "Flat Rs. 270 Rewards",
  },
  {
    img1: "/images/icon/2.png",
    img2: "/images/icon/fire.png",
    title: "Fashion Discount",
    desc: "Extra 10% off (upto Rs. 10,000*)",
  },
  {
    img1: "/images/icon/3.png",
    img2: "",
    title: "75% off Store",
    desc: "No coupon code is required.",
  },
  {
    img1: "/images/icon/6.png",
    img2: "",
    title: "Upto 50% off",
    desc: "Buy popular phones under Rs.20.",
  },
  {
    img1: "/images/icon/5.png",
    img2: "/images/icon/currency.png",
    title: "Beauty store",
    desc: "Flat Rs. 270 Rewards",
  },
];

const GiftList = (props) => {
  return (
    <div className="media">
      <div className="me-3">
        <Media src={props.gift.img1} alt="Generic placeholder image" />
      </div>
      <div className="media-body">
        <h5 className="mt-0">{props.gift.title}</h5>
        <div>
          <Media src={props.gift.img2} className="cash" alt="curancy" />
          {props.gift.desc}
        </div>
      </div>
    </div>
  );
};

const MenuGift = () => {
  const [showState, setShowState] = useState(false);
  return (
    <div className={`d-lg-inline-block d-none btn-group ${showState ? "show" : ""}`}>
      <div className="gift-block" data-toggle="dropdown" onClick={() => setShowState(!showState)}>
        <div className="grif-icon">
          <i className="icon-gift"></i>
        </div>
        <div className="gift-offer">
          <p>gift box</p>
          <span className="d-xl-inline-block d-none">Festivel Offer</span>
        </div>
      </div>
      <div className={`dropdown-menu gift-dropdown ${showState ? "show" : ""}`}>
        {giftData.map((data, i) => (
          <GiftList gift={data} key={i} />
        ))}
      </div>
    </div>
  );
};

export default MenuGift;
