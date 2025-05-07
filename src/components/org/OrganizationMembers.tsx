"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Mail, User, MoreHorizontal } from "lucide-react";
import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/axios/axiosInstance";
import { loadEnvFile } from "process";
import { Loading } from "@/misc/loading";

export default function OrganizationMembers() {
  const { currentOrg } = useOrg();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [newInvite, setNewInvite] = useState({ email: "", role: "member" });

  useEffect(() => {
    if (!currentOrg) return;

    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get(
          `/organizations/organization/${currentOrg.id}/members/`,
        );
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    const fetchInvitations = async () => {
      try {
        const response = await axiosInstance.get(
          `/organizations/${currentOrg.id}/invitations`,
        );
        setInvitations(response.data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchMembers();
    fetchInvitations();
  }, [currentOrg]);

  // Handle member role change
  const handleRoleChange = (memberId: number, newRole: string) => {
    // Here you would typically send the role update to your API
    toast.success("Role updated successfully");
  };

  // Handle member removal
  const handleRemoveMember = (memberId: number) => {
    // Here you would typically send the remove request to your API
    toast.success("Member removed successfully");
  };

  // Handle invitation revocation
  const handleRevokeInvitation = (invitationId: number) => {
    // Here you would typically send the revoke request to your API
    toast.success("Invitation revoked successfully");
  };

  // Handle new invitation
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        `/organizations/${currentOrg.id}/invite/`,
        { email: newInvite.email },
      );
      setInvitations((prev) => [...prev, response.data]);
      toast.success("Invitation sent successfully");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    }
    setNewInvite({ email: "", role: "member" });
  };
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-10 ">
      <Card className="w-full border-none shadow-sm mb-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Members in{" "}
                <span className="text-lg text-primary">{currentOrg.name} </span>
              </CardTitle>
              <CardDescription>
                Manage members of your organization.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="!text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteUser}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="user@example.com"
                        value={newInvite.email}
                        onChange={(e) =>
                          setNewInvite({
                            ...newInvite,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invite-role">Role</Label>
                      <Select
                        value={newInvite.role}
                        onValueChange={(value) =>
                          setNewInvite({ ...newInvite, role: value })
                        }
                      >
                        <SelectTrigger id="invite-role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="!text-white"
                      disabled={!newInvite.email}
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.first_name} {member.last_name}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleRoleChange(
                                member.id,
                                member.role === "admin" ? "member" : "admin",
                              )
                            }
                          >
                            Change to{" "}
                            {member.role === "admin" ? "Member" : "Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No members</h3>
              <p className="text-muted-foreground mt-1">
                Invite members to join your organization.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* <hr /> */}
      {/*pending invitations */}
      <Card className="w-full mt-5 shadow-sm border-none mt-5">
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Manage invitations to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.invitee_email}</TableCell>
                    <TableCell className="capitalize">
                      {invitation.role}
                    </TableCell>
                    <TableCell>
                      {invitation && invitation.expires_at
                        ? new Date(invitation.expires_at).toLocaleDateString()
                        : "Invalid date"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeInvitation(invitation.id)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pending invitations</h3>
              <p className="text-muted-foreground mt-1">
                Invite new members to join your organization above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
