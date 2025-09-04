import { Company } from "@/services/company_service";
import { createContext } from "react";

const CompanyContext = createContext<Company>(null);

export default CompanyContext;
