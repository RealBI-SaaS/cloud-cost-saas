import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building } from "lucide-react";
import organization_service, {
  Organization,
} from "@/services/organization_service";
import AddOrganization from "./AddOrganization";

import { toast } from "sonner";
import OrganizationTableView from "./OrganizationTableView";
import OrganizationCardView from "./OrganizationCardView";
import LayoutSwitcher from "./LayoutSwitcher";
import OrganizationContext from "@/context/OrganizationContext";

const CompanyOrganization = () => {
  const { organizations, isLoading, setOrganizations } =
    useContext(OrganizationContext);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Organization>>({});
  const [search, setSearch] = useState("");
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [layout, setLayout] = useState<"table" | "card">("card");

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

  return (
    <div className="w-full ">
      <Card className="border-none  shadow-none">
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
            <AddOrganization />
            <LayoutSwitcher currentLayout={layout} onLayoutChange={setLayout} />
          </div>
        </CardHeader>

        <CardContent>
          {layout === "table" ? (
            <OrganizationTableView
              organizations={organizations}
              isLoading={isLoading}
              editingId={editingId}
              form={form}
              isLoadingSave={isLoadingSave}
              search={search}
              setForm={setForm}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleDelete={handleDelete}
            />
          ) : (
            <OrganizationCardView
              organizations={organizations}
              isLoading={isLoading}
              editingId={editingId}
              form={form}
              isLoadingSave={isLoadingSave}
              search={search}
              setForm={setForm}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyOrganization;
