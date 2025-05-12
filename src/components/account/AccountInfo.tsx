import { useState, useEffect } from "react";
import axiosInstance from "@/axios/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import useUserStore from "@/context/userStore";

export default function AccountInfo() {
  // const { user, setUser, fetchUserData } = useUser();
  const user = useUserStore((state)=>state.user)
  const setUser = useUserStore((state)=>state.setUser)

  const fetchUserData = useUserStore((state)=>state.fetchUserData)


  const [profile, setProfile] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch("/myauth/user/", {
        first_name: profile.firstName,
        last_name: profile.lastName,
      });

      const accessToken = localStorage.getItem("access_token");
      const updatedUserData = await fetchUserData(accessToken);
      setUser(updatedUserData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    }
  };
  //
  //useEffect(() => {
  //  const root = document.documentElement;
  //  const mainColor = getComputedStyle(root).getPropertyValue(
  //    "--primary-foreground",
  //  );
  //  console.log("Main color:", mainColor.trim());
  //}, []);
  //
  return (
    <Card className="m-10 p-5 w-2/3 shadow-none border-none">
      <CardHeader className=" ">
        <div className="flex items-center gap-2 ">
          <User className="" />
          <CardTitle className="">Personal Information</CardTitle>
        </div>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <hr />
      {isEditing ? (
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-10 flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                profile.lastName == user.last_name &&
                profile.firstName == user.first_name
              }
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      ) : (
        <>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">First Name</p>
                <p className="px-3 pl-0 py-2 text-lg">{profile.firstName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Name</p>
                <p className="px-3 pl-0 py-2 text-lg">{profile.lastName}</p>
              </div>
              <Button
                variant="ghost"
                className="px-0"
                onClick={() => setIsEditing(true)}
              >
                <Pencil />
              </Button>
            </div>
            <div className="mt-5">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="px-3 pl-0 py-2 text-md">{profile.email}</p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
