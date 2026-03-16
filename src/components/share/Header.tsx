"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotification } from "@/provider/NotificationProvider";

export default function Header() {
  const { data: session } = useSession();
  const { unreadCount } = useNotification();
  const user = session?.user;
  const userName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Admin User";
  const userImage = user?.profileImage || user?.image || "";

  return (
    <div className="flex h-[72px] w-full items-center justify-between bg-white px-8">
      <div>
        <h1 className="text-base font-semibold text-[#131313]">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E7E7] bg-white text-[#131313] transition-colors hover:bg-[#F5FBFF]"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 min-w-[18px] rounded-full bg-[#FF3B30] px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <span className="text-sm font-semibold text-[#131313]">{userName}</span>
          <Avatar className="h-10 w-10 border border-[#E7E7E7]">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-[#EDF7FB] text-sm font-medium text-[#33BAFF]">
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
