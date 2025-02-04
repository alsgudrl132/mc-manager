import { Crown, MessageSquare, Users } from "lucide-react";
import React from "react";

function NavigationCommon() {
  return (
    <header className="flex flex-col bg-zinc-800 h-dvh w-[300px] items-center pt-5">
      <div className="text-emerald-500 font-bold text-2xl mb-10">
        MC Manager
      </div>
      <div>
        <div className="text-white mb-7 flex gap-2">
          <Users />
          <span>Player</span>
        </div>
        <div className="text-white mb-7 flex gap-2">
          <MessageSquare />
          <span>Chat</span>
        </div>
        <div className="text-white mb-7 flex gap-2">
          <Crown />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default NavigationCommon;
