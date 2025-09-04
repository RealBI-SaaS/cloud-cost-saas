import React, { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2, Check, X, Search } from "lucide-react";
import { Organization } from "@/services/organization_service";
import AddOrganization from "./organization/AddOrganization";
import useOrganizations from "@/hooks/useOrganization";

const CompanyOrganization = () => {
  const { organizations, isLoading, setReload } = useOrganizations();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Organization>>({});
  const [search, setSearch] = useState("");

  const handleEdit = (org: Organization) => {
    setEditingId(org.id);
    setForm(org);
  };

  const handleSave = () => {
    console.log("Saving:", form);
    // Call API -> optimistic update here
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  const handleDelete = (id: string) => {
    console.log("Deleting:", id);
    // Call API -> optimistic delete here
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
            <AddOrganization onCreate={setReload()} />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loading />
            </div>
          ) : filteredOrgs?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
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
                    <TableCell>
                      {editingId === org.id ? (
                        <Input
                          value={form.company_name || ""}
                          onChange={(e) =>
                            setForm({ ...form, company_name: e.target.value })
                          }
                        />
                      ) : (
                        org.company_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === org.id ? (
                        <Input
                          value={form.role || ""}
                          onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                          }
                        />
                      ) : (
                        <Badge variant="secondary">{org.role}</Badge>
                      )}
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
                          <Button size="sm" onClick={handleSave}>
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(org)}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(org.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
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
