import { request } from "http";
import axiosInstance from "./axiosInstance";

class MyAuthService {
    requestMagicLink(email: string) { 
        return axiosInstance.post(`/myauth/passwordless/magic-link/request/`, {"email":email})
        
    }
    verifyMagicLink(token: string) { 
        return axiosInstance.post(`/myauth/passwordless/magic-link/verify/`, {"token":token})
        
    }
    requestOtp(email: string) { 
       return axiosInstance.post(`/myauth/passwordless/otp/request/`, {"email":email})
    }
}
export default new MyAuthService()