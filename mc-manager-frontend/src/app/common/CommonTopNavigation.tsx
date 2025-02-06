"use client";

import { Settings } from "lucide-react";
import React, { useEffect } from "react";
import { useServerStore } from "../../../store/minecraftStore";
import CommonLoading from "./CommonLoading";

function CommonTopNavigation() {
  const { status, isLoading, fetchStatus } = useServerStore();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);
  if (isLoading) return <CommonLoading />;
  return (
    <nav className="flex justify-between items-center w-full h-12 bg-zinc-800 pl-5 pr-5 border-l-2 border-t-2 border-b-2 border-black">
      <div className="text-green-50 flex gap-10">
        <span>Server : Online</span>
        <span>TPS : {status?.tps}</span>
        <span>Players : {status?.onlinePlayers}</span>
      </div>
      <div>
        <Settings className="text-green-50 cursor-pointer" />
      </div>
    </nav>
  );
}

export default CommonTopNavigation;
