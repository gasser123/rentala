import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const NavBar = () => {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 shadow-xl h-[${NAVBAR_HEIGHT}px]`}
    >
      <div className="flex justify-between py-3 px-8 bg-gray-900 text-white">
        <div className="flex items-center gap-4 md:gap-6">
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
        </div>
        <p className="text-gray-200 hidden md:block">
          Discover our perfect rental apartment
        </p>
        <div className="flex items-center gap-5">
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
        </div>
      </div>
    </div>
  );
};

export default NavBar;
