import React, { useContext, useState } from "react";
import { Loading } from "@/components/misc/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  ExternalLink,
  Building,
  Calendar,
  Users,
  Shield,
  MoreHorizontal,
  TableOfContents,
  LayoutDashboard,
} from "lucide-react";
import organization_service, {
  Organization,
} from "@/services/organization_service";
import AddOrganization from "./AddOrganization";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-buton";
import { WarningAlert } from "@/components/WarningAlert";
import OrganizationContext from "@/context/organizationContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyOrganization = () => {
  const { organizations, isLoading, setOrganizations } =
    useContext(OrganizationContext);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Organization>>({});
  const [search, setSearch] = useState("");
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const handleEdit = (org: Organization) => {
    setEditingId(org.id);
    setForm(org);
  };

  const handleSave = (updated_org) => {
    setIsLoadingSave(true);
    organization_service
      .updateOrganization(updated_org.id, updated_org)
      .then((res) => {
        setOrganizations(
          organizations.map((org) =>
            org.id === updated_org.id
              ? {
                  ...res.data,
                  role: updated_org?.role,
                  company: updated_org?.company,
                }
              : org
          )
        );
        setIsLoadingSave(false);
        setEditingId(null);
        toast.success("Organization updated successfully");
      })
      .catch((e) => {
        setIsLoadingSave(false);
        toast.error(e.message || "Failed to update organization");
        console.error("Error updating org:", e);
      });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  const handleDelete = (id: string) => {
    setIsLoadingSave(true);
    organization_service
      .deleteOrganization(id)
      .then((res) => {
        setOrganizations(organizations.filter((org) => org.id !== id));
        setIsLoadingSave(false);
        toast.success("Organization deleted successfully");
      })
      .catch((e) => {
        setIsLoadingSave(false);
        toast.error(e.message || "Failed to delete organization");
        console.error("Error deleting org:", e);
      });
  };

  const filteredOrgs = organizations?.filter((org: Organization) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "owner":
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-green-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Organizations</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-11"
              />
            </div>
            <AddOrganization
              onCreate={setOrganizations}
              organizations={organizations}
            />{" "}
            <TableOfContents />
            <LayoutDashboard strokeWidth={1} />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4 border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredOrgs?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrgs.map((org: Organization) => (
                <Card
                  key={org.id}
                  className="p-4 border-border/50 hover:shadow-md transition-shadow group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    {editingId === org.id ? (
                      <Input
                        value={form.name || ""}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="h-8 text-sm font-medium"
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {org.name}
                      </h3>
                    )}
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 px-2 py-1 ${getRoleColor(
                        org.role
                      )}`}
                    >
                      {getRoleIcon(org.role)}
                      {org.role}
                    </Badge>
                  </div>

                  {/* Company Info */}
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Company: {org.company_name}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(org.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/settings/org/details/${org.id}`}
                        className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        View Details
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    {editingId === org.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <LoadingButton
                          loading={isLoadingSave}
                          size="sm"
                          onClick={() => {
                            const updated_org = {
                              id: org.id,
                              name: form.name,
                              company: org.company,
                              role: org.role,
                            };
                            handleSave(updated_org);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </LoadingButton>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(org)}
                            className="flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/settings/org/details/${org.id}`}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <WarningAlert
                            message={`This will permanently delete organization "${org.name}" and all its data. This action cannot be undone.`}
                            onConfirm={() => handleDelete(org.id)}
                            triggerBtn={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Building className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">No organizations found</p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search terms"
                  : "Create your first organization to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOrganization;
