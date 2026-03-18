"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoutModal } from "../Dialogs/LogoutModal";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  UserCheck,
  Grid,
  CircleDollarSign,
  RotateCcw,
  FileText,
  Info,
  Mail,
  Settings,
  Menu,
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard Overview", href: "/dashboard-overview", icon: LayoutDashboard },
  { name: "All Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Manage Users", href: "/manage-users", icon: Users },
  { name: "Producer Request", href: "/producer-request", icon: UserCheck },
  { name: "Manage Categories", href: "/manage-categories", icon: Grid },
  { name: "Manage Donations", href: "/donations", icon: CircleDollarSign },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "Refund", href: "/refund", icon: RotateCcw },
  { name: "CMS Page Management", href: "/cms-page-management", icon: FileText },
  { name: "Report", href: "/report", icon: Info },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white text-[#33BAFF] shadow-lg border border-[#33BAFF] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={cn(
          "flex h-screen sticky bottom-0 top-0 flex-col bg-white z-50 transition-transform duration-300",
          "fixed lg:static",
          "w-[280px] sm:w-[300px] lg:w-[320px]",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-[112px] flex items-center justify-center relative px-4">
          <Link
            href="/dashboard-overview"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center"
            aria-label="Go to dashboard overview"
          >
            <Image src="/assets/images/logo.png" alt="Hierarchy of Visionaries" width={1000} height={1000} className="h-[50px] w-auto object-contain" />
          </Link>

          {isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#33BAFF] hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-2 flex flex-col items-center justify-start px-4 overflow-y-auto mt-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#33BAFF] text-white shadow-[0px_4px_10px_rgba(51,186,255,0.3)]"
                    : "text-[#5C5C5C] hover:bg-slate-50 hover:text-[#33BAFF]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200 flex-shrink-0",
                    isActive ? "text-white" : ""
                  )}
                />
                <span
                  className={cn(
                    "font-medium text-base leading-[120%] transition-colors duration-200",
                    isActive ? "text-white" : ""
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 sm:p-6">
          <LogoutModal />
        </div>
      </div>
    </>
  );
}
