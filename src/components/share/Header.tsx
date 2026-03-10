"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Mr. Raja";
  const userImage = session?.user?.image || "";

  return (
    <div className="w-full h-[100px] flex items-center justify-between px-8 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-[#131313]">Over View</h1>
        <p className="text-sm text-[#787878] mt-1">Dashboard</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-[#131313]">{userName}</span>
        <Avatar className="h-10 w-10 border border-[#E7E7E7]">
          <AvatarImage src={userImage || "https://github.com/shadcn.png"} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
