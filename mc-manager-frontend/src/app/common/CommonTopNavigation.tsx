"use client";

import { Settings } from "lucide-react";

function CommonTopNavigation() {
  return (
    <nav className="flex justify-between items-center w-full h-12 bg-zinc-800 pl-5 pr-5 border-l-2 border-t-2 border-b-2 border-black">
      <div className="text-green-50 flex gap-10">
        <span>Server : Online</span>
        <span>TPS :1</span>
        <span>Players : 1</span>
      </div>
      <div>
        <Settings className="text-green-50 cursor-pointer" />
      </div>
    </nav>
  );
}

export default CommonTopNavigation;
