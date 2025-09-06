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
import { Clock, Copy, Trash2, Mail, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
  expires_at: string;
  invited_by: string;
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
  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/invite/${orgId}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // await organization_service.resendInvitation(orgId, invitationId);
      toast.success("Invitation resent successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend invitation");
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      // await organization_service.revokeInvitation(orgId, invitationId);
      toast.success("Invitation revoked successfully");
      onUpdateInvitations();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke invitation");
    }
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );

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
          <Button variant="outline" onClick={copyInviteLink} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy Invite Link
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvitations.map((invitation) => (
              <TableRow key={invitation.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {invitation.email}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {invitation.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invitation.status === "pending"
                        ? "outline"
                        : invitation.status === "accepted"
                        ? "default"
                        : "destructive"
                    }
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {invitation.status === "pending" && (
                      <Clock className="h-3 w-3" />
                    )}
                    {invitation.status === "accepted" && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
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
                    {invitation.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="h-8 gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          Resend
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          className="h-8 gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingInvitations;
