import axiosInstance from "./axiosInstance";


interface ApiData {
    next: string;
    previous: string;	
    results: Organization[];
    count: number;
}

export interface Organization {
    id: string;
    role: string;
    name: string;
    created_at: string;
    updated_at: string;
    company_id: string;
    company: string;
    // Add a defualt value for the below fields
    company_name: string;
    description: string;
    monthlyCost?: number;
    costChange?: number;
    activeAccounts?: number;
    active_cloud_accounts:number
    members?: number;
    membersChange?: number;
    accountsChange?: number;
}
 export const allOrganizations = {
    id: "summary",
    name: "All organization",
    monthlyCost: 1245.5,
    costChange: 125.6,
    activeAccounts: 42,
    accountsChange: 3,
    members: 156,
    membersChange: -2,      
    role: " ",
    created_at: "",
    updated_at: "",
    company_id: "",
    company: "",
    company_name: "",
    active_cloud_accounts: 5,
    description: ""
  }
export interface CreateOrgType{
    name: string,
    company: string
}

class OrganizationService{
    getAllOrganizations() {
        const controller = new AbortController();
        const response = axiosInstance
            .get<ApiData>("/organization", {
                signal: controller.signal
            })
        return {response, cancel:()=>controller.abort()}
    }
    deleteOrganization(id: string) {
        return axiosInstance.delete(`/organization/${id}/`)
    }
    updateOrganization(id: string,updated_data:CreateOrgType) {
        return axiosInstance.put(`/organization/${id}/`, updated_data)
    }
    createOrganization(newOrg: CreateOrgType) {
        return  axiosInstance.post('/organization/', newOrg)
    }
}


export default new OrganizationService()