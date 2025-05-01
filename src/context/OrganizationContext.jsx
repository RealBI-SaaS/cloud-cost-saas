import { useState, useEffect, createContext, useContext } from "react";
import {
  get_users_orgs,
  get_user_comp,
  fetchCompOrgs,
} from "../utils/org/fetchers";
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
  const { user } = useUser();
  //the organization th user is working on
  const [currentOrg, setCurrentOrg] = useState("");
  const [userComp, setUserComp] = useState("");
  //const [loading, setLoading] = useState(true);
  const { loading, setLoading } = useUser();

  const [navigations, setNavigations] = useState([]);

  // New: Admin-related state
  //const [allCompanies, setAllCompanies] = useState([]);
  //const [selectedCompany, setSelectedCompany] = useState(null);
  //const [companySearch, setCompanySearch] = useState("");
  //
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
  };

  const fetchUserCompany = async () => {
    if (user.is_staff) {
      const response = await axiosInstance.get(
        `/organizations/company/${userComp.id}/`,
      );
      //console.log(response.data);
      if (response.data) {
        setUserComp(response.data);
      }

      return;
    }
    try {
      const response = await get_user_comp();
      //or use from localstorage
      const comp = response.data?.results || [];
      //console.log(comp);

      setUserComp(comp[0]);
    } catch (err) {
      console.error("Error fetching company data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrganizations = async () => {
    //if (user.is_staff) {
    //  const response = await fetchCompOrgs(userComp.id);
    //  console.log(response.data);
    //  setUserOrgs(response.data);
    //  return;
    //}
    try {
      let organizations;
      if (user.is_staff && currentOrg?.id) {
        const response = await fetchCompOrgs(userComp.id);
        //console.log("**:");
        //console.log(response);

        organizations = response || [];
        //setUserOrgs(response.data);
        //return;
      } else {
        const response = await get_users_orgs();

        organizations = response.data?.results || [];
      }

      setUserOrgs(organizations);

      //console.log(organizations);
      if (organizations.length > 0) {
        const matchedOrg = organizations.find(
          (org) => org.id === currentOrg?.id,
        );
        setCurrentOrg(matchedOrg || organizations[0]);
      }
    } catch (err) {
      console.error("Error fetching organization data:", err);
    } finally {
      setLoading(false);
    }
  };
  //create org
  const createOrganization = async (orgName) => {
    //console.log("new req");
    try {
      //const token = localStorage.getItem('access_token');
      const response = await axiosInstance.post(
        "/organizations/organization/",
        { name: orgName, company: userComp.id },
      );

      if (response.status === 201) {
        //onOrganizationCreated();
        //setOrgName("");
        await fetchUserOrganizations();
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchUserOrganizations();
    fetchUserCompany();
    // console.log("organizations fetched");
  }, [user]);

  useEffect(() => {
    fetchNavigations();

    // console.log("navigations fetched");
  }, [currentOrg]);

  return (
    <OrganizationContext.Provider
      value={{
        userOrgs,
        loading,
        currentOrg,
        setCurrentOrg,
        setUserOrgs,
        setUserComp,
        fetchUserOrganizations,
        createOrganization,
        navigations,
        fetchNavigations,
        userComp,
        fetchUserCompany,
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
