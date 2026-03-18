"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import NotificationBell from "./notifications/NotificationBell";

const NavBar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 shadow-xl h-[${NAVBAR_HEIGHT}px]`}
    >
      <div className="flex justify-between py-3 px-8 bg-gray-900 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden ">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:text-gray-300! "
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentala Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-xl font-bold">
                Rent
                <span className="text-red-800 font-light hover:text-red-600">
                  ALA
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser ? (
            <Button
              className="md:ml-4 bg-gray-50 text-stone-950 hover:bg-red-800 hover:text-gray-50"
              variant="secondary"
              onClick={() => {
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search",
                );
              }}
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 " />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          ) : null}
        </div>
        {!isDashboardPage && (
          <p className="text-gray-200 hidden md:block">
            Discover Our Perfect Rental Properties
          </p>
        )}
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-gray-100 hover:text-gray-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-800 rounded-full"></span>
              </div>
              <NotificationBell user={authUser} />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none cursor-pointer">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="bg-gray-600 ">
                      {authUser.cognitoInfo.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-gray-200 hidden md:block ">
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-gray-950">
                  <DropdownMenuItem
                    className="cursor-pointer hover:text-gray-100! hover:bg-gray-950!"
                    onClick={() => {
                      router.push(
                        authUser.userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        {
                          scroll: false,
                        },
                      );
                    }}
                  >
                    Go To Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 " />
                  <DropdownMenuItem
                    className="cursor-pointer hover:text-gray-100! hover:bg-gray-950!"
                    onClick={() => {
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        {
                          scroll: false,
                        },
                      );
                    }}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:text-gray-100! hover:bg-gray-950!"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-gray-900 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="cursor-pointer">
                <Button
                  variant="secondary"
                  className="text-white border-white bg-red-800 hover:bg-white hover:text-gray-900 rounded-lg cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
