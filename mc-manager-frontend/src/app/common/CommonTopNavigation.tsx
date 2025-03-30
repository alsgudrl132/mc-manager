"use client";

import { KeyRound, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/store";

function CommonTopNavigation() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  // 클라이언트 사이드 렌더링 처리
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="flex justify-between items-center w-full h-12 py-3 bg-zinc-800 pl-5 pr-5 border-l-2 border-t-2 border-b-2 border-black">
      <div className="text-green-50 flex gap-10">
        <span>Server : Online</span>
        <span>TPS : 19.8</span>
        <span>Players : 10</span>
      </div>

      {isAuthenticated ? (
        <div
          className="flex gap-2 border-2 bg-emerald-200 border-emerald-200 rounded-full px-2 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut />
          <span>Logout</span>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <div
            className="flex gap-2 border-2 bg-emerald-200 border-emerald-200 rounded-full px-2 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            <LogIn />
            <span>Login</span>
          </div>
          <div
            className="flex gap-2 border-2 bg-emerald-200 border-emerald-200 rounded-full px-2 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            <KeyRound />
            <span>Register</span>
          </div>
        </div>
      )}
    </nav>
  );
}

export default CommonTopNavigation;
