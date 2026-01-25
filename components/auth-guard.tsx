"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

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
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, pathname]);

  // Show nothing while checking auth (consistent on server and client)
  if (isLoading) {
    return null;
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
