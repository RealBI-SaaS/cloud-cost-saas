import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState("sub1");
  const navigate = useNavigate();

  const selectMenu = (key, url) => {
    setSelectedMenu(key);
    navigate(url); // Navigate when menu is selected
  };

  return (
    <MenuContext.Provider value={{ selectedMenu, selectMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
