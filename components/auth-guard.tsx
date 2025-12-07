"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push("/");
      return;
    }

    // Check if user must change password
    const user = getUser();
    if (user?.must_change_password && pathname !== "/change-password") {
      // Redirect to change password page if not already there
      router.push("/change-password");
    }
  }, [router, pathname]);

  // Only render children if authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // If user must change password and not on change-password page, don't render
  const user = getUser();
  if (user?.must_change_password && pathname !== "/change-password") {
    return null;
  }

  return <>{children}</>;
}
