import CompanyService from '@/services/company_service'
import {CanceledError} from "@/services/axiosInstance";

import { useEffect, useState } from 'react'

const useCompany = () => {
    const [company, setCompany] = useState([])  
    const [error, setError] = useState("")    
    const [isLoading, setIsLoading] = useState(false)   

    useEffect(() => {
        setIsLoading(true)
        const {response, cancel} = CompanyService.getAllCompany()
        response
            .then(res => {
                setCompany(res.data?.results || [])
                setIsLoading(false)
            })
            .catch(err => {
                if( err instanceof CanceledError) return;
                setError(err.message)
                setIsLoading(false)
            })

        return () => cancel()
    }, [])
    return {companys, error, isLoading}
}

export default useCompany
