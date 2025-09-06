import OrganizationService, { allOrganizations, Organization } from '@/services/organization_service'
import {CanceledError} from "@/services/axiosInstance";

import { useEffect, useState } from 'react'
import { toast } from 'sonner';

const useOrganizations = () => {
    
    const [organizations, setOrganizations] = useState<Organization[]>([allOrganizations])  
    const [error, setError] = useState("")    
    const [isLoading, setIsLoading] = useState(false)   

    useEffect(() => {
        setIsLoading(true)
        const {response, cancel} = OrganizationService.getAllOrganizations()
        response
            .then(res => {
               
                setOrganizations(
                    ()=>[
                      
                        ...res.data?.results|| []
                    ]
                    )
                setIsLoading(false)
            })
            .catch(err => {
                if (err instanceof CanceledError)  return;
                setError(err.message)
                toast.error(err.message)
                setIsLoading(false)
                console.log(err)
           
            })
        return () => cancel()


    }, [])
    return {organizations, error, isLoading,setOrganizations}
}

export default useOrganizations
