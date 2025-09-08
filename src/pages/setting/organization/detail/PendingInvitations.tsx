import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Copy,
  Trash2,
  Mail,
  Calendar,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import organization_service from "@/services/organization_service";
import InviteMemberDialog from "./InviteMemberDialog";
import { WarningAlert } from "@/components/WarningAlert";
import UserTableView, {
  EmailCell,
  ExpiryDateCell,
  InvitationActionsCell,
  InvitationsEmptyState,
  RoleBadgeCell,
  UserTableColumn,
} from "./UserTableView";

interface Invitation {
  id: string;
  invitee_email: string;
  organization: string;
  role: string;
  expires_at: string;
  token: string;
}

interface PendingInvitationsTabProps {
  invitations: Invitation[];
  orgId: string;
  onUpdateInvitations: () => void;
}

const PendingInvitations = ({
  invitations,
  orgId,
  onUpdateInvitations,
}: PendingInvitationsTabProps) => {
  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await organization_service.revokeInvitation(invitationId);
      toast.success("Invitation revoked successfully");
      onUpdateInvitations();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke invitation");
    }
  };

  const pendingInvitations = invitations || [];

  const columns: UserTableColumn[] = [
    {
      key: "email",
      header: "Email",
      render: (invitation) => <EmailCell invitation={invitation} />,
    },
    {
      key: "role",
      header: "Role",
      render: (invitation) => <RoleBadgeCell invitation={invitation} />,
    },
    {
      key: "expires",
      header: "Expires",
      render: (invitation) => <ExpiryDateCell invitation={invitation} />,
    },
    {
      key: "actions",
      header: <p className="text-end">Actions</p>,
      render: (invitation) => (
        <InvitationActionsCell
          invitation={invitation}
          onRevokeInvitation={handleRevokeInvitation}
        />
      ),
    },
  ];

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Pending Invitations</CardTitle>
              <CardDescription>
                Manage invitations sent to join your organization
              </CardDescription>
            </div>
          </div>
          <InviteMemberDialog
            orgId={orgId}
            onInviteSent={onUpdateInvitations}
          />
        </div>
      </CardHeader>

      <CardContent>
        <UserTableView
          data={pendingInvitations}
          columns={columns}
          emptyState={InvitationsEmptyState({
            action: (
              <InviteMemberDialog
                orgId={orgId}
                onInviteSent={onUpdateInvitations}
                trigger={
                  <Button variant="secondary" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Member
                  </Button>
                }
              />
            ),
          })}
        />
      </CardContent>
    </Card>
  );
};

export default PendingInvitations;
