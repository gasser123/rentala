"use client";
import AppSidebar from "@/components/AppSidebar";
import NavBar from "@/components/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { Loader } from "@aws-amplify/ui-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authUser) {
      const { userRole } = authUser;
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
          {
            scroll: false,
          }
        );
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader className="w-14! h-14!" />
      </div>
    );
  }
  if (!authUser || !authUser.userRole) {
    return null;
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-100">
        <NavBar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <AppSidebar userType={authUser.userRole} />
            <div className="flex grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
