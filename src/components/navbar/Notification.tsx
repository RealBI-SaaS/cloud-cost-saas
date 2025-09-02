import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle, AlertCircle, Info, CloudAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Notification() {
  const notifications = [
    {
      id: 1,
      message: "Your organization is consuming 80% of its budget.",
      read: false,
      time: "2 min ago",
      type: "info",
    },
    {
      id: 2,
      message: "Your subscription will expire in 5 days.",
      read: true,
      time: "1 hour ago",
      type: "warning",
    },
    {
      id: 3,
      message: "Yosef has accepted your invitation .",
      read: false,
      time: "3 hours ago",
      type: "success",
    },
    {
      id: 4,
      message: "Data integration with the AWS1 account failed.",
      read: false,
      time: "1 hours ago",
      type: "error",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <CloudAlert className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-lg border-border/60"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>

        <div className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer rounded-md ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm ${
                        !notification.read
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-muted/50"
          >
            Mark all as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
