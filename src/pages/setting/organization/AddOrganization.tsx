import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCompany from "@/hooks/useCompany";
import OrganizationService, {
  CreateOrgType,
  Organization,
} from "@/services/organization_service";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-buton";
import OrganizationContext from "@/context/OrganizationContext";

const AddOrganization = ({ variant }: { variant?: string }) => {
  const { setOrganizations, organizations } = useContext(OrganizationContext);

  const [newOrg, setNewOrg] = useState<CreateOrgType>({
    name: "",
    company: "",
  });
  const [open, setOpen] = useState(false);
  const { companies } = useCompany();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newOrg.name || !newOrg.company) {
      toast.error("Please provide both organization name and company.");
      return;
    }

    setLoading(true);
    try {
      const res = await OrganizationService.createOrganization(newOrg);

      // Find company name to attach
      const selectedCompany = companies.find((c) => c.id === newOrg.company);

      setOrganizations((prev) => [
        ...prev,
        { ...res.data, company_name: selectedCompany?.name },
      ]);

      toast.success("Organization created successfully ✅");
      setOpen(false); // close only on success
      setNewOrg({ name: "", company: "" });
    } catch (e) {
      console.error("Error creating org:", e);
      toast.error(e.message + " ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "muted" ? (
          <div className="flex group items-center px-3 py-2 rounded-lg cursor-pointer border border-dashed border-border/40 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground transition-all">
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-180 transition-all" />
            New organization
          </div>
        ) : (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">
            Create a new Organization
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can manage members, roles, and integrations later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <Input
            id="orgName"
            placeholder="Organization Name"
            value={newOrg.name}
            onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            autoFocus
          />

          <Select
            value={newOrg.company}
            onValueChange={(value) => setNewOrg({ ...newOrg, company: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <LoadingButton
            loading={isLoading}
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Creating..." : "Create"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddOrganization;
