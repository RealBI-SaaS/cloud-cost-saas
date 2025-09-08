import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  Users,
  CreditCard,
  Activity,
  UserCheck,
  BarChart3,
  PieChart,
  Download,
  MoreHorizontal,
  ChevronRight,
  Calendar,
  FileText,
  Server,
  Cpu,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

import SelectedOrgContext from "@/context/organizationContext";
import {
  allOrganizations,
  costBreakdown,
  recentActivity,
  usageStats,
} from "./mockData";

const Dashboard = () => {
  const { selectedOrg: currentOrg } = useContext(SelectedOrgContext);
  const currentOrg_temp = allOrganizations;
  return (
    <div className="p-6 bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard | {currentOrg.name}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Monthly Cost Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Cost
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentOrg_temp.monthlyCost.toFixed(2)}
            </div>
            <div
              className={`flex items-center text-xs mt-1 ${
                currentOrg_temp.costChange >= 0
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {currentOrg_temp.costChange >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(currentOrg_temp.costChange).toFixed(2)}%
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              {currentOrg_temp.costChange >= 0 ? "Increase" : "Decrease"} from
              last month
            </p>
          </CardFooter>
        </Card>

        {/* Active Accounts Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Accounts
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentOrg_temp.activeAccounts}
            </div>
            <div
              className={`flex items-center text-xs mt-1 ${
                currentOrg_temp.accountsChange >= 0
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {currentOrg_temp.accountsChange >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(currentOrg_temp.accountsChange)}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              {currentOrg_temp.accountsChange >= 0 ? "Gained" : "Lost"} this
              month
            </p>
          </CardFooter>
        </Card>

        {/* Team Members Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentOrg_temp.members}</div>
            <div
              className={`flex items-center text-xs mt-1 ${
                currentOrg_temp.membersChange >= 0
                  ? "text-green-600"
                  : "text-destructive"
              }`}
            >
              {currentOrg_temp.membersChange >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(currentOrg_temp.membersChange)}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              {currentOrg_temp.membersChange >= 0
                ? "New members"
                : "Members left"}{" "}
              this month
            </p>
          </CardFooter>
        </Card>

        {/* Active Users Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(currentOrg_temp.members * 0.85)}/
              {currentOrg_temp.members}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              85% active
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">
              Users active in the last 30 days
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Usage Chart Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageStats.map((stat) => (
                <div key={stat.service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">{stat.icon}</div>
                      <span className="text-sm font-medium">
                        {stat.service}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.usage}
                    </span>
                  </div>
                  <Progress value={stat.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-0.5">{activity.icon}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Cost Breakdown Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {costBreakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-medium">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-10">Add Member</Button>
                <Button className="h-10" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="h-10" variant="outline">
                  Settings
                </Button>
                <Button className="h-10" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
