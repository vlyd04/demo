import React, { Component, useContext, useEffect } from 'react';
import MegaMenu from './MegaMenu';
import SearchHeader from './SearchHeader';
import TopHeader from './TopHeader';






const Navbar = () => {
 
    const handleScroll = () => {
      let number = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (number >= 300) {
        if (window.innerWidth < 581) document.getElementById("stickyHeader").classList.remove("sticky");
        else document.getElementById("stickyHeader").classList.add("sticky");
      } else document.getElementById("stickyHeader").classList.remove("sticky");
    };
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
        <>


          

            <header id="stickyHeader">
                <div className="mobile-fix-option"></div>
                <TopHeader />
                <div className="layout-header2">
                <SearchHeader />
                  
                </div>
                <div className="category-header-2">
                <MegaMenu/>
                </div>
            </header>


        </>
    );

}


export default Navbar;
