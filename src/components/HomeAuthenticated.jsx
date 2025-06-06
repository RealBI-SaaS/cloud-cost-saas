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
import { useLocation, useParams } from "react-router-dom";

const HomeAuthenticated = () => {
  const { parentId, subId } = useParams();
  const navigations = useOrgStore((state) => state.navigations);
  
  // Get the parent navigation item
  const parentNav = parentId ? navigations.find(nav => nav.id === parentId) : null;
  
  // Get the sub navigation item if it exists
  const subNav = subId ? navigations.find(nav => nav.id === subId) : null;

  // Construct the title based on the navigation hierarchy
  // let title = "Dashboard";
  // if (parentNav) {
  //   title = parentNav.label;
  //   if (subNav) {
  //     title = `${parentNav.label} > ${subNav.label}`;
  //   }
  // }

  // const user = useUserStore((state) => state.user, shallow);
  // const { currentOrg } = useOrg();
  // const currentOrg = useOrgStore((state) => state.currentOrg);
  //const navigate = useNavigate();
  //const [value, setValue] = useState([50]);
  // console.log(title);
  // console.log(location);
  // const [selectedItem, setSelectedItem] = useState("Welcome");

  // Function to update the clicked label
  //const handleItemClick = (label) => {
  //  setSelectedItem(label); // Update selected label
  //};

  return (
    <div className=" flex grid grid-cols-1 justify-around items-center w-full h-full  ">
      {/*<HomeOrgMenu onItemClick={handleItemClick} />*/}
      {/* Pass the click handler */}
    {/* <h1 className="text-2xl font-bold px-5 mx-5 py-3">{title}</h1> */}

      <PowerBIEmbed />
    </div>
  );
};

export default HomeAuthenticated;
