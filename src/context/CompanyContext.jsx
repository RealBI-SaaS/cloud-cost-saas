import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/axios/axiosInstance";
//import { useUser } from "./UserContext";
import useUserStore from "./userStore";

// Create Context
const CompanyContext = createContext(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

// Provider Component
export const CompanyProvider = ({ children }) => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  //const { user } = useUser();
  const user = useUserStore((state) => state.user);

  // Fetch all companies from the backend (with optional search query)
  const fetchCompanies = async (search = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/organizations/all-companies/?search=${search}`,
      );
      //console.log(response.data);
      setAllCompanies(response.data.results);
      setFilteredCompanies(response.data.results);
    } catch (err) {
      console.error("Error fetching companies", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search term change
  const handleSearchChange = (search) => {
    setSearchTerm(search);
    if (search) {
      // If there's a search term, filter from the backend
      fetchCompanies(search);
    } else {
      // If no search term, fetch all companies
      setFilteredCompanies(allCompanies);
    }
  };

  // Fetch companies on initial load and when the search term changes
  useEffect(() => {
    if (user?.is_staff) fetchCompanies(searchTerm);
  }, [searchTerm, user]);

  return (
    <CompanyContext.Provider
      value={{
        allCompanies,
        filteredCompanies,
        loading,
        searchTerm,
        handleSearchChange,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
