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
  const copyInviteLink = async (token = "invalid_token") => {
    const inviteLink = `${window.location.origin}/accept-invitation/${token}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };Card
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
        {pendingInvitations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvitations.map((invitation) => (
                <TableRow key={invitation.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {invitation.invitee_email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {invitation.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => copyInviteLink(invitation.token)}
                        className="gap-2"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>

                      <WarningAlert
                        message="Are you sure you want to revoke this invitation?"
                        onConfirm={() => handleRevokeInvitation(invitation.id)}
                        triggerBtn={
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Revoke
                          </Button>
                        }
                      />
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeInvitation(invitation.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Revoke
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 space-y-6 border border-dashed border-border rounded-lg">
            <div className="flex justify-center">
              <div className="p-4 bg-muted/30 rounded-full">
                <Mail className="h-12 w-12 text-muted-foreground opacity-60" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No pending invitations</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You haven't sent any invitations yet. Invite members to join
                your organization.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-4">
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingInvitations;
