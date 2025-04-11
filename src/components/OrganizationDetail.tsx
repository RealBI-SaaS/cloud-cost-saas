"use client";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Pencil,
  Trash2,
  MoreHorizontal,
  UserPlus,
  Mail,
  ArrowLeft,
  User,
} from "lucide-react";
//import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useOrg } from "@/context/OrganizationContext";
import axiosInstance from "@/axios/axiosInstance";
// Sample data - in a real app, you would fetch this based on the organization ID
const organizations = {
  "org-1": {
    id: "org-1",
    name: "Acme Corp",
    createdAt: new Date("2023-01-15"),
    members: [
      {
        id: 1,
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
      },
      {
        id: 2,
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "member",
      },
      {
        id: 3,
        email: "bob@example.com",
        firstName: "Bob",
        lastName: "Johnson",
        role: "member",
      },
    ],
    invitations: [
      {
        id: 1,
        email: "alex@example.com",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        role: "member",
      },
      {
        id: 2,
        email: "sarah@example.com",
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        role: "admin",
      },
    ],
  },
  "org-2": {
    id: "org-2",
    name: "Startup Project",
    createdAt: new Date("2023-03-20"),
    members: [
      {
        id: 1,
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
      },
      {
        id: 4,
        email: "mike@example.com",
        firstName: "Mike",
        lastName: "Wilson",
        role: "member",
      },
    ],
    invitations: [],
  },
  "org-3": {
    id: "org-3",
    name: "Personal Workspace",
    createdAt: new Date("2022-11-05"),
    members: [
      {
        id: 1,
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
      },
    ],
    invitations: [],
  },
};

export default function OrganizationDetailsPage() {
  const navigate = useNavigate();
  //const params = useParams();
  //const orgId = params.id as string;
  const { currentOrg } = useOrg();
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    console.log(currentOrg);
  }, [currentOrg]);

  // In a real app, you would fetch the organization data based on the ID
  // For this example, we'll use the sample data
  const organization = currentOrg || {
    id: 2,
    name: "Unknown Organization",
    createdAt: new Date(),
    members: [],
    invitations: [],
  };

  useEffect(() => {
    console.log("inv", invitations);
  }, [invitations]);

  const fetchInvitations = async () => {
    try {
      const response = await axiosInstance.get(
        `/organizations/${currentOrg.id}/invitations`,
      );
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

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

    fetchMembers();
    fetchInvitations();
    console.log(members, invitations);
    //Promise.all([fetchMembers(), fetchInvitations()]).finally(() =>
    //);
  }, [currentOrg]);

  console.log(organization, currentOrg);
  //  || {
  //  id: orgId,
  //  name: "Unknown Organization",
  //  createdAt: new Date(),
  //  members: [],
  //  invitations: [],
  //};

  const [orgName, setOrgName] = useState(organization.name);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [newInvite, setNewInvite] = useState({ email: "", role: "member" });

  // Handle organization name update
  const handleUpdateOrg = () => {
    // Here you would typically send the updated org name to your API
    toast("Hi", {
      title: "Organization updated",
      description: "Organization name has been updated successfully.",
    });
    setIsEditingOrg(false);
  };

  // Handle organization deletion
  const handleDeleteOrg = () => {
    // Here you would typically send the delete request to your API
    toast("hi", {
      title: "Organization deleted",
      description: "The organization has been deleted successfully.",
    });
    // Redirect to organizations list or dashboard
    window.location.href = "/account-settings";
  };

  // Handle member role change
  const handleRoleChange = (memberId: number, newRole: string) => {
    // Here you would typically send the role update to your API
    toast("hi", {
      title: "Role updated",
      description: "Member role has been updated successfully.",
    });
  };

  // Handle member removal
  const handleRemoveMember = (memberId: number) => {
    // Here you would typically send the remove request to your API
    toast("hi", {
      title: "Member removed",
      description: "Member has been removed from the organization.",
    });
  };

  // Handle invitation revocation
  const handleRevokeInvitation = (invitationId: number) => {
    // Here you would typically send the revoke request to your API
    toast("hi", {
      title: "Invitation revoked",
      description: "The invitation has been revoked successfully.",
    });
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
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
    fetchInvitations();
    setNewInvite({ email: "", role: "member" });

    // Here you would typically send the invitation to your API
    toast("hi", {
      title: "Invitation sent",
      description: `An invitation has been sent to ${newInvite.email}.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        {/* <div
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          onClick={() => {
            navigate("/account");
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Account Settings
        </div> */}

        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{organization.name}</h1>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        {/* Organization Details Tab */}
        <TabsContent value="details">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                View and manage your organization details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="org-name" className="!text-xs">Organization Name</Label>
                  {!isEditingOrg && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingOrg(true)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
                {isEditingOrg ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id="org-name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                    />
                    <Button size="sm" className="!text-white" onClick={handleUpdateOrg}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOrgName(organization.name);
                        setIsEditingOrg(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="text-lg font-medium">{orgName}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="!text-xs">Created On</Label>
                <div className="!text-lg">
                  {organization && organization.created_at
                    ? format(organization.created_at, "MMM d, yyyy")
                    : "Invalid date"}{" "}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Organization
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the organization and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="!text-white" onClick={handleDeleteOrg}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organization Members</CardTitle>
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
                        <Button type="submit" className="!text-white" disabled={!newInvite.email}>
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
                        <TableCell className="capitalize">
                          {member.role}
                        </TableCell>
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
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card className="w-full">
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
                            ? format(invitation.expires_at, "MMM d, yyyy")
                            : "Invalid date"}{" "}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRevokeInvitation(invitation.id)
                            }
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
                  <h3 className="text-lg font-medium">
                    No pending invitations
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Invite new members to join your organization.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4 !text">
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
                            <Label htmlFor="invite-email-2">Email</Label>
                            <Input
                              id="invite-email-2"
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
                            <Label htmlFor="invite-role-2">Role</Label>
                            <Select
                              value={newInvite.role}
                              onValueChange={(value) =>
                                setNewInvite({ ...newInvite, role: value })
                              }
                            >
                              <SelectTrigger id="invite-role-2">
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
                          <Button type="submit" disabled={!newInvite.email}>
                            Send Invitation
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
