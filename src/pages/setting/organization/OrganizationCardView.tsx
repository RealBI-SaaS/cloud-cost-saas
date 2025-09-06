import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Check,
  X,
  ExternalLink,
  Building,
  Calendar,
  Shield,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { Organization } from "@/services/organization_service";
import { Link } from "react-router-dom";
import { LoadingButton } from "@/components/ui/loading-buton";
import { WarningAlert } from "@/components/WarningAlert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrganizationCardViewProps {
  organizations: Organization[];
  isLoading: boolean;
  editingId: string | null;
  form: Partial<Organization>;
  isLoadingSave: boolean;
  search: string;
  setForm: (form: Partial<Organization>) => void;
  handleEdit: (org: Organization) => void;
  handleSave: (updated_org: any) => void;
  handleCancel: () => void;
  handleDelete: (id: string) => void;
}

const OrganizationCardView: React.FC<OrganizationCardViewProps> = ({
  organizations,
  isLoading,
  editingId,
  form,
  isLoadingSave,
  search,
  setForm,
  handleEdit,
  handleSave,
  handleCancel,
  handleDelete,
}) => {
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
    <div className="w-full">
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
              className="bg-sidebar/50 p-3 border-primary/50 hover:shadow-md transition-shadow group rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                {editingId === org.id ? (
                  <Input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-8 text-sm font-medium flex-1"
                    autoFocus
                  />
                ) : (
                  <h3 className="font-semibold text-lg text-muted-foreground group-hover:text-primary transition-colors flex-1">
                    {org.name}
                  </h3>
                )}
                <div className="flex items-center gap-2">
                  {editingId === org.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-6 w-6 p-0"
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
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </LoadingButton>
                    </>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-border/100"
                      >
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
                              variant="destructive"
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
              </div>

              <Badge
                variant="outline"
                className={`px-2 py-1 text-xs ${getRoleColor(org.role)}`}
              >
                {getRoleIcon(org.role)} {org.role}
              </Badge>

              <div className="mb-2 text-sm text-muted-foreground flex items-center gap-1">
                <Building className="h-3 w-3" />
                <span>Company: {org.company_name}</span>
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {new Date(org.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Updated: {new Date(org.updated_at).toLocaleDateString()}
                </div>
              </div>

              <Button
                className="bg-primary/20 text-primary border shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground"
                asChild
              >
                <Link
                  to={`/settings/org/details/${org.id}`}
                  className="text-xs flex items-center gap-1"
                >
                  View Details
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
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
    </div>
  );
};

export default OrganizationCardView;
