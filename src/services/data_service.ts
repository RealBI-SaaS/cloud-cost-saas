import axiosInstance from "./axiosInstance"

export interface CloudAccountType{
    id: string,
    organization: string,
    vendor: string,
    account_name: string,
    account_id: string,
    created_at: string,
    updated_at: string
}
interface CloudAccountApiData {
    next: string;
    previous: string;	
    results: CloudAccountType[];
    count: number;
}
class DataService{
    getOrgCloudAccounts(id: string) {
        const controller = new AbortController();
        const response = axiosInstance
            .get<CloudAccountApiData>(`/data/organizations/${id}/cloud-accounts/`, {
                signal: controller.signal
            })
        return {response, cancel:()=>controller.abort()}
    }

}

export default new DataService()