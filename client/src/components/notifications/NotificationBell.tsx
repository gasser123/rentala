"use client";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/state/notifications-api";
import { Loader } from "@aws-amplify/ui-react";

const NotificationBell = ({ user }: { user: User }) => {
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skipPollingIfUnfocused: true,
  });
  const [readNotification] = useUpdateNotificationStatusMutation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 cursor-pointer text-gray-100 hover:text-gray-400" />

          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 bg-red-800!">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[350px] p-0">
        <div className="p-3 font-semibold">Notifications</div>

        <Separator />

        {notificationsLoading ? (
          <Loader size="small" />
        ) : notificationsError ? (
          <div className="p-3 text-sm text-muted-foreground text-center">
            Failed to fetch notifications
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No notifications
              </div>
            )}

            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    readNotification(notification.id);
                  }
                }}
                className={cn(
                  "p-3 hover:bg-muted transition",
                  notification.read
                    ? "bg-background hover:bg-muted/50"
                    : "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40",
                )}
              >
                <Link
                  href={
                    notification.type === "APPLICATION"
                      ? `/${user.userRole}s/applications`
                      : (notification.type === "PAYMENT" ||
                            notification.type === "LEASE") &&
                          user.userRole === "manager"
                        ? "/managers/properties"
                        : "/tenants/residences"
                  }
                  className="block"
                >
                  <div className="font-medium text-sm">
                    {notification.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {notification.message}
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>

                  <Separator className="mt-2" />
                </Link>
              </div>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
