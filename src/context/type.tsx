interface OrganizationsType {
  id: string;
  name: string;
  description: string;
  monthlyCost?: number;
  costChange?: number;
  activeAccounts?: number;
  members?: number;
  membersChange?: number;
  accountsChange?: number;
}
