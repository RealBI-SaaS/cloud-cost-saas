import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type React from "react";
import { useEffect, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, Pencil, Trash2, Upload } from "lucide-react";
import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/axios/axiosInstance";
import { edit_user_comp } from "@/utils/org/editors";
import CreateCompany from "./CreateCompany";
import useOrgStore from "@/context/OrgStore";

export default function CompanyDetails() {
  const navigate = useNavigate();
  // const { userComp, fetchUserCompany, fetchUserOrganizations } = useOrg();
  const userComp = useOrgStore((state) => state.userComp);
  const fetchUserCompany = useOrgStore((state) => state.fetchUserCompany);
  const fetchUserOrganizations = useOrgStore(
    (state) => state.fetchUserOrganizations,
  );

  const [compName, setCompName] = useState(userComp?.name || "");
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(userComp?.logo || null);
console.log(userComp);
  useEffect(() => {
    if (userComp) {
      //console.log(userComp);

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

  // Handle organization name update
  const handleCompanyUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', compName);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await axiosInstance.patch(
        `/organizations/company/${userComp?.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      fetchUserCompany();
      fetchUserOrganizations();

      toast.success("Company updated successfully");
      setIsEditingOrg(false);
    } catch (error) {
      toast.error("Failed to update company");
      console.error("Error updating company:", error);
    }
  };

  // Handle organization deletion
  //const handleDeleteOrg = async () => {
  //  try {
  //    await axiosInstance.delete(
  //      `/organizations/organization/${currentOrg.id}/`,
  //    );
  //  } catch (error) {
  //    console.error("Error deleting organization:", error);
  //
  //    toast.error("Opps, organization deleted unsuccessfully");
  //  } finally {
  //    toast.success("Organization deleted successfully");
  //
  //    window.location.href = "/settings/organization/list";
  //  }

  // Here you would typically send the delete request to your API
  // Redirect to organizations list or dashboard
  //};
  if (userComp) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="w-full shadow-none border-none w-3/4">
          <CardHeader>
            <div className="flex items-center gap-3 border-bottom mb-5">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Company Logo" 
                  className="h-12 w-12 object-contain rounded-md"
                />
              ) : (
                <Building2 className="h-6 w-6" />
              )}
              <h1 className="text-3xl font-bold">{userComp?.name}</h1>
            </div>

            <CardDescription>
              View and manage your organization details.
            </CardDescription>
          </CardHeader>
          <hr />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="org-name"
                  className="text-xs text-muted-foreground"
                >
                  Name
                </Label>
                {!isEditingOrg && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingOrg(true)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              {isEditingOrg ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="org-name"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="!text-white"
                    onClick={handleCompanyUpdate}
                    disabled={compName == userComp?.name && !logoFile}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCompName(userComp?.name || "");
                      setLogoFile(null);
                      setLogoPreview(userComp?.logo || null);
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

            {isEditingOrg && (
              <div className="space-y-2">
                <Label
                  htmlFor="company-logo"
                  className="text-xs text-muted-foreground"
                >
                  Company Logo
                </Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="h-16 w-16 object-contain rounded-md border"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('company-logo')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Created on {userComp?.created_at
                  ? format(new Date(userComp.created_at), "MMM d, yyyy")
                  : "Invalid date"}
              </Label>

              {/* <div className="!text-lg">
              {currentOrg?.created_at
                ? format(new Date(currentOrg.created_at), "MMM d, yyyy")
                : "Invalid date"}
            </div> */}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    );
  }
  if (creatingCompany) {
    return <CreateCompany />;
  }
  //if (!userComp) {
  return (
    <div className="container   grid grid-cols-1 justify-center mx-auto px-4 py-10">
      <Card className="w-3/4 shadow-none border-none border border-b border-l">
        <CardHeader>
          <div className="flex  items-center gap-3 border-bottom mb-1">
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
          <Button asChild>
            <Button
              onClick={() => {
                setCreatingCompany(true);
              }}
            >
              Create a Company
            </Button>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  //}
}
