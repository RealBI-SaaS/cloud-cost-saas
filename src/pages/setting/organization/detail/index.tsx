import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Users,
  MailIcon,
  Building2,
  Cloud,
  ArrowLeft,
} from "lucide-react";
import organization_service, {
  MemberType,
  Organization,
} from "@/services/organization_service";
import OrganizationInfo from "./OrganizationInfo";
import Members from "./Members";
import CustomTab from "@/components/CustomTab";
import PendingInvitations from "./PendingInvitations";
import CloudAccount from "./CloudAccount";
import { Button } from "@/components/ui/button"; // Import Button component
import { FcRight } from "react-icons/fc";

const OrganizationDetail = () => {
  const { org_id } = useParams();
  const navigate = useNavigate(); // Add useNavigate hook
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [invitations, setInvitations] = useState<MemberType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizationData();
  }, [org_id]);

  const loadOrganizationData = async () => {
    try {
      setIsLoading(true);
      const [orgRes, membersRes, invitationsRes] = await Promise.all([
        organization_service.getOrganization(org_id!),
        organization_service.getMembers(org_id!),
        organization_service.getMemberInvitations(org_id!),
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

  // Only reload members, not all data
  const loadMembersOnly = async () => {
    try {
      const membersRes = await organization_service.getMembers(org_id!);
      setMembers(membersRes.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load members");
    }
  };

  // Only reload invitations, not all data
  const loadInvitationsOnly = async () => {
    try {
      const invitationsRes = await organization_service.getMemberInvitations(
        org_id!
      );
      setInvitations(invitationsRes.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load invitations");
    }
  };

  // Update only the members state when a member is removed
  const handleMemberRemoved = (memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  // Update only the member role when a member's role is changed
  const handleMemberRoleUpdated = (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // for custom tab view
  const settingList = [
    {
      key: "general",
      name: "General",
      icon: Building2,
      content: (
        <OrganizationInfo
          organization={organization}
          onUpdate={setOrganization}
        />
      ),
    },
    {
      key: "members",
      name: "Members | " + members.length,
      icon: Users,
      content: (
        <Members
          members={members}
          onInviteMember={loadInvitationsOnly}
          organization={organization}
          onUpdateMember={loadMembersOnly}
          onMemberRemoved={handleMemberRemoved}
          onMemberRoleUpdated={handleMemberRoleUpdated}
        />
      ),
    },
    {
      key: "pending",
      name: "Pending Invites | " + invitations.length,
      icon: MailIcon,
      content: (
        <PendingInvitations
          invitations={invitations}
          organization={organization}
          onUpdateInvitations={loadInvitationsOnly}
        />
      ),
    },
    {
      key: "cloud-accounts",
      name: "Data Integration",
      icon: Cloud,
      content: <CloudAccount organization={organization} />,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-4 space-y-3">
      {/* Back Button */}
      <div className="flex items-center gap-0 ">
        <Link to="/settings">
          <Button
            variant="ghost"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Button>
        </Link>
        <span className="text-muted-foreground">/ {organization.name}</span>
      </div>

      {/* Tabs Component */}
      <CustomTab settingList={settingList} />
    </div>
  );
};

export default OrganizationDetail;
