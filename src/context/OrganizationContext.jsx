import { useState, useEffect, createContext, useContext } from "react";
import get_users_orgs from "../utils/org/get_users_organizations";
import axiosInstance from "../axios/axiosInstance";
import CreateOrganization from "../components/org/CreateOrganization";
import { useUser } from "./UserContext";
// Create Context
const OrganizationContext = createContext(null);

export const useOrg = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrg must be used within an OrganizationProvider");
  }
  return context;
};

// Provider Component
export const OrganizationProvider = ({ children }) => {
  const [userOrgs, setUserOrgs] = useState([]);
  //the organization th user is working on
  const [currentOrg, setCurrentOrg] = useState(null);
  //const [loading, setLoading] = useState(true);
  const { loading, setLoading } = useUser();

  const [navigations, setNavigations] = useState([]);

  //fetch navigations
  const fetchNavigations = async () => {
    if (!currentOrg) return; // Prevent running if currentOrg is undefined

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/organizations/${currentOrg.id}/navigation/`,
      );
      setNavigations(response.data.results);
    } catch (err) {
      console.error("Error fetching navigations", err);
    } finally {
      setLoading(false);
    }
  }; //
  //const fetchUserOrganizations = async () => {
  //  try {
  //    const response = await get_users_orgs();
  //    setUserOrgs(response.data?.results || []);
  //    if (userOrgs.length > 0) {
  //      setCurrentOrg(userOrgs[0]);
  //    }
  //  } catch (err) {
  //    console.error("Error fetching organization data:", err);
  //  } finally {
  //    setLoading(false);
  //  }
  //};

  const fetchUserOrganizations = async () => {
    try {
      const response = await get_users_orgs();
      const organizations = response.data?.results || [];

      setUserOrgs(organizations);

      if (organizations.length > 0) {
        setCurrentOrg(organizations[0]); // Ensure currentOrg is set correctly
      }
    } catch (err) {
      console.error("Error fetching organization data:", err);
    } finally {
      setLoading(false);
    }
  };
  //create org
  const createOrganization = async (orgName) => {
    try {
      //const token = localStorage.getItem('access_token');
      const response = await axiosInstance.post(
        "/organizations/organization/",
        { name: orgName },
      );

      if (response.status === 201) {
        //onOrganizationCreated();
        //setOrgName("");
        fetchUserOrganizations();
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };
  useEffect(() => {
    fetchUserOrganizations();

    console.log("organizations fetched");
  }, []);

  useEffect(() => {
    fetchNavigations();

    console.log("navigations fetched");
  }, [currentOrg]);

  return (
    <OrganizationContext.Provider
      value={{
        userOrgs,
        loading,
        currentOrg,
        setCurrentOrg,
        createOrganization,
        navigations,
        fetchNavigations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom Hook
//export const useOrg = () => {
//  const context = useContext(OrganizationContext);
//  if (!context) {
//    throw new Error("useOrg must be used within an OrganizationProvider");
//  }
//  return context;
//};
