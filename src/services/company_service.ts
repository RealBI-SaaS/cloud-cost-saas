import axiosInstance from "./axiosInstance";


interface ApiData {
    next: string;
    previous: string;	
    results: Company[];
    count: number;
    
}
export interface Company {
    id: string;
    role: string;
    name: string;
    created_at: string;
    updated_at: string;
    owner: string;
    // Add other properties as needed
    description: string;
    monthlyCost?: number;
    costChange?: number;
    activeAccounts?: number;
    members?: number;
    membersChange?: number;
    accountsChange?: number;
}


class CompanyService{
    getAllCompany() {
        const controller = new AbortController();
        const response = axiosInstance
            .get<ApiData>("/company", {
                signal: controller.signal
            })
        return {response, cancel:()=>controller.abort()}
    }
    deleteCompany(id: string) {
        return axiosInstance.delete(`/company/${id}/`)
    }
    CreateCompany(newOrg: Company) {
        return  axiosInstance.post('/company', newOrg)
    }
}


export default new CompanyService()