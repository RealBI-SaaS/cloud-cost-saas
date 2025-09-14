import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import OrganizationContext from "@/context/OrganizationContext";
import useCompany from "@/hooks/useCompany";
import company_service from "@/services/company_service";
import {
  Building2,
  Plus,
  Edit3,
  Eye,
  Save,
  Calendar,
  RefreshCw,
  Terminal,
} from "lucide-react";
import React, { FormEvent, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyDetail = () => {
  const { companies, setCompany, error, isLoading } = useCompany();
  const { organizations } = useContext(OrganizationContext);
  const [companyDetail, setCompanyDetail] = useState({
    name: "",
    theme: "default",
    created_at: "",
    updated_at: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgCompany, setOrgCompany] = useState<any>(null);
  const [loadingOrgCompany, setLoadingOrgCompany] = useState(false);

  useEffect(() => {
    if (companies.length > 0) {
      setCompanyDetail({
        name: companies[0].name || "",
        theme: companies[0].theme || "default",
        created_at: companies[0].created_at || "",
        updated_at: companies[0].updated_at || "",
      });
    }
  }, [companies]);

  useEffect(() => {
    // Fetch organization company data if user is in an organization but doesn't have their own company
    if (organizations && organizations.length > 0 && companies.length === 0) {
      setLoadingOrgCompany(true);
      company_service
        .getOrgCompany(organizations[0].id)
        .then((res) => {
          setOrgCompany(res.data);
        })
        .catch((error) => {
          console.error("Error fetching organization company:", error);
          toast.error("Failed to load organization company details");
        })
        .finally(() => {
          setLoadingOrgCompany(false);
        });
    }
  }, [organizations, companies]);

  const handleCreateOrUpdateCompany = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: companyDetail.name,
      theme: companyDetail.theme,
    };

    const isUpdate = companies.length > 0;
    const serviceCall = isUpdate
      ? company_service.updateCompany(companies[0].id, payload)
      : company_service.CreateCompany(payload);

    serviceCall
      .then((res) => {
        toast.success(
          isUpdate
            ? "Company updated successfully"
            : "Company created successfully"
        );
        setCompany([res.data]);
        setIsEditing(false);
      })
      .catch((e) => {
        toast.error(
          e.response?.data?.message || e.message || "Operation failed"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEditing(false);
      });
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (theme: string) => {
    setCompanyDetail((prev) => ({ ...prev, theme }));
  };

  if (isLoading || loadingOrgCompany) {
    return (
      <div className="container mx-auto p-6 ">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 ">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Company Data
            </h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 ">
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {companies.length > 0 || orgCompany
                  ? "Company Profile"
                  : "Create Company"}
              </CardTitle>
            </div>

            {companies.length > 0 && !isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="sm:self-start"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Company Owner with existing company - Edit Mode */}
          {companies.length >= 1 && isEditing && (
            <form
              onSubmit={handleCreateOrUpdateCompany}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column - Form Fields */}
              <div className="space-y-4 py-10">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={companyDetail.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter company name"
                    required
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created At
                    </Label>
                    <Input
                      disabled
                      value={
                        companyDetail.created_at
                          ? new Date(companyDetail.created_at).toLocaleString()
                          : "Not available"
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Last Updated
                    </Label>
                    <Input
                      disabled
                      value={
                        companyDetail.updated_at
                          ? new Date(companyDetail.updated_at).toLocaleString()
                          : "Not available"
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin mr-2">
                        <Save className="h-4 w-4" />
                      </div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {companies.length > 0 ? "Update Company" : "Create Company"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Right Column - Theme Switcher */}
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <ThemeSwitcher disabled={false} />
              </div>
            </form>
          )}

          {/* Company Owner with existing company - View Mode */}
          {companies.length >= 1 && !isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column  */}
              <div className="space-y-4 pt-10">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Company Name</Label>
                  <p className="text-lg font-semibold">{companyDetail.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created At
                    </Label>
                    <p className="text-lg">
                      {companies[0].created_at
                        ? new Date(companies[0].created_at).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Last Updated
                    </Label>
                    <p className="text-lg">
                      {companies[0].updated_at
                        ? new Date(companies[0].updated_at).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Theme */}
              <div className="space-y-2">
                <ThemeSwitcher disabled={true} />
              </div>
            </div>
          )}

          {/* Organization Member - View Only */}
          {orgCompany && companies.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Company Info */}
              <div className="space-y-4 ">
                <div className="text-center md:text-left ">
                  <p className="text-muted-foreground mb-5  bg-primary/10 p-4 text-sm font-thin">
                    You are viewing your organization's company profile. Only
                    organization owners can make changes.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Company Name
                    </Label>
                    <p className="text-lg font-semibold">{orgCompany.name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created At
                      </Label>
                      <p className="text-lg">
                        {orgCompany.created_at
                          ? new Date(orgCompany.created_at).toLocaleString()
                          : "Not available"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Last Updated
                      </Label>
                      <p className="text-lg">
                        {orgCompany.updated_at
                          ? new Date(orgCompany.updated_at).toLocaleString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Theme */}
              <div className="space-y-2">
                <ThemeSwitcher disabled={true} />
              </div>
            </div>
          )}

          {/* No Company or Organization - Create Mode */}
          {!orgCompany && companies.length === 0 && (
            <form
              onSubmit={handleCreateOrUpdateCompany}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column - Form */}
              <div className="space-y-4 pt-10">
                <div className="text-center md:text-left py-4">
                  <Plus className="h-12 w-12 text-primary mx-auto md:mx-0 mb-4" />
                  <h3 className="text-lg font-semibold">
                    Create Your Company Profile
                  </h3>
                  <p className="text-muted-foreground">
                    Get started by setting up your company information
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-name">Company Name *</Label>
                  <Input
                    id="create-name"
                    value={companyDetail.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter company name"
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <div className="animate-spin mr-2">
                      <Save className="h-4 w-4" />
                    </div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Company
                </Button>
              </div>

              {/* Right Column - Theme */}
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <ThemeSwitcher disabled={false} />
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetail;
