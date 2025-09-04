import OrganizationService from '@/services/organization_service'
import {CanceledError} from "@/services/axiosInstance";

import { useEffect, useState } from 'react'

const useOrganizations = () => {
    const [organizations, setOrganizations] = useState([])  
    const [error, setError] = useState("")    
    const [isLoading, setIsLoading] = useState(false)   

    useEffect(() => {
        setIsLoading(true)
        const {response, cancel} = OrganizationService.getAllOrganizations()
        response
            .then(res => {
                setOrganizations(res.data?.results || [])
                setIsLoading(false)
            })
            .catch(err => {
                if( err instanceof CanceledError) return;
                setError(err.message)
                setIsLoading(false)
            })

        return () => cancel()
    }, [])
    return {organizations, error, isLoading,setOrganizations}
}

export default useOrganizations
