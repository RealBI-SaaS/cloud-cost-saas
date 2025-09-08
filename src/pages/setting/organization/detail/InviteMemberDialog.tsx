import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-buton";
import { Mail, UserPlus } from "lucide-react";
import { ReactEventHandler, useState } from "react";
import { toast } from "sonner";
import organization_service from "@/services/organization_service";

interface InviteMemberDialogProps {
  orgId: string;
  onInviteSent: () => void;
  trigger?: React.ReactNode;
}

const InviteMemberDialog = ({
  orgId,
  onInviteSent,
  trigger,
}: InviteMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
  });
  const handleSendInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if email is valid domain
    if (
      inviteForm.email.trim().lastIndexOf(".") <=
      inviteForm.email.trim().lastIndexOf("@")
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsInviting(true);
      await organization_service.inviteMember({ ...inviteForm, org_id: orgId });
      setInviteForm({ email: "", role: "member" });
      toast.success("Invitation sent successfully");
      setIsOpen(false);
      onInviteSent();
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setInviteForm({ email: "", role: "member" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="text-primary">
        <DialogHeader>
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSendInvitation}>
          <div className="space-y-4">
            {" "}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter email address"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({
                    ...inviteForm,
                    email: e.target.value,
                  })
                }
                className="h-11"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select
                value={inviteForm.role}
                required
                onValueChange={(value) =>
                  setInviteForm({ ...inviteForm, role: value })
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LoadingButton
              loading={isInviting}
              type="submit"
              className="w-full h-11"
            >
              Send Invitation
            </LoadingButton>
          </div>{" "}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
