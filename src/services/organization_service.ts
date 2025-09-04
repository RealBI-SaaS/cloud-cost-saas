import { use, useState } from "react";
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
    // Add other properties as needed
    company_name:string
    description: string;
    monthlyCost?: number;
    costChange?: number;
    activeAccounts?: number;
    members?: number;
    membersChange?: number;
    accountsChange?: number;
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