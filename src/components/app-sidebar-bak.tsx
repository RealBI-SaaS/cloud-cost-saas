import * as React from "react";
import { useOrg } from "@/context/OrganizationContext";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Lightbulb,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  orgs: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,

      isActive: true,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },

    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },

    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
  ],
  org_navigations: [
    {
      name: "Welcome",
      url: "#",
      org: "xcv",
      id: "223",
      icon: Lightbulb,
    },
    //{
    //  name: "Sales & Marketing",
    //  url: "#",
    //  icon: PieChart,
    //},
    //{
    //  name: "Travel",
    //  url: "#",
    //  icon: Map,
    //},
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userOrgs, currentOrg, navigations } = useOrg();
  const { user } = useUser();

  // Store teams in local state
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    console.log("User and orgs updated");

    // Populate user data
    const userData = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      avatar: "/avatars/shadcn.jpg", // You can customize this
    };

    // Update the teams list based on userOrgs
    const updatedTeams = userOrgs.map((org) => ({
      name: org.name,
      logo: GalleryVerticalEnd, // Assuming GalleryVerticalEnd is the logo for all teams
      plan: "Enterprise", // You can customize based on actual data
    }));

    // Update state with new teams
    setTeams(updatedTeams);

    // Optional: Update other data like navigation or user info if needed
  }, [user, userOrgs]); // This effect runs when user or userOrgs changes

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Passing the teams as props to TeamSwitcher */}
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={navigations} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
