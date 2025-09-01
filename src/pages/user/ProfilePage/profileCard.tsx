import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Pencil, Save, X, Mail } from "lucide-react";
import { UserProfile } from "./types";

interface ProfileCardProps {
  user: any;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

export function ProfileCard({ user, onProfileUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onProfileUpdate(profile);
    setIsEditing(false);
  };

  const isProfileChanged =
    profile.firstName !== user?.first_name ||
    profile.lastName !== user?.last_name;

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription>
              Manage your personal details and account information
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="h-11"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                value={profile.email}
                disabled
                className="h-11 bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setProfile({
                    firstName: user?.first_name || "",
                    lastName: user?.last_name || "",
                    email: user?.email || "",
                  });
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isProfileChanged}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  First Name
                </Label>
                <p className="text-lg font-medium px-2 py-3 bg-muted/20 rounded-lg">
                  {profile.firstName}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Last Name
                </Label>
                <p className="text-lg font-medium px-2 py-3 bg-muted/20 rounded-lg">
                  {profile.lastName}
                </p>
              </div>
            </div>

            <div className="flex justify-between flex-col sm:flex-row ">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <p className="text-md px-2 py-3 bg-muted/20 rounded-lg">
                  {profile.email}
                </p>
              </div>
              <div className="  flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2 w-full "
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
