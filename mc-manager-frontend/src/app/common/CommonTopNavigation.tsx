"use client";

import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { fetchServerStatus } from "../store/store";
import CommonLoading from "./CommonLoading";

interface serverStatus {
  id: number;
  timestamp: number;
  tps: number;
  onlinePlayers: number;
  maxPlayers: number;
  usedMemory: number;
  totalMemory: number;
  uptime: string;
}

function CommonTopNavigation() {
  const { data: serverStatus, isLoading } = useQuery<serverStatus>({
    queryKey: ["serverStatus"],
    queryFn: () => fetchServerStatus(),
  });

  if (isLoading) {
    return <CommonLoading />;
  }
  return (
    <nav className="flex justify-between items-center w-full h-12 bg-zinc-800 pl-5 pr-5 border-l-2 border-t-2 border-b-2 border-black">
      <div className="text-green-50 flex gap-10">
        <span>Server : Online</span>
        <span>TPS : {serverStatus?.tps}</span>
        <span>Players : {serverStatus?.onlinePlayers}</span>
      </div>
      <div>
        <Settings className="text-green-50 cursor-pointer" />
      </div>
    </nav>
  );
}

export default CommonTopNavigation;
