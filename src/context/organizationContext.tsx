import { Organization } from "@/services/organization_service";
import React, { createContext } from "react";
interface OrganizationContextType {
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  selectedOrg: Organization;

  setSelectedOrg: React.Dispatch<React.SetStateAction<Organization>>;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export default OrganizationContext;
