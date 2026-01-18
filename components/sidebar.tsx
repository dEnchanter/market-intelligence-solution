"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MapPin,
  TrendingUp,
  X,
  Map,
  Package,
  Receipt,
  Home,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Districts",
    href: "/districts",
    icon: Map,
  },
  {
    title: "Consumption Items",
    href: "/consumption-items",
    icon: Package,
  },
  {
    title: "Markets",
    href: "/markets",
    icon: ShoppingCart,
  },
  {
    title: "Households",
    href: "/households",
    icon: MapPin,
  },
  {
    title: "Household Items",
    href: "/household-items",
    icon: Home,
  },
  {
    title: "Household Expenditures",
    href: "/household-expenditures",
    icon: Receipt,
  },
  {
    title: "Market Prices",
    href: "/market-prices",
    icon: TrendingUp,
  },
  {
    title: "CPI Report",
    href: "/cpi-report",
    icon: BarChart3,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button (mobile only) */}
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
          <span className="text-lg font-semibold text-[#013370]">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#013370] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
