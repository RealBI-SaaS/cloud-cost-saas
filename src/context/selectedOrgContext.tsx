import React, { createContext } from "react";
interface selectedOrgType {
  selectedOrg: OrganizationsType;
  setSelectedOrg: React.Dispatch<React.SetStateAction<OrganizationsType>>;
}

const SelectedOrgContext = createContext<selectedOrgType>(null);

export default SelectedOrgContext;
