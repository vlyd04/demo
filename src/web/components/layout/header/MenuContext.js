import React, { createContext, useState } from "react";

export const Context = createContext({});
export const Provider = (props) => {
  const [leftMenu, setLeftMenu] = useState(false);
  const [menuResponsive, setMenuResponsive] = useState(false);

  const menuContext = {
    leftMenu,
    setLeftMenu,
    menuResponsive,
    setMenuResponsive,
  };

  return (
    <Context.Provider value={menuContext}>
      {props.children}
    </Context.Provider>
  );
};

export const { Consumer } = Context;

export { Context as MenuContext, Provider as MenuContextProvider } from "./MenuContext";
