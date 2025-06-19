import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useOrg } from "../../context/OrganizationContext";
import ManageAllSideMenu from "../sidebars/ManageAllSideMenu";

const UserOrganizations = () => {
  const navigate = useNavigate();
  const { userOrgs } = useOrg();
  console.log("org", userOrgs);
  //console.log(orgData)

  return (
    <div className="p-4">
      <div className="">
        <div className="flex items-start justify-start p-4">
          <p className="text-xl font-semibold m-0">Your Organizations</p>
          <button
            onClick={() => navigate("/create-company")}
            className="text-white p-2 rounded-md hover:bg-blue-200 hover:text-black transition-colors flex items-center"
          >
            <IoMdAdd />
          </button>
        </div>
        {userOrgs.length > 0 ? (
          userOrgs.map((company, index) => (
            <Link to={`/organizations/${company.id}`} key={index}>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="">
                  <div>{company.name}</div>
                  <div>
                    <span className="font-medium">Company ID:</span>{" "}
                    {company.id}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div>No organizations found.</div>
        )}
      </div>
    </div>
  );
};

export default UserOrganizations;
