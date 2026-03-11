"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const userName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Admin User";
  const userImage = user?.profileImage || user?.image || "";

  return (
    <div className="flex h-[72px] w-full items-center justify-between border-b border-[#E9EEF3] bg-white px-8">
      <div>
        <h1 className="text-base font-semibold text-[#131313]">Dashboard</h1>
      </div>

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
  );
}
