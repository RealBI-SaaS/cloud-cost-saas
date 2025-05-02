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
import { Building2, Pencil, Trash2 } from "lucide-react";
import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/axios/axiosInstance";
import { edit_user_comp } from "@/utils/org/editors";

export default function CompanyDetails() {
  const navigate = useNavigate();
  const { userComp, fetchUserCompany } = useOrg();
  const [compName, setCompName] = useState(userComp?.name || "");
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  useEffect(() => {
    console.log(userComp);
  }, [userComp]);

  // Handle organization name update
  const handleCompanyUpdate = async () => {
    // Here you would typically send the updated org name to your API
    const res = await edit_user_comp(userComp?.id, { name: compName });
    console.log(compName);
    console.log(res);
    fetchUserCompany();

    toast.success("Company updated successfully");
    setIsEditingOrg(false);
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
  if (!userComp) {
    return (
      <div className="max-w-md mx-auto mt-10 rounded-lg p-6 bg-background text-foreground">
        <h2 className="text-lg font-semibold mb-2">No Company Found</h2>
        <p className="text-sm text-muted-foreground mb-4">
          You don’t have a company yet. Start by creating one to manage your
          organization.
        </p>
        <Button asChild>
          <Link to="/company/create">Create a Company</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="w-full shadow-none border-none w-3/4">
        <CardHeader>
          <div className="flex items-center gap-3 border-bottom mb-5">
            <Building2 className="h-6 w-6" />
            <h1 className="text-3xl font-bold">{userComp?.name}</h1>
          </div>

          <CardDescription>
            View and manage your organization details.
          </CardDescription>
        </CardHeader>
        <hr />
        <CardContent className="space-y-4 ">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="org-name" className="!text-xs">
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
                  disabled={compName == userComp?.name}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCompName(userComp?.name || "");
                    setIsEditingOrg(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-lg font-medium">{compName}</div>
            )}
          </div>
          <div className="space-y-2 ">
            <Label className="!text-xs">
              {userComp?.created_at
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
