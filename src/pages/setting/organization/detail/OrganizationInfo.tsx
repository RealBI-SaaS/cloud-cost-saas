import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-buton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrganizationContext from "@/context/OrganizationContext";
import useCompany from "@/hooks/useCompany";
import organization_service, {
  CreateOrgType,
  Organization,
} from "@/services/organization_service";
import { Calendar, Edit, SaveAll, Settings, X, Building } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
interface Props {
  organization: Organization;
  onUpdate: React.Dispatch<React.SetStateAction<Organization>>;
}

const OrganizationInfo = ({ organization, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CreateOrgType>({
    name: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { organizations, setOrganizations } = useContext(OrganizationContext);
  const { companies } = useCompany();

  // Initialize form with organization data
  useEffect(() => {
    if (organization) {
      setEditForm({
        name: organization.name || "",
        company: organization.company || "",
      });
    }
  }, [organization]);

  const handleSaveOrganization = () => {
    if (!editForm.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setIsLoading(true);
    organization_service
      .updateOrganization(organization.id, editForm)
      .then((res) => {
        setOrganizations(
          organizations.map((org) =>
            org.id === organization.id
              ? {
                  ...res.data,
                  role: organization?.role,
                }
              : org
          )
        );
        onUpdate({
          ...res.data,
          role: organization?.role,
        });
        setIsLoading(false);
        setIsEditing(false);
        toast.success("Organization updated successfully");
      })
      .catch((e) => {
        setIsLoading(false);
        toast.error(e.message || "Failed to update organization");
        console.error("Error updating org:", e);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: organization.name || "",
      company: organization.company || "",
    });
  };
  const userCanEdit =
    organization?.role === "owner" || organization.role === "admin";

  return (
    <div>
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Organization Details</CardTitle>
              <CardDescription>
                Manage your organization's information and settings
              </CardDescription>
            </div>
          </div>
          {userCanEdit && (
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2 shrink-0"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Organization
                </>
              )}
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Organization Name *
                  </Label>
                  <Input
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="h-11"
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-3 ">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Select
                    disabled
                    value={editForm.company}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, company: value })
                    }
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent className="">
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </Label>
                  <div className="px-3 py-2 bg-muted/20 rounded-lg text-sm">
                    {new Date(organization?.created_at!).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last Updated
                  </Label>
                  <div className="px-3 py-2 bg-muted/20 rounded-lg text-sm">
                    {new Date(organization?.updated_at!).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 ">
                <Button
                  type="button"
                  className="gap-2"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <LoadingButton
                  loading={isLoading}
                  onClick={handleSaveOrganization}
                  className="gap-2"
                >
                  <SaveAll className="h-4 w-4" />
                  Save Changes
                </LoadingButton>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <div className="text-lg font-medium px-3 py-2 bg-muted/20 rounded-lg">
                    {organization?.name || "Not set"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company
                  </Label>
                  <div className="text-lg font-medium px-3 py-2 bg-muted/20 rounded-lg">
                    {organization?.company_name || "Not set"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </Label>
                  <div className="px-3 py-2 bg-muted/20 rounded-lg">
                    {new Date(organization?.created_at!).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last Updated
                  </Label>
                  <div className="px-3 py-2 bg-muted/20 rounded-lg">
                    {new Date(organization?.updated_at!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationInfo;
