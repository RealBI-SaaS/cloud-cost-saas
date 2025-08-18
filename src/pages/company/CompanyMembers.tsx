"usC client";
import useCompany from "@/stores/CompanyStore";
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
import { UserPlus, Mail, User, MoreHorizontal, Users } from "lucide-react";
//import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/config/axios/axiosInstance";
import { loadEnvFile } from "process";
import { Loading } from "@/components/misc/loading";
// import useOrgStore from "@/stores/OrgStore";
import useUserStore from "@/stores/userStore";
// import { useUserGroupStore } from "@/stores/UserGroupStore";

// interfaces
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
//
// interface UserGroup {
//   id: string;
//   name: string;
//   users: User[];
// }
//
export default function CompanyMembers() {
  // const { currentOrg } = useOrg();
  // const currentOrg = useOrgStore((state) => state.currentOrg);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [newInvite, setNewInvite] = useState({ email: "", role: "member" });
  const user = useUserStore((state) => state.user);
  //for group Dialog
  // const [open, setOpen] = useState(false);
  // for user invite
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const userComp = useCompany((state) => state.userComp);
  const fetchUserCompany = useCompany((state) => state.fetchUserCompany);

  const fetchInvitations = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/${userComp.id}/invitations`,
      );
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/${userComp.id}/members/`,
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    if (!userComp) return;

    setLoading(true);
    fetchMembers();
    fetchInvitations();
  }, [userComp]);

  // Handle member role change
  const handleRoleChange = async (memberId: number, newRole: string) => {
    // Here you would typically send the role update to your API
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `company/${userComp.id}/members/${memberId}/role/`,
        { role: newRole },
      );

      fetchMembers();
      fetchUserCompany();
      setLoading(false);

      toast.success("Memeber's role changed successfully");
      //setInvitations((prev) => [...prev, response.data]);
    } catch (error) {
      setLoading(false);
      console.error("Error changing role:", error);
      toast.error("Failed to change role");
    }
    //toast.success("Role updated successfully");
  };

  // Handle member removal
  const handleRemoveMember = async (memberId: number) => {
    // Here you would typically send the remove request to your API
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `company/${userComp.id}/members/${memberId}/`,
      );

      fetchMembers();
      setLoading(false);

      toast.success("Memeber removed from organization");
      //setInvitations((prev) => [...prev, response.data]);
    } catch (error) {
      setLoading(false);
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }

    //toast.success("Member removed successfully");
  };

  // Handle invitation revocation
  const handleRevokeInvitation = async (id: string) => {
    // Here you would typically send the revoke request to your API

    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/company/invitations/revoke/${id}/`,
      );

      fetchInvitations();
      setLoading(false);

      toast.success("Invitation revoked successfully");
      //setInvitations((prev) => [...prev, response.data]);
    } catch (error) {
      setLoading(false);
      console.error("Error revoking invitation:", error);
      toast.error("Failed to revoke invitation");
    }
  };

  // Handle new invitation
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newInvite);
    setInviteDialogOpen(false); // close dialog on submit

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/company/${userComp.id}/invite/`,
        { email: newInvite.email, role: newInvite.role },
      );

      fetchInvitations();

      toast.success("Invitation sent successfully");

      //setInvitations((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setNewInvite({ email: "", role: "member" });
      setLoading(false);
    }
  };

  if (loading || !userComp) return <Loading />;
  // if (!currentOrg) {
  //   return (
  //     <div className="flex flex-col h-full items-center justify-center">
  //       <p className="text-2xl">you have no no organization, get into one!</p>
  //     </div>
  //   );
  // }
  //
  const hasPriviledges = () => {
    return (
      user.is_staff ||
      userComp.membership.role === "admin" ||
      userComp.membership.role === "owner"
    );
  };

  const availableUsers = (group: UserGroup) => {
    return members.filter((member) => !group.users.includes(member.id));
  };

  return (
    <div className="container mx-auto px-4 py-10 ">
      <Card className="w-full border-none shadow-sm mb-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Members in{" "}
                <span className="text-lg text-primary">{userComp.name} </span>
              </CardTitle>
              <CardDescription>
                Manage members of your organization.
              </CardDescription>
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              {hasPriviledges() && (
                <DialogTrigger asChild>
                  <Button
                    className="!text-white"
                    onClick={() => setInviteDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="dark:text-foreground">
                    Invite New User
                  </DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteUser}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2 dark:text-foreground">
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
                    <div className="space-y-2 space-x-3 dark:text-foreground">
                      <Label htmlFor="invite-role">Role</Label>
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant={
                            newInvite.role === "member" ? "default" : "outline"
                          }
                          onClick={() =>
                            setNewInvite({ ...newInvite, role: "member" })
                          }
                        >
                          Member
                        </Button>
                        <Button
                          type="button"
                          variant={
                            newInvite.role === "admin" ? "default" : "outline"
                          }
                          onClick={() =>
                            setNewInvite({ ...newInvite, role: "admin" })
                          }
                        >
                          Admin
                        </Button>
                      </div>{" "}
                      {/* <Select
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
                      </Select> */}
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
                  {hasPriviledges() && (
                    <TableHead className="w-[100px]">Actions</TableHead>
                  )}
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
                    {hasPriviledges() && (
                      <TableCell>
                        {member.role !== "owner" ? (
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
                                    member.role === "admin"
                                      ? "member"
                                      : "admin",
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
                        ) : (
                          <p></p>
                        )}
                      </TableCell>
                    )}
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
