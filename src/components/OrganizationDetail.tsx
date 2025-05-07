"use client";
import { useNavigate } from "react-router-dom";
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
import { edit_user_org } from "@/utils/org/editors";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function OrganizationDetailsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { currentOrg, fetchUserOrganizations } = useOrg();
  const [orgName, setOrgName] = useState(currentOrg?.name || "");
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  console.log(user);

  useEffect(() => {
    if (currentOrg?.name) {
      console.log(currentOrg);
      setOrgName(currentOrg.name);
    }
  }, [currentOrg]);

  // Handle organization name update
  const handleUpdateOrg = async () => {
    // TODO: handle update
    // Here you would typically send the updated org name to your API
    const res = await edit_user_org(currentOrg.id, { name: orgName });
    fetchUserOrganizations();
    //console.log(res);
    toast.success("Organization updated successfully");
    setIsEditingOrg(false);
  };

  // Handle organization deletion
  const handleDeleteOrg = async () => {
    try {
      await axiosInstance.delete(
        `/organizations/organization/${currentOrg.id}/`,
      );
    } catch (error) {
      console.error("Error deleting organization:", error);

      toast.error("Opps, organization deleted unsuccessfully");
    } finally {
      toast.success("Organization deleted successfully");
      fetchUserOrganizations();

      navigate("/settings/organization/list");
    }

    // Here you would typically send the delete request to your API
    // Redirect to organizations list or dashboard
  };

  return (
    <div className="container mx-auto px-4 py-10 ">
      <Card className="w-full shadow-none border-none w-3/4">
        <CardHeader>
          <div className="flex items-center gap-3 border-bottom mb-5">
            <Building2 className="h-6 w-6" />
            <h1 className="text-3xl font-bold">{currentOrg?.name}</h1>
          </div>

          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            View and manage your organization details.
          </CardDescription>
        </CardHeader>
        <hr />
        <CardContent className="space-y-4 ">
          <div className="space-y-2">
            <div className="flex items-center justify-between ">
              <Label
                htmlFor="org-name"
                className="text-xs text-muted-foreground "
              >
                Name
              </Label>
              {((!isEditingOrg && currentOrg.role == "owner") ||
                (!isEditingOrg && user.is_staff)) && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => setIsEditingOrg(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => {
                          event.preventDefault();
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>

                      <AlertDialog
                        open={openDeleteDialog}
                        onOpenChange={setOpenDeleteDialog}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the organization and remove all
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="!text-white"
                              onClick={handleDeleteOrg}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
            {isEditingOrg ? (
              <div className="flex items-center gap-2">
                <Input
                  id="org-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
                <Button
                  size="sm"
                  className="!text-white"
                  onClick={handleUpdateOrg}
                  disabled={orgName == currentOrg?.name}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOrgName(currentOrg?.name || "");
                    setIsEditingOrg(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-xl font-medium">{orgName}</div>
            )}
          </div>
          <div className="grid grid-cols-2 mt-5 border-t pt-3 border-t-secondary">
            <div>
              <Label
                htmlFor="comp-name"
                className="text-xs text-muted-foreground"
              >
                Company
              </Label>

              <div className="text-lg font-medium">
                {currentOrg.company_name}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Created On{" "}
              </Label>
              <div className="text-lg font-medium">
                {currentOrg?.created_at
                  ? format(new Date(currentOrg.created_at), "MMM d, yyyy")
                  : "Invalid date"}
              </div>
            </div>
          </div>

          {/* <div className="!text-lg">
              {currentOrg?.created_at
                ? format(new Date(currentOrg.created_at), "MMM d, yyyy")
                : "Invalid date"}
            </div> */}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
