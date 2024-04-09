"use client";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  const handleLogout = () => {
    document.cookie =
      "jwtauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex gap-5 p-5">
        <Link href={"/"}>
          <Button type="primary">LOGIN</Button>
        </Link>
        <Link href={"/profile"}>
          <Button type="primary">PROFILE</Button>
        </Link>
      </div>
      <Button type="primary" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
};

export default Dashboard;
