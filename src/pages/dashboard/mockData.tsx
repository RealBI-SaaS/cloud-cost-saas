import {
  Activity,
  BarChart3,
  Cpu,
  FileText,
  Server,
  Users,
} from "lucide-react";

// TODO: mock data will be expected from API
export const allOrganizations = [
  {
    id: "all-organization",
    name: "All organization",
    description: "Overview of all teams and cloud accounts",
    monthlyCost: 1245.5,
    costChange: 125.6,
    activeAccounts: 42,
    accountsChange: 3,
    members: 156,
    membersChange: -2,
  },
  {
    id: "marketing-team",
    name: "Marketing team",
    description: "Marketing campaigns and analytics",
    monthlyCost: 845.25,
    costChange: -45.3,
    activeAccounts: 18,
    accountsChange: 2,
    members: 24,
    membersChange: 1,
  },
  {
    id: "product-team",
    name: "Production team",
    description: "Product development and manufacturing",
    monthlyCost: 2150.75,
    costChange: 325.8,
    activeAccounts: 28,
    accountsChange: 5,
    members: 45,
    membersChange: 3,
  },
  {
    id: "development-team",
    name: "Development team",
    description: "Software development and engineering",
    monthlyCost: 3850.9,
    costChange: 210.45,
    activeAccounts: 35,
    accountsChange: 4,
    members: 38,
    membersChange: 2,
  },
  {
    id: "design-team",
    name: "Design team",
    description: "UI/UX design and creative work",
    monthlyCost: 975.3,
    costChange: 75.25,
    activeAccounts: 12,
    accountsChange: 1,
    members: 15,
    membersChange: 0,
  },
];

export const recentActivity = [
  {
    id: 1,
    action: "New project started",
    time: "2 hours ago",
    icon: <FileText className="h-4 w-4 text-primary" />,
  },
  {
    id: 2,
    action: "Team member added",
    time: "1 day ago",
    icon: <Users className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 3,
    action: "Monthly report generated",
    time: "2 days ago",
    icon: <BarChart3 className="h-4 w-4 text-green-500" />,
  },
  {
    id: 4,
    action: "Server maintenance",
    time: "3 days ago",
    icon: <Server className="h-4 w-4 text-amber-500" />,
  },
];
export const usageStats = [
  {
    service: "Cloud Storage",
    usage: "75%",
    value: 75,
    icon: <Server className="h-4 w-4" />,
  },
  {
    service: "API Calls",
    usage: "45%",
    value: 45,
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    service: "Database",
    usage: "60%",
    value: 60,
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    service: "Bandwidth",
    usage: "30%",
    value: 30,
    icon: <Activity className="h-4 w-4" />,
  },
];

export const costBreakdown = [
  {
    category: "Infrastructure",
    amount: 498.2,
    percentage: 40,
    color: "bg-primary",
  },
  {
    category: "Software Licenses",
    amount: 373.65,
    percentage: 30,
    color: "bg-blue-500",
  },
  {
    category: "Personnel",
    amount: 249.1,
    percentage: 20,
    color: "bg-green-500",
  },
  {
    category: "Other",
    amount: 124.55,
    percentage: 10,
    color: "bg-muted-foreground/30",
  },
];
