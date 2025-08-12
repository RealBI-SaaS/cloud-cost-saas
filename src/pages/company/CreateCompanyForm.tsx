// import React, { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
// import { Building2 } from "lucide-react";
import axiosInstance from "@/config/axios/axiosInstance";

import useCompany from "@/stores/CompanyStore";
// import { useNavigate } from "react-router-dom";
// import { useOrg } from "@/context/OrganizationContext";
// import useOrgStore from "@/stores/OrgStore";
//
// export default function CreateCompany() {
//   const navigate = useNavigate();
//   const [companyName, setCompanyName] = useState("");
//   const [loading, setLoading] = useState(false);
//   //const { fetchUserCompany } = useOrg();
//   const fetchUserCompany = useOrgStore((state) => state.fetchUserCompany);
//
//   const handleCreate = async () => {
//     if (!companyName.trim()) {
//       toast.error("Company name cannot be empty.");
//       return;
//     }
//
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post("/organizations/company/", {
//         name: companyName,
//       });
//
//       if (response.status !== 201) {
//         throw new Error("Unexpected response status: " + response.status);
//       }
//
//       const data = await response.data;
//       toast.success("Company created successfully!");
//       fetchUserCompany();
//     } catch (err) {
//       toast.error(err.message);
//       toast.error(err?.response?.data?.name[0]);
//       //console.log(err);
//     } finally {
//       setLoading(false);
//       //navigate("/settings/company/details");
//     }
//   };
//
//   return (
//     <div className=" h-screen flex flex-col justify-around">
//       <Card className="max-w-md w-3/4 mx-auto mt-10 p-6 shadow-md">
//         <CardContent>
//           <div className="flex items-center gap-2 mb-4">
//             <Building2 className="w-5 h-5 text-primary" />
//             <h2 className="text-lg font-semibold">Create Your Company</h2>
//           </div>
//           <p className="text-sm text-muted-foreground mb-4">
//             To continue, please enter your company name.
//           </p>
//           <Input
//             placeholder="Enter company name"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             className="mb-4"
//           />
//           <Button onClick={handleCreate} disabled={loading} className="w-full">
//             {loading ? "Creating..." : "Create Company"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";

export default function CreateCompanyForm({ onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUserCompany = useCompany((state) => state.fetchUserCompany);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/company/", {
        name: companyName,
      });

      if (response.status !== 201) {
        throw new Error("Unexpected response status: " + response.status);
      }

      const data = await response.data;
      toast.success("Company created successfully!");
      fetchUserCompany();
    } catch (err) {
      toast.error(err.message);
      toast.error(err?.response?.data?.name[0]);
      //console.log(err);
    } finally {
      setLoading(false);
      //navigate("/settings/company/details");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <CardTitle>Create a Company</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Company
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
