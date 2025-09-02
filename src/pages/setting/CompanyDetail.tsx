import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, Pencil, Upload } from "lucide-react";
import axiosInstance from "@/config/axios/axiosInstance";
import useCompanyStore from "@/stores/CompanyStore";
import CreateCompanyForm from "../company/CreateCompanyForm";

export default function CompanyDetails() {
  const navigate = useNavigate();
  const userComp = useCompanyStore((state) => state.userComp);
  const fetchUserCompany = useCompanyStore((state) => state.fetchUserCompany);

  const [compName, setCompName] = useState(userComp?.name || "");
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    userComp?.logo || null
  );

  useEffect(() => {
    if (userComp) {
      setCompName(userComp.name);
      setLogoPreview(userComp.logo || null);
    }
  }, [userComp]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", compName);

      await axiosInstance.patch(`/company/${userComp?.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchUserCompany();
      toast.success("Company updated successfully");
      setIsEditingOrg(false);
    } catch (error) {
      toast.error("Failed to update company");
      console.error("Error updating company:", error);
    }
  };

  const canEdit =
    userComp?.membership?.role === "admin" ||
    userComp?.membership?.role === "owner";

  // Render company details if company exists
  if (userComp) {
    return (
      <div className="container mx-auto border rounded-lg">
        <Card className="w-3/4 shadow-none border-none">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo"
                  className="h-12 w-12 object-contain rounded-md"
                />
              ) : (
                <Building2 className="h-6 w-6" />
              )}
              <h1 className="text-lg font-bold">{userComp.name}</h1>
            </div>
            <CardDescription>
              View and manage your organization details.
            </CardDescription>
          </CardHeader>

          <hr />

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Name</Label>
                {!isEditingOrg && canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingOrg(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingOrg ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="text-white"
                    onClick={handleCompanyUpdate}
                    disabled={compName === userComp.name && !logoFile}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCompName(userComp.name);
                      setLogoFile(null);
                      setLogoPreview(userComp.logo);
                      setIsEditingOrg(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="text-lg font-medium">{userComp.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Created on{" "}
                {userComp.created_at
                  ? format(new Date(userComp.created_at), "MMM d, yyyy")
                  : "Invalid date"}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render create company form if in creation mode
  if (creatingCompany) {
    return <CreateCompanyForm />;
  }

  // Render no company found message
  return (
    <div className="">
      <Card className="w-3/4 shadow-none border border-b border-l">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <Building2 className="h-6 w-6" />
            <CardTitle>No Company Found</CardTitle>
          </div>
          <hr />
          <CardDescription>
            You don't have a company yet. Start by creating one to manage your
            organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCreatingCompany(true)}>
            Create a Company
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
