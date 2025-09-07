import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, MailIcon, Building2, Cloud } from "lucide-react";
import organization_service, {
  Organization,
} from "@/services/organization_service";
import OrganizationInfo from "./OrganizationInfo";
import Members from "./Members";
import CustomTab from "@/components/CustomTab";
import PendingInvitations from "./PendingInvitations";

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
          orgId={org_id!}
          onUpdateMember={loadOrganizationData}
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
          orgId={org_id}
          onUpdateInvitations={loadOrganizationData}
        />
      ),
    },
    {
      key: "cloud-accounts",
      name: "Data Integration",
      icon: Cloud,
      content: "coming soon",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* <h1 className="text-3xl text-foreground/50 font-bold">
        Settings | {organization?.name}
      </h1> */}

      <CustomTab settingList={settingList} />
    </div>
  );
};

export default OrganizationDetail;
