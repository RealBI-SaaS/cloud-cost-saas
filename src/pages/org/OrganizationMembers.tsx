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
import { UserPlus, Mail, User, MoreHorizontal, Users } from "lucide-react";
//import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/config/axios/axiosInstance";
import { loadEnvFile } from "process";
import { Loading } from "@/components/misc/loading";
import useOrgStore from "@/stores/OrgStore";
import useUserStore from "@/stores/userStore";
import { useUserGroupStore } from "@/stores/UserGroupStore";

// interfaces
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserGroup {
  id: string;
  name: string;
  users: User[];
}

export default function OrganizationMembers() {
  // const { currentOrg } = useOrg();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [newInvite, setNewInvite] = useState({ email: "", role: "member" });
  const user = useUserStore((state) => state.user);
  //for group Dialog
  const [open, setOpen] = useState(false);
  // for user invite
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<{ name: string; users: string[] }>({
    name: "",
    users: [],
  });
  // const [groups, setGroups] = useState<UserGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedGroupForAdd, setSelectedGroupForAdd] =
    useState<UserGroup | null>(null);
  // const [allUsers, setAllUsers] = useState<User[]>([]);
  const fetchGroups = useUserGroupStore((state) => state.fetchGroups);
  const groups = useUserGroupStore((state) => state.groups);
  const createGroup = useUserGroupStore((state) => state.createGroup);
  const updateGroup = useUserGroupStore((state) => state.updateGroup);
  const deleteGroup = useUserGroupStore((state) => state.deleteGroup);
  const addUserToGroup = useUserGroupStore((state) => state.addUserToGroup);
  const removeUserFromGroup = useUserGroupStore(
    (state) => state.removeUserFromGroup,
  );

  // console.log("groups", groups)
  useEffect(() => {
    fetchGroups(currentOrg.id);
    // fetchUsers();
  }, [currentOrg]);

  // async function fetchGroups() {
  //     try {
  //       const res = await axiosInstance.get(`/organizations/user-group/by-org/${currentOrg.id}/`);
  //       setGroups(res.data);
  //     } catch (error) {
  //       console.error("Error fetching groups:", error);
  //       toast.error("Failed to fetch user groups");
  //     }
  //   }

  // async function fetchUsers() {
  //   const res = await axiosInstance.get("/api/users");
  //   setAllUsers(res.data);
  // }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    await createGroup(currentOrg.id, newGroup.name, newGroup.users);
    fetchGroups(currentOrg.id);
    setNewGroup({ name: "", users: [] });
    setOpen(false);
    toast.success("Group created successfully");
    // try {
    //   await axiosInstance.post(`/organizations/user-group/`, {name: newGroup.name,organization: currentOrg.id, users: newGroup.users});
    //   setNewGroup({ name: "", users: [] });
    //   setOpen(false);
    //   fetchGroups();
    //   toast.success("Group created successfully");
    // } catch (error) {
    //   console.error("Error creating group:", error);
    //   toast.error("Failed to create group");
    // }
  }

  async function handleDeleteGroup(groupId: string) {
    await deleteGroup(groupId);
    fetchGroups(currentOrg.id);
  }

  async function handleRemoveUser(groupId: string, userId: string) {
    await removeUserFromGroup(groupId, userId);
    fetchGroups(currentOrg.id);
  }

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
  useEffect(() => {
    if (!currentOrg) return;

    setLoading(true);
    fetchMembers();
    fetchInvitations();
  }, [currentOrg]);

  // Handle member role change
  const handleRoleChange = async (memberId: number, newRole: string) => {
    // Here you would typically send the role update to your API
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `organizations/${currentOrg.id}/members/${memberId}/role/`,
        { role: newRole },
      );

      fetchMembers();
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
        `organizations/${currentOrg.id}/members/${memberId}/`,
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
        `/organizations/invitations/revoke/${id}/`,
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
    setOpen(false); // close dialog on submit

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/organizations/${currentOrg.id}/invite/`,
        { email: newInvite.email, role: newInvite.role },
      );

      fetchInvitations();
      setLoading(false);

      toast.success("Invitation sent successfully");

      //setInvitations((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setNewInvite({ email: "", role: "member" });
    }
  };

  async function handleEditGroupName(groupId: string, newName: string) {
    await updateGroup(groupId, newName);
    fetchGroups(currentOrg.id);
    setEditDialogOpen(false);
    setSelectedGroup(null);
    setEditGroupName("");
    toast.success("Group name updated successfully");
    // try {
    //   await axiosInstance.patch(`/organizations/user-group/${groupId}/`, { name: newName });
    //   setEditDialogOpen(false);
    //   setSelectedGroup(null);
    //   setEditGroupName("");
    //   fetchGroups(currentOrg.id);
    //   toast.success("Group name updated successfully");
    // } catch (error) {
    //   console.error("Error updating group name:", error);
    //   toast.error("Failed to update group name");
    // }
  }

  async function handleAddUserToGroup(groupId: string, userId: string) {
    await addUserToGroup(groupId, userId);
    fetchGroups(currentOrg.id);
    setAddUserDialogOpen(false);
    setSelectedGroupForAdd(null);
    toast.success("User added to group successfully");
    // try {
    //   await axiosInstance.post(`/organizations/user-group/${groupId}/add_user/`, { user_id: userId });
    //   setAddUserDialogOpen(false);
    //   setSelectedGroupForAdd(null);
    //   fetchGroups(currentOrg.id);
    //   toast.success("User added to group successfully");
    // } catch (error) {
    //   console.error("Error adding user to group:", error);
    //   toast.error("Failed to add user to group");
    // }
  }

  if (loading) return <Loading />;
  if (!currentOrg) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-2xl">you have no no organization, get into one!</p>
      </div>
    );
  }

  const hasPriviledges = () => {
    return (
      user.is_staff ||
      currentOrg.role === "admin" ||
      currentOrg.role === "owner"
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
                <span className="text-lg text-primary">{currentOrg.name} </span>
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
                    <div className="space-y-2 space-x-3">
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
      {/* user groups */}
      <Card className="w-full border-none shadow-sm mb-5 mt-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Groups
              </CardTitle>
              <CardDescription>
                Manage user groups and their members.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="!text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Group</DialogTitle>
                  <DialogDescription>
                    Give the group a name and add users to it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGroup}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-name">Group Name</Label>
                      <Input
                        id="group-name"
                        value={newGroup.name}
                        onChange={(e) =>
                          setNewGroup({ ...newGroup, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Add Users</Label>
                      <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                        {members.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={newGroup.users.includes(user.id)}
                              onChange={(e) => {
                                const updatedUsers = e.target.checked
                                  ? [...newGroup.users, user.id]
                                  : newGroup.users.filter(
                                      (id) => id !== user.id,
                                    );
                                setNewGroup({
                                  ...newGroup,
                                  users: updatedUsers,
                                });
                              }}
                            />
                            {user.email}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="!text-white"
                      disabled={!newGroup.name}
                    >
                      Create Group
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {groups.length > 0 ? (
            <div className="space-y-6">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="border border-muted p-4 rounded-none border-l-4 border-l-primary"
                >
                  <div className="flex justify-between items-center ">
                    <h3 className="text-lg font-semibold">{group.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedGroup(group);
                            setEditGroupName(group.name);
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedGroupForAdd(group);
                            setAddUserDialogOpen(true);
                          }}
                        >
                          Add User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-destructive"
                        >
                          Delete Group
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {group?.users?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.users.map((userId) => {
                          const user = members.find((m) => m.id === userId);
                          if (!user) return null;
                          return (
                            <TableRow key={userId}>
                              <TableCell>
                                {user.first_name} {user.last_name}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleRemoveUser(group.id, userId)
                                      }
                                      className="text-destructive"
                                    >
                                      Remove User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No users in this group.
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <p>No user groups created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group Name</DialogTitle>
            <DialogDescription>
              Update the name of your user group.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedGroup) {
                handleEditGroupName(selectedGroup.id, editGroupName);
              }
            }}
          >
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-group-name">Group Name</Label>
                <Input
                  id="edit-group-name"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="!text-white"
                disabled={!editGroupName}
              >
                Update Name
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to Group</DialogTitle>
            <DialogDescription>
              Select a user to add to the group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Users</Label>
              <div className="flex flex-col gap-2 max-h-40 overflow-auto">
                {selectedGroupForAdd &&
                  availableUsers(selectedGroupForAdd).map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() =>
                        handleAddUserToGroup(selectedGroupForAdd.id, user.id)
                      }
                    >
                      {user.first_name} {user.last_name} ({user.email})
                    </Button>
                  ))}
                {selectedGroupForAdd &&
                  availableUsers(selectedGroupForAdd).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No available users to add.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
