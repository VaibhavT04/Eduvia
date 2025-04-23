"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Shield, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import Link from "next/link"; // ✅ Use Next.js Link
import Image from 'next/image'
import { useContext } from "react";
import { CourseCountContext } from "@/app/_context/CourseCountContext";


function SideBar() {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile",
    },
  ];

  const {totalCourse, setTotalCourse} = useContext(CourseCountContext);
  const path = usePathname(); 
  
  // Calculate available credits (max 5)
  const maxCredits = 5;
  const usedCredits = Math.min(totalCourse, maxCredits);
  const availableCredits = Math.max(0, maxCredits - usedCredits);
  const progressPercentage = (usedCredits / maxCredits) * 100;

  return (
    <div className="h-screen shadow-md p-3">
      <div>
        <Image src="/logo.png" alt="logo" width={180} height={180} />
      </div>

      {/* Menu Items */}
      <div className="mt-3">
        <Link href={'/create'}>
        <Button className="w-full" disabled={availableCredits === 0}>Create New</Button>
        </Link>
        <div className="mt-5">
          {MenuList.map((menu, index) => (
            <Link key={index} href={menu.path} className="block">
              <div
                className={`flex gap-5 items-center p-3 hover:bg-gray-200 rounded-lg cursor-pointer mt-3 
                ${path === menu.path ? "bg-slate-200" : ""}`}
              >
                <menu.icon />
                <h2>{menu.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[87%]">
        <h2 className="text-lg mb-2">Available Credits: {availableCredits}</h2>
        <Progress value={progressPercentage} />
        <h2 className='text-sm'>{usedCredits} out of {maxCredits} Credits used</h2>

        {availableCredits === 0 && (
          <Link href="/dashboard/upgrade" className="text-primary text-xs mt-3 block" >
            Upgrade to create more
          </Link>
        )}
      </div>
    </div>
  );
}

export default SideBar;
