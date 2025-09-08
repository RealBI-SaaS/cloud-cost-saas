import useOrganizations from "@/hooks/useOrganization";
import React, { useEffect, useState, useMemo } from "react";
import organization_service, {
  MemberType,
} from "@/services/organization_service";
import { toast } from "sonner";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, UserPlus, Clock, Mail } from "lucide-react";
import InviteMemberDialog from "./organization/detail/InviteMemberDialog";
import UserTableView, {
  MemberCell,
  MembersEmptyState,
  RemoveMemberCell,
  RoleSelectCell,
  UserTableColumn,
  EmailCell,
  RoleBadgeCell,
  ExpiryDateCell,
  InvitationActionsCell,
  InvitationsEmptyState,
} from "./organization/detail/UserTableView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Extend MemberType to include organization name
interface ExtendedMemberType extends MemberType {
  org_name: string;
  org_id: string;
}

const CompanyMembers = () => {
  const [members, setMembers] = useState<ExtendedMemberType[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<MemberType[]>(
    []
  );
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const { organizations, isLoading, error } = useOrganizations();

  // Filter unique members by email address
  const uniqueMembers = useMemo(() => {
    const seenEmails = new Set();
    return members.filter((member) => {
      if (seenEmails.has(member.email)) {
        return false;
      }
      seenEmails.add(member.email);
      return true;
    });
  }, [members]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!organizations.length) {
        setIsLoadingMembers(false);
        setIsLoadingInvitations(false);
        return;
      }

      // Fetch members from all organizations
      setIsLoadingMembers(true);
      try {
        const allMembersPromises = organizations.map(async (org) => {
          try {
            const response = await organization_service.getMembers(org.id);
            return response.data.map((member: MemberType) => ({
              ...member,
              org_name: org.name,
              org_id: org.id,
            }));
          } catch (error) {
            console.error(`Failed to fetch members for org ${org.id}:`, error);
            return [];
          }
        });

        const allMembersResults = await Promise.all(allMembersPromises);
        const flattenedMembers = allMembersResults.flat();
        setMembers(flattenedMembers);
      } catch (error) {
        toast.error("Failed to load members");
        console.error("Error fetching members:", error);
      } finally {
        setIsLoadingMembers(false);
      }

      // Fetch pending invitations from all organizations
      setIsLoadingInvitations(true);
      try {
        const allInvitationsPromises = organizations.map(async (org) => {
          try {
            const response = await organization_service.getMemberInvitations(
              org.id
            );
            return response.data.map((invitation: MemberType) => ({
              ...invitation,
              organization: org.name,
              org_id: org.id,
            }));
          } catch (error) {
            console.error(
              `Failed to fetch invitations for org ${org.id}:`,
              error
            );
            return [];
          }
        });

        const allInvitationsResults = await Promise.all(allInvitationsPromises);
        const flattenedInvitations = allInvitationsResults.flat();
        setPendingInvitations(flattenedInvitations);
      } catch (error) {
        toast.error("Failed to load pending invitations");
        console.error("Error fetching invitations:", error);
      } finally {
        setIsLoadingInvitations(false);
      }
    };

    if (!isLoading) {
      fetchAllData();
    }
  }, [organizations, isLoading]);

  const handleUpdateMemberRole = async (
    orgId: string,
    memberId: string,
    newRole: string
  ) => {
    try {
      await organization_service.updateMemberRole(orgId, memberId, newRole);
      toast.success("Member role updated successfully");

      // Update local state
      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update member role");
    }
  };

  const handleRemoveMember = async (orgId: string, memberId: string) => {
    // try {
    //   await organization_service.removeMembers(orgId, memberId);
    //   toast.success("Member removed successfully");
    //   // Update local state
    //   setMembers((prev) => prev.filter((member) => member.id !== memberId));
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to remove member");
    // }
  };

  const handleRevokeInvitation = async (
    orgId: string,
    invitationId: string
  ) => {
    try {
      await organization_service.revokeInvitation(invitationId);
      toast.success("Invitation revoked successfully");

      // Update local state
      setPendingInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke invitation");
    }
  };

  const handleUpdateData = () => {
    // Refetch all data when something changes
    if (!isLoading) {
      setIsLoadingMembers(true);
      setIsLoadingInvitations(true);

      const fetchAllData = async () => {
        try {
          // Fetch members
          const allMembersPromises = organizations.map(async (org) => {
            try {
              const response = await organization_service.getMembers(org.id);
              return response.data.map((member: MemberType) => ({
                ...member,
                org_name: org.name,
                org_id: org.id,
              }));
            } catch (error) {
              console.error(
                `Failed to fetch members for org ${org.id}:`,
                error
              );
              return [];
            }
          });

          const allMembersResults = await Promise.all(allMembersPromises);
          const flattenedMembers = allMembersResults.flat();
          setMembers(flattenedMembers);

          // Fetch invitations
          const allInvitationsPromises = organizations.map(async (org) => {
            try {
              const response = await organization_service.getMemberInvitations(
                org.id
              );
              return response.data.map((invitation: MemberType) => ({
                ...invitation,
                organization: org.name,
                org_id: org.id,
              }));
            } catch (error) {
              console.error(
                `Failed to fetch invitations for org ${org.id}:`,
                error
              );
              return [];
            }
          });

          const allInvitationsResults = await Promise.all(
            allInvitationsPromises
          );
          const flattenedInvitations = allInvitationsResults.flat();
          setPendingInvitations(flattenedInvitations);
        } catch (error) {
          toast.error("Failed to refresh data");
          console.error("Error refreshing data:", error);
        } finally {
          setIsLoadingMembers(false);
          setIsLoadingInvitations(false);
        }
      };

      fetchAllData();
    }
  };

  const memberColumns: UserTableColumn[] = [
    {
      key: "member",
      header: "Member",
      render: (member: ExtendedMemberType) => <MemberCell member={member} />,
    },
    {
      key: "organization",
      header: "Organization",
      render: (member: ExtendedMemberType) => <span>{member.org_name}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (member: ExtendedMemberType) => (
        <RoleSelectCell
          member={member}
          organization={{ id: member.org_id, name: member.org_name }}
          onUpdateMemberRole={(memberId, newRole) =>
            handleUpdateMemberRole(member.org_id, memberId, newRole)
          }
        />
      ),
    },
    {
      key: "actions",
      header: <p className="text-end">Actions</p>,
      render: (member: ExtendedMemberType) => (
        <RemoveMemberCell
          member={member}
          onRemoveMember={(memberId) =>
            handleRemoveMember(member.org_id, memberId)
          }
        />
      ),
    },
  ];

  const invitationColumns: UserTableColumn[] = [
    {
      key: "email",
      header: "Email",
      render: (invitation: MemberType & { org_id: string }) => (
        <EmailCell invitation={invitation} />
      ),
    },
    {
      key: "organization",
      header: "Organization",

      render: (invitation: MemberType & { org_id: string }) => (
        <span>{invitation.organization}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (invitation: MemberType & { org_id: string }) => (
        <RoleBadgeCell invitation={invitation} />
      ),
    },
    {
      key: "expires",
      header: "Expires",
      render: (invitation: MemberType & { org_id: string }) => (
        <ExpiryDateCell invitation={invitation} />
      ),
    },
    {
      key: "actions",
      header: <p className="text-end">Actions</p>,
      render: (invitation: MemberType & { org_id: string }) => (
        <InvitationActionsCell
          invitation={invitation}
          onRevokeInvitation={() =>
            handleRevokeInvitation(invitation.org_id, invitation.id)
          }
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Members</h1>
          <p className="text-muted-foreground">
            Manage members and invitations across all organizations
          </p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="members" className="flex gap-2">
            <UserCheck className="h-4 w-4" />
            Members
            <Badge variant="secondary" className="ml-1">
              {uniqueMembers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex gap-2">
            <Clock className="h-4 w-4" />
            Pending Invitations
            <Badge variant="secondary" className="ml-1">
              {pendingInvitations.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

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
                      All Organization Members
                    </CardTitle>
                    <CardDescription>
                      Manage members across all your organizations (
                      {uniqueMembers.length} unique members)
                    </CardDescription>
                  </div>
                </div>
                {organizations.length > 0 && (
                  <InviteMemberDialog
                    orgId={organizations[0].id}
                    onInviteSent={handleUpdateData}
                  />
                )}
              </div>
            </CardHeader>

            <CardContent>
              <UserTableView
                data={uniqueMembers}
                columns={memberColumns}
                emptyState={MembersEmptyState({
                  action:
                    organizations.length > 0 ? (
                      <InviteMemberDialog
                        orgId={organizations[0].id}
                        onInviteSent={handleUpdateData}
                        trigger={
                          <Button variant="secondary" className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Invite Member
                          </Button>
                        }
                      />
                    ) : undefined,
                })}
              />
            </CardContent>
          </Card>
        </TabsContent>

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
                      Manage invitations sent across all your organizations
                    </CardDescription>
                  </div>
                </div>
                {organizations.length > 0 && (
                  <InviteMemberDialog
                    orgId={organizations[0].id}
                    onInviteSent={handleUpdateData}
                  />
                )}
              </div>
            </CardHeader>

            <CardContent>
              <UserTableView
                data={pendingInvitations}
                columns={invitationColumns}
                emptyState={InvitationsEmptyState({
                  action:
                    organizations.length > 0 ? (
                      <InviteMemberDialog
                        orgId={organizations[0].id}
                        onInviteSent={handleUpdateData}
                        trigger={
                          <Button variant="secondary" className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Invite Member
                          </Button>
                        }
                      />
                    ) : undefined,
                })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyMembers;
