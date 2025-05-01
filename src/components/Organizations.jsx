import React, { useState, useEffect } from "react";
import CreateOrganization from "./org/CreateOrganization";

import UserOrganizations from "./org/UserOrganizations";
import { get_users_orgs } from "@/utils/org/fetchers";

function Organizations() {
  const [orgData, setOrgData] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("access_token");
  //
  //const fetchOrganizations = async () => {
  //  try {
  //    const response = await get_users_orgs();
  //    setOrgData(response.data?.results || []);
  //  } catch (err) {
  //    setError("Failed to fetch organization data");
  //    console.error("Error fetching organization data:", err);
  //  } finally {
  //    setLoading(false);
  //  }
  //};

  //useEffect(() => {
  //  fetchOrganizations();
  //}, []);
  //
  //const handleOrganizationCreated = () => {
  //  fetchOrganizations();
  //};
  //
  //if (loading) {
  //  return <div className="p-4">Loading...</div>;
  //}

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-6 bg-gray-100 h-full w-3/4 bg-amber-400 ">
      <div className="col-span-5 w-full max-w-screen-lg mt-5 p-4 rounded-lg shadow-md">
        <UserOrganizations />
      </div>

      <div className="col-span-5 w-full max-w-screen-lg mt-5 p-4 rounded-lg shadow-md">
        <h1 className="text-xl mb-4">New Organizations</h1>
        <CreateOrganization />
      </div>
    </div>
  );
}

export default Organizations;
