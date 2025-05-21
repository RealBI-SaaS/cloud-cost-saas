//import React, { useState } from "react";

import React from "react";
//import { useNavigate } from "react-router-dom";
//import { useOrg } from "../context/OrganizationContext";
//import HomeOrgMenu from "./menu/HomeOrgMenu";
import { useState } from "react";
import PowerBIEmbed from "./powerbi/PowerBIEmbed";
import useUserStore from "@/context/userStore";
import { shallow } from "zustand/shallow";
import useOrgStore from "@/context/OrgStore";

const HomeAuthenticated = () => {
  const user = useUserStore((state) => state.user, shallow);
  // const { currentOrg } = useOrg();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  //const navigate = useNavigate();
  //const [value, setValue] = useState([50]);
  //
  const [selectedItem, setSelectedItem] = useState("Welcome");

  // Function to update the clicked label
  //const handleItemClick = (label) => {
  //  setSelectedItem(label); // Update selected label
  //};

  return (
    <div className=" flex grid grid-cols-1 justify-around items-center w-full h-full  ">
      {/*<HomeOrgMenu onItemClick={handleItemClick} />*/}
      {/* Pass the click handler */}

      <PowerBIEmbed />
    </div>
  );
};

export default HomeAuthenticated;
