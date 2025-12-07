"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, KeyRound, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUser, clearAuth } from "@/lib/utils/auth";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Get user data from localStorage using auth utility
    const user = getUser();
    if (user) {
      setUsername(user.name || "User");
    }
  }, []);

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handleLogout = () => {
    // Clear authentication data using auth utility
    clearAuth();

    // Clear React Query cache
    queryClient.clear();

    // Show success toast
    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });

    // Redirect to login
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Menu button (mobile) + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden text-lg font-semibold text-[#013370] sm:inline-block">
              Market Intelligence
            </span>
          </div>
        </div>

        {/* Right: User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={username} />
                <AvatarFallback className="bg-[#013370] text-white text-sm">
                  {username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden font-medium sm:inline-block">
                {username}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleChangePassword}
              className="cursor-pointer"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
