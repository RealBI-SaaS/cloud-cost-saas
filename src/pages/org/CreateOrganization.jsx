import { useState } from "react";
//import axios from "axios";
import axiosInstance from "../../config/axios/axiosInstance.js";
import { useOrg } from "../../context/OrganizationContext.jsx";

function CreateOrganization({ onOrganizationCreated }) {
  const [orgName, setOrgName] = useState("");
  const { createOrganization } = useOrg();

  const handleCreateCompanySubmit = async () => {
    //const token = localStorage.getItem('access_token');
    const response = createOrganization(orgName);
  };

  return (
    <div className="grid grid-cols-1 justify-start bg-gray-200  w-full ">
      <div className="flex border gap-3   w-full rounsed-sm items-center justify-between   gap-3 justify-center ">
        <form className=" border">
          <input
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Company Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full"
          />
        </form>
        <button
          onClick={handleCreateCompanySubmit}
          className="text-white bg-blue-500  hover:bg-blue-400 transition-colors border"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateOrganization;
