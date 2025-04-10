//import React, { useState } from "react";
import React from "react";
//import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useOrg } from "../context/OrganizationContext";
import HomeOrgMenu from "./menu/HomeOrgMenu";
import { useState } from "react";
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
    <div className="border flex justify-around items-center">
      {/*<HomeOrgMenu onItemClick={handleItemClick} />*/}
      {/* Pass the click handler */}
      <div className="max-w-4xl mx-auto ">
        {/* Conditionally render content based on the selected item */}
        {selectedItem === "Welcome" ? (
          <div className="mb-6">
            <h2 className="text-4xl font-semibold mb-2">
              Welcome, {user?.first_name || ""}!
            </h2>
            <h3>You're in {currentOrg?.name || "No Organization Selected"}</h3>
          </div>
        ) : selectedItem ? (
          <div className="mt-4">
            <h3 className="text-2xl">{selectedItem}</h3>
          </div>
        ) : (
          <div className="mt-4">
            <p>Select a menu item to view details.</p>
          </div>
        )}
      </div>
    </div> //
    //<div className="border flex justify-around items-center">
    //  <HomeOrgMenu onItemClick={handleItemClick} />
    //  <div className="max-w-4xl mx-auto bg-green-500">
    //    <div className="mb-6">
    //      <h2 className="text-4xl font-semibold mb-2">
    //        Welcome, {user?.first_name || ""}!
    //      </h2>
    //      <h3>You're in {currentOrg?.name || "No Organization Selected"}</h3>
    //    </div>
    //  </div>
    //</div>
  );
};

export default HomeAuthenticated;
