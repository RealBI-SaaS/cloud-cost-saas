import useCompany from "@/stores/CompanyStore";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axios/axiosInstance";

const DataIntegration: React.FC = () => {
  const userComp = useCompany((state) => state.userComp);
  const [integredAccounts, setIntegratedAccounts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading as true

  const fetchIntegrations = async () => {
    console.log("here");
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/data/companies/${userComp.id}/cloud-accounts/`,
      );
      console.log(response.data.results);
      setIntegratedAccounts(response.data.results);

      setLoading(false);
    } catch (error) {
      console.log("ERR", error);
    }
  };

  // Run the effect only when userComp is available
  useEffect(() => {
    console.log(userComp);
    if (userComp) {
      fetchIntegrations();
    }
  }, [userComp]); // Dependency array: Re-run when userComp changes

  console.log(integredAccounts);

  // Display a loading message until the data is fetched
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-white">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Display "No Accounts" if the array is empty
  if (integredAccounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-white">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Data Integration and Credentials' Management
        </h1>
        <p className="text-gray-600">No integrated accounts found.</p>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start h-full p-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Data Integration and Credentials' Management
      </h1>
      {integredAccounts.map((acc) => (
        <div key={acc.account_id}>
          <p className="text-foreground">{acc.account_id}</p>
          <p className="text-foreground">{acc.account_name}</p>
        </div>
      ))}
    </div>
  );
};

export default DataIntegration;
