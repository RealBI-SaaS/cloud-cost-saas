import React from "react";
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
import { Pencil, Trash2, Check, X, ExternalLink } from "lucide-react";
import { Organization } from "@/services/organization_service";
import { Link } from "react-router-dom";
import { LoadingButton } from "@/components/ui/loading-buton";
import { WarningAlert } from "@/components/WarningAlert";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationTableViewProps {
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

const OrganizationTableView: React.FC<OrganizationTableViewProps> = ({
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

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex w-full gap-4">
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
          <div className="flex w-full gap-4 justify-end">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6" />
          </div>
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
                      <Link
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        to={`/settings/org/details/${org.id}`}
                      >
                        Detail
                        <ExternalLink className="h-3 w-3" />
                      </Link>
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
    </div>
  );
};

export default OrganizationTableView;
