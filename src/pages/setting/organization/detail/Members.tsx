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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-buton";
import { UserCheck, Shield, UserX, UserPlus } from "lucide-react";
import { toast } from "sonner";
import organization_service, {
  MemberType,
  Organization,
} from "@/services/organization_service";
import { WarningAlert } from "@/components/WarningAlert";
import InviteMemberDialog from "./InviteMemberDialog";
import UserTableView, {
  MemberCell,
  MembersEmptyState,
  RemoveMemberCell,
  RoleSelectCell,
  UserTableColumn,
} from "./UserTableView";
interface MembersTabProps {
  members: MemberType[];
  organization: Organization;
  onUpdateMember: () => void;
}
const Members = ({
  members,
  organization,
  onUpdateMember,
}: MembersTabProps) => {
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      await organization_service.updateMemberRole(
        organization.id,
        memberId,
        newRole
      );
      toast.success("Member role updated successfully");
      onUpdateMember();
    } catch (err: any) {
      toast.error(err.message || "Failed to update member role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // await organization_service.removeMember(orgId, memberId);
      toast.success("Member removed successfully");
      onUpdateMember();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const columns: UserTableColumn[] = [
    {
      key: "member",
      header: "Member",
      render: (member) => <MemberCell member={member} />,
    },
    {
      key: "organization",
      header: "Organization",
      render: () => organization.name,
    },
    {
      key: "role",
      header: "Role",
      render: (member) => (
        <RoleSelectCell
          member={member}
          organization={organization}
          onUpdateMemberRole={handleUpdateMemberRole}
        />
      ),
    },
    {
      key: "actions",
      header: <p className="text-end">Actions</p>,
      render: (member) => (
        <RemoveMemberCell member={member} onRemoveMember={handleRemoveMember} />
      ),
    },
  ];

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Organization Members</CardTitle>
              <CardDescription>
                Manage members and their roles in your organization
              </CardDescription>
            </div>
          </div>
          <InviteMemberDialog
            orgId={organization.id}
            onInviteSent={onUpdateMember}
          />
        </div>
      </CardHeader>

      <CardContent>
        <UserTableView
          data={members}
          columns={columns}
          emptyState={MembersEmptyState({
            action: (
              <InviteMemberDialog
                orgId={organization.id}
                onInviteSent={onUpdateMember}
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

export default Members;
