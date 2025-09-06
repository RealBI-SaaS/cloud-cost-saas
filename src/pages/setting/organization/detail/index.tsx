import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Users,
  Mail,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  UserPlus,
  Shield,
  Building,
  Calendar,
  Save,
  SaveAll,
  LeafyGreen,
  MailIcon,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import organization_service, {
  Organization,
} from "@/services/organization_service";
import { LoadingButton } from "@/components/ui/loading-buton";
import { ErrorBar } from "recharts";
import OrganizationInfo from "./OrganizationInfo";

interface Member {
  id: string;
  role: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  created_at: string;
  expires_at: string;
  invited_by: string;
}

const OrganizationDetail = () => {
  const { org_id } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
  });

  useEffect(() => {
    loadOrganizationData();
  }, [org_id]);

  const loadOrganizationData = async () => {
    try {
      setIsLoading(true);
      const [orgRes, membersRes, invitationsRes] = await Promise.all([
        organization_service.getOrganization(org_id!),
        organization_service.getOrganizationMembers(org_id!),
        organization_service.getOrganizationMemberInvitations(org_id!),
      ]);

      setOrganization(orgRes.data);
      setMembers(membersRes.data);
      setInvitations(invitationsRes.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load organization data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    // try {
    //   setIsInviting(true);
    //   await organization_service.inviteMember(org_id!, inviteForm);
    //   setInviteForm({ email: "", role: "member" });
    //   toast.success("Invitation sent successfully");
    //   loadOrganizationData(); // Refresh invitations list
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to send invitation");
    // } finally {
    //   setIsInviting(false);
    // }
  };

  const handleResendInvitation = async (invitationId: string) => {
    // try {
    //   await organization_service.resendInvitation(org_id!, invitationId);
    //   toast.success("Invitation resent successfully");
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to resend invitation");
    // }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    // try {
    //   await organization_service.revokeInvitation(org_id!, invitationId);
    //   toast.success("Invitation revoked successfully");
    //   setInvitations(invitations.filter((inv) => inv.id !== invitationId));
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to revoke invitation");
    // }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    // try {
    //   await organization_service.updateMemberRole(org_id!, memberId, newRole);
    //   toast.success("Member role updated successfully");
    //   loadOrganizationData(); // Refresh members list
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to update member role");
    // }
  };

  const handleRemoveMember = async (memberId: string) => {
    // try {
    //   await organization_service.removeMember(org_id!, memberId);
    //   toast.success("Member removed successfully");
    //   setMembers(members.filter((member) => member.id !== memberId));
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to remove member");
    // }
  };

  const copyInviteLink = async () => {
    // This would typically generate a shareable link
    const inviteLink = `${window.location.origin}/invite/${org_id}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{organization?.name}</h1>
          </div>
        </div>
      </div>
      {/* Organization Details Card */}
      <OrganizationInfo
        organization={organization}
        onUpdate={setOrganization}
      />
      {/* Tabs for Members and Invitations */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="members"
            className="flex items-center gap-2 rounded-md px-4 py-2"
          >
            <Users className="h-4 w-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger
            value="invitations"
            className="flex items-center gap-2 rounded-md px-4 py-2"
          >
            <MailIcon className="h-4 w-4" />
            Pending Invites (
            {invitations.filter((inv) => inv.status === "pending").length})
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Organization Members
                    </CardTitle>
                    <CardDescription>
                      Manage members and their roles in your organization
                    </CardDescription>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
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
                          onValueChange={(value) =>
                            setInviteForm({ ...inviteForm, role: value })
                          }
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <LoadingButton
                        loading={isInviting}
                        onClick={handleSendInvitation}
                        className="w-full h-11"
                      >
                        Send Invitation
                      </LoadingButton>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleUpdateMemberRole(member.id, value)
                          }
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                Admin
                              </div>
                            </SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(member.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive flex items-center gap-2"
                            >
                              <UserX className="h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Pending Invitations
                    </CardTitle>
                    <CardDescription>
                      Manage invitations sent to join your organization
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={copyInviteLink}
                  className="gap-2"
                >
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
                  {invitations.map((invitation) => (
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
                                onClick={() =>
                                  handleResendInvitation(invitation.id)
                                }
                                className="h-8 gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                Resend
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRevokeInvitation(invitation.id)
                                }
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDetail;
