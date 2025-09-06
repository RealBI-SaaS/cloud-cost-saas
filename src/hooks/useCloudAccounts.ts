import { useEffect, useState } from 'react'
import { CanceledError } from "@/services/axiosInstance";
import DataService from '@/services/data_service';

const useCloudAccounts = (organization_id: string) => {
    const [cloudAccounts, setCloudAccounts] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const {response, cancel} = DataService.getOrgCloudAccounts(organization_id)
        response
            .then(res => {
                setCloudAccounts(res.data?.results || [])
                setIsLoading(false)
            })
            .catch(err => {
                if( err instanceof CanceledError) return;
                setError(err.message)
                setIsLoading(false)
            })

        return () => cancel()
    }, [])
    return {cloudAccounts, error, isLoading}
}

export default useCloudAccounts 
