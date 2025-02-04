import { Crown, MessageSquare, Users } from "lucide-react";
import React from "react";

function NavigationCommon() {
  return (
    <header className="flex flex-col bg-zinc-800 h-dvh w-[300px] items-center pt-5">
      <div className="text-emerald-500 font-bold text-2xl mb-10 cursor-pointer">
        MC Manager
      </div>
      <div>
        <div className="text-green-50 mb-7 py-1 px-5 flex gap-2 cursor-pointer hover:bg-zinc-700 rounded-full transition-all">
          <Users />
          <span>Player</span>
        </div>
        <div className="text-green-50 mb-7  py-1 px-5 flex gap-2 cursor-pointer hover:bg-zinc-700 rounded-full transition-all">
          <MessageSquare />
          <span>Chat</span>
        </div>
        <div className="text-green-50 mb-7  py-1 px-5 flex gap-2 cursor-pointer hover:bg-zinc-700 rounded-full transition-all">
          <Crown />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default NavigationCommon;
