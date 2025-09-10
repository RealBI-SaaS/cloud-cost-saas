import { request } from "http";
import axiosInstance from "./axiosInstance";

class MyAuthService {
    requestMagicLink(email: string) { 
        return axiosInstance.post(`/myauth/passwordless/magic-link/request/`, email)
        
    }
    requestOtp(email: string) { 
       return axiosInstance.post(`/myauth/passwordless/otp/request/`,email)
    }
}
export default new MyAuthService()