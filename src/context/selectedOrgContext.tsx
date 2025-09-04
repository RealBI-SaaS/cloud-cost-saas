import { Organization } from "@/services/organization_service";
import React, { createContext } from "react";
interface selectedOrgType {
  selectedOrg: Organization;
  setSelectedOrg: React.Dispatch<React.SetStateAction<Organization>>;
}

const SelectedOrgContext = createContext<selectedOrgType>(null);

export default SelectedOrgContext;
