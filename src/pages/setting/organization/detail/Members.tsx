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
import { UserCheck, Shield, UserX } from "lucide-react";
import { toast } from "sonner";
import organization_service from "@/services/organization_service";
import { WarningAlert } from "@/components/WarningAlert";
import InviteMemberDialog from "./InviteMemberDialog";

interface Member {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface MembersTabProps {
  members: Member[];
  orgId: string;
  onUpdateMember: () => void;
}

const Members = ({ members, orgId, onUpdateMember }: MembersTabProps) => {
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      await organization_service.updateMemberRole(orgId, memberId, newRole);
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
          <InviteMemberDialog orgId={orgId} onInviteSent={onUpdateMember} />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.first_name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.first_name + " " + member.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    disabled={member.role === "owner"}
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
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-right">
                  <WarningAlert
                    message="Are you sure you want to remove this member?"
                    onConfirm={() => handleRemoveMember(member.id)}
                    triggerBtn={
                      <Button
                        disabled={member.role === "owner"}
                        variant="destructive"
                        size="sm"
                      >
                        <UserX className="h-4 w-4" />
                        Remove
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Members;
