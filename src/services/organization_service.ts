import axiosInstance from "./axiosInstance";

export interface Organization {
    id: string;
    role: string;
    name: string;
    created_at: string;
    updated_at: string;
    company_id: string;
    company_name: string;
    // Add other properties as needed
    description: string;
    monthlyCost?: number;
    costChange?: number;
    activeAccounts?: number;
    members?: number;
    membersChange?: number;
    accountsChange?: number;
}


class OrganizationService{
    getAllOrganizations() {
        const controller = new AbortController();
        const response = axiosInstance
            .get<Organization[]>("/organizations", {
                signal: controller.signal
            })
        return {response, cancel:()=>controller.abort()}
    }
    deleteOrganization(id: string) {
        return axiosInstance.delete(`/organizations/${id}/`)
    }
    CreateOrganization(newOrg: Organization) {
        return  axiosInstance.post('/organizations', newOrg)
    }
}


export default new OrganizationService()