import Image from "next/image";
import React from "react";

export default function AuthSplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 font-geist-sans md:grid-cols-2 md:gap-0">
      <div className="md:col-span-1">
        <Image
          src="/assets/images/auth_sidebar.png"
          alt="Authentication"
          width={1000}
          height={1000}
          className="h-[320px] w-full object-cover md:h-screen"
          priority
        />
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-8 md:col-span-1 md:px-8">
        {children}
      </div>
    </div>
  );
}
