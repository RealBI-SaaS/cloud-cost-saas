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

export interface MemberType {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
    email: string;
    org_id?: string;
    organization?: string;
    expires_at?: string
}
export interface NewMemberType{
    email: string,
    role: string,
    org_id: string
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
    getOrganization(id: string) {
        return axiosInstance.get(`/organization/${id}/`)
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



    // member related api
    
     getMembers(id: string) {
       
        return axiosInstance.get(`/organization/${id}/members/`)
    }

 
     getMemberInvitations(id: string) {
        return axiosInstance.get(`/organization/${id}/invitations/`)
    }
     inviteMember(newMember:NewMemberType)  {
        return axiosInstance.post(`/organization/${newMember.org_id}/invite/`,newMember )
    }
    
    revokeInvitation(id: string) {
        return axiosInstance.delete(`/organization/invitations/revoke/${id}/`)
    }
    updateMemberRole(orgId: string, memberId: string, newRole: string) {
        return axiosInstance.patch(`/organization/${orgId}/members/${memberId}/role/`, { role: newRole });
    }

    removeMember(orgId: string, memberId: string) {
        return axiosInstance.delete(`/organization/${orgId}/members/${memberId}/`);
    }
}


export default new OrganizationService()