//import React, { useState } from "react";
import React from "react";
//import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useOrg } from "../context/OrganizationContext";
import HomeOrgMenu from "./menu/HomeOrgMenu";
import { useState } from "react";
import PowerBIEmbed from "./powerbi/PowerBIEmbed";
const HomeAuthenticated = () => {
  const { user } = useUser();
  const { currentOrg } = useOrg();
  //const navigate = useNavigate();
  //const [value, setValue] = useState([50]);
  //
  const [selectedItem, setSelectedItem] = useState("Welcome");

  // Function to update the clicked label
  const handleItemClick = (label) => {
    setSelectedItem(label); // Update selected label
  };

  return (
    <div className=" flex grid grid-cols-1 justify-around items-center border w-full h-full  ">
      {/*<HomeOrgMenu onItemClick={handleItemClick} />*/}
      {/* Pass the click handler */}

      <PowerBIEmbed />
    </div>
  );
};

export default HomeAuthenticated;
