import React, { useState } from "react";
import { Loading } from "@/components/misc/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Check, X, Search, Forward } from "lucide-react";
import organization_service, {
  Organization,
} from "@/services/organization_service";
import AddOrganization from "./AddOrganization";
import useOrganizations from "@/hooks/useOrganization";
import { OrganizationSelector } from "@/components/sidebars/homeSidebarComponents/organization-selector";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-buton";
import { WarningAlert } from "@/components/WarningAlert";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyOrganization = () => {
  const { organizations, isLoading, setOrganizations } = useOrganizations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Organization>>({});
  const [search, setSearch] = useState("");

  const handleEdit = (org: Organization) => {
    setEditingId(org.id);
    setForm(org);
  };
  const [isLoadingSave, setIsLoadingSave] = useState(false);

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

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">
            Organizations |Total:{organizations?.length}{" "}
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <AddOrganization
              onCreate={setOrganizations}
              organizations={organizations}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div className="flex w-full gap-4">
                  <Skeleton className="h-4 w-5/6 " />
                  <Skeleton className="h-4 w-1/6" />
                </div>
              ))}
              <div className="flex w-full gap-4 justify-end">
                <Skeleton className="h-4 w-1/6 " />
                <Skeleton className="h-4 w-1/6" />
              </div>
            </div>
          ) : filteredOrgs?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div>Name</div>
                  </TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.map((org: Organization) => (
                  <TableRow
                    key={org.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {editingId === org.id ? (
                        <Input
                          value={form.name || ""}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      ) : (
                        org.name
                      )}
                    </TableCell>
                    <TableCell>{org.company_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{org.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(org.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      {editingId === org.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
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
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </LoadingButton>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="link">
                            <Forward className="h-4 w-4 mr-1" /> Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(org)}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>

                          <WarningAlert
                            message={`This will permanently delete organization ${org.name} and its data. This action cannot be undone.`}
                            onConfirm={() => handleDelete(org.id)}
                            triggerBtn={
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            }
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              No organizations found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOrganization;
