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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  UserX,
  Copy,
  Trash2,
  Calendar,
  Mail,
  UserPlus,
  Clock,
  Group,
  User2,
} from "lucide-react";
import { WarningAlert } from "@/components/WarningAlert";
import { toast } from "sonner";
import { ReactNode } from "react";

export interface UserTableColumn {
  key: string;
  header: ReactNode;
  render: (item: any) => React.ReactNode;
}

export interface UserTableViewProps {
  data: any[];
  columns: UserTableColumn[];
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
}

const UserTableView = ({ data, columns, emptyState }: UserTableViewProps) => {
  if (data.length === 0 && emptyState) {
    return (
      <div className="text-center py-12 space-y-6 border border-dashed border-border rounded-lg">
        <div className="flex justify-center">
          <div className="p-4 bg-muted/30 rounded-full">{emptyState.icon}</div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{emptyState.title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {emptyState.description}
          </p>
        </div>
        {emptyState.action && (
          <div className="flex justify-center gap-3 pt-4">
            {emptyState.action}
          </div>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id || index} className="hover:bg-muted/50">
            {columns.map((column) => (
              <TableCell key={column.key}>{column.render(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTableView;

// Helper components for common use cases

// Member row components
export const MemberCell = ({ member }: { member: any }) => (
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
      <p className="text-sm text-muted-foreground">{member.email}</p>
    </div>
  </div>
);

export const RoleSelectCell = ({
  member,
  organization,
  onUpdateMemberRole,
}: {
  member: any;
  organization: any;
  onUpdateMemberRole: (memberId: string, newRole: string) => void;
}) =>
  organization.role === "member" ? (
    member.role
  ) : (
    <Select
      disabled={member.role === "owner"}
      onValueChange={(value) => onUpdateMemberRole(member.id, value)}
    >
      <SelectTrigger className="w-28 h-8">
        <SelectValue
          placeholder={
            member.role.charAt(0).toUpperCase() + member.role.slice(1)
          }
        />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a role</SelectLabel>

          <SelectItem value="admin">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </div>
          </SelectItem>
          <SelectItem value="member">
            <User2 className="h-4 w-4 mr-2" />
            Member
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

export const RemoveMemberCell = ({
  member,
  onRemoveMember,
}: {
  member: any;

  onRemoveMember: (memberId: string) => void;
}) => (
  <div className="text-right">
    <WarningAlert
      message="Are you sure you want to remove this member?"
      onConfirm={() => onRemoveMember(member.id)}
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
  </div>
);

// Invitation row components
export const EmailCell = ({ invitation }: { invitation: any }) => (
  <span className="font-medium">{invitation.invitee_email}</span>
);

export const RoleBadgeCell = ({ invitation }: { invitation: any }) => (
  <Badge variant="secondary" className="font-normal">
    {invitation.role}
  </Badge>
);

export const ExpiryDateCell = ({ invitation }: { invitation: any }) => (
  <div className="flex items-center gap-2 text-sm">
    <Calendar className="h-4 w-4 text-muted-foreground" />
    {new Date(invitation.expires_at).toLocaleDateString()}
  </div>
);

export const InvitationActionsCell = ({
  invitation,
  onRevokeInvitation,
}: {
  invitation: any;
  onRevokeInvitation: (invitationId: string) => void;
}) => {
  return (
    <div className="text-right">
      <div className="flex justify-end space-x-2">
        <WarningAlert
          message="Are you sure you want to revoke this invitation?"
          onConfirm={() => onRevokeInvitation(invitation.id)}
          triggerBtn={
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Revoke
            </Button>
          }
        />
      </div>
    </div>
  );
};

// Empty state components
export const MembersEmptyState = ({
  action,
}: {
  action?: React.ReactNode;
}) => ({
  icon: <Mail className="h-12 w-12 text-muted-foreground opacity-60" />,
  title: "No members yet",
  description: "You haven't added any members to your organization yet.",
  action,
});

export const InvitationsEmptyState = ({
  action,
}: {
  action?: React.ReactNode;
}) => ({
  icon: <Mail className="h-12 w-12 text-muted-foreground opacity-60" />,
  title: "No pending invitations",
  description:
    "You haven't sent any invitations yet. Invite members to join your organization.",
  action,
});
