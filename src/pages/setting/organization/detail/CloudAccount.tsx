import useCloudAccounts from "@/hooks/useCloudAccounts";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Cloud,
  Server,
  Calendar,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import DataIntegration from "@/pages/data/DataIntegration";
import IntegrationSources from "@/pages/data/IntegrationSources";

// Cloud vendor icons mapping
const CloudIcons = {
  AWS: () => <AwsIcon className="h-5 w-5 text-orange-500" />,
  Azure: () => <AzureIcon className="h-5 w-5 text-blue-600" />,
  GCP: () => <GcpIcon className="h-5 w-5 text-blue-400" />,
  default: () => <Cloud className="h-5 w-5 text-gray-500" />,
};

const CloudAccount = ({ organization_id }) => {
  const { cloudAccounts, error, isLoading } = useCloudAccounts(organization_id);

  const getVendorIcon = (vendor: string) => {
    const IconComponent =
      CloudIcons[vendor as keyof typeof CloudIcons] || CloudIcons.default;
    return <IconComponent />;
  };

  const getVendorBadgeVariant = (vendor: string) => {
    switch (vendor) {
      case "AWS":
        return "outline";
      case "Azure":
        return "secondary";
      case "GCP":
        return "default";
      default:
        return "outline";
    }
  };

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error loading cloud accounts</p>
              <p className="text-sm text-muted-foreground">
                {error?.message ||
                  "Failed to load cloud accounts. Please try again."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cloud Accounts List */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cloud Accounts</h2>
                <CardDescription>
                  {cloudAccounts?.length || 0} cloud account
                  {cloudAccounts?.length !== 1 ? "s" : ""} connected
                </CardDescription>
              </div>
            </div>
            {/* <DataIntegration /> */}
            <IntegrationSources label={true} />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 shadow-sm border-border/50 "
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : cloudAccounts?.length > 0 ? (
            // Cloud accounts table
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cloud Provider</TableHead>
                  <TableHead>Account Details</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cloudAccounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getVendorIcon(account.vendor)}
                        </div>
                        <div>
                          <p className="font-medium">{account.vendor}</p>
                          <Badge
                            variant={getVendorBadgeVariant(account.vendor)}
                          >
                            {account.vendor}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.account_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {account.account_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(account.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Connected
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            // Empty state
            <div className="text-center py-12 space-y-6 border-1   border-dashed border-border rounded-lg">
              <div className="flex justify-center">
                <div className="p-4 bg-muted/30 rounded-full">
                  <Cloud className="h-12 w-12 text-muted-foreground opacity-60" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  No cloud accounts connected
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Connect your cloud accounts to start monitoring your
                  infrastructure and costs.
                </p>
              </div>
              <div className="opacity-40 hover:opacity-100">
                <IntegrationSources label={true} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card className="bg-muted/50 shadow-lg border-border/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AwsIcon className="h-4 w-4 text-orange-500" />
                AWS
              </div>
              <p className="text-muted-foreground">
                Connect your AWS account to monitor EC2, S3, and other services.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AzureIcon className="h-4 w-4 text-blue-600" />
                Azure
              </div>
              <p className="text-muted-foreground">
                Integrate Azure subscriptions for comprehensive cloud
                monitoring.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <GcpIcon className="h-4 w-4 text-blue-400" />
                Google Cloud
              </div>
              <p className="text-muted-foreground">
                Link GCP projects to track resources and spending across
                services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder icon components (replace with actual ones if available)
const AwsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
  </svg>
);

const AzureIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
  </svg>
);

const GcpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
  </svg>
);

export default CloudAccount;
