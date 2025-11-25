"use client";
import NavBar from "@/components/NavBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { Loader } from "@aws-amplify/ui-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authUser) {
      const { userRole } = authUser;
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/")
      ) {
        router.push("/managers/properties", {
          scroll: false,
        });
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
  if ((!authUser || !authUser.userRole) && pathname !== "/landing") {
    return null;
  }
  return (
    <div className="h-full w-full ">
      <NavBar />

      <main
        className={`h-full flex w-full flex-col`}
        style={{
          paddingTop: `${NAVBAR_HEIGHT}px`,
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
