"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";

const Header = () => {
  const { isLoading } = useStoreUser();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* logo */}
          <Link href={"/"} className="flex items-center">
            <Image
              src="/go-plan-icon.png"
              alt="Go Plan logo"
              width={500}
              height={500}
              className="w-full h-11 bg-transparent"
              priority
            />
          </Link>

          {/* Search and Location - Desktop Only */}

          {/* Right Side Actions */}

          <div className="flex items-center">
            <Authenticated>
              {/* Create Event */}
              <UserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size={"sm"}>Sing In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* Mobile Search and Location - Below Header */}

        {/* Loader */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="red" />
          </div>
        )}
      </nav>

      {/* 32:00 */}

      {/* Modals */}
    </>
  );
};

export default Header;
