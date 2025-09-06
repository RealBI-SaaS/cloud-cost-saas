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
import organization_service from "@/services/organization_service";

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
  const copyInviteLink = async (token = "invalid_token") => {
    const inviteLink = `${window.location.origin}/accept-invitation/${token}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await organization_service.revokeInvitation(invitationId);
      toast.success("Invitation revoked successfully");
      onUpdateInvitations();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke invitation");
    }
  };

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
        </div>
      </CardHeader>

      <CardContent>
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
            {invitations.map((invitation) => (
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
                    {
                      <>
                        <Button
                          variant="outline"
                          onClick={() => copyInviteLink(invitation.token)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Invite Link
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                          className="h-8 gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          Resend
                        </Button> */}
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
                    }
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
