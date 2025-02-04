import { Settings } from "lucide-react";
import React from "react";

function CommonTopNavigation() {
  return (
    <nav className="flex justify-between items-center w-full h-12 bg-zinc-800 pl-5 pr-5 border-l-2 border-t-2 border-b-2 border-black">
      <div className="text-green-50 flex gap-10">
        <span>Server : </span>
        <span>TPS : </span>
        <span>Players : </span>
      </div>
      <div>
        <Settings className="text-green-50 cursor-pointer" />
      </div>
    </nav>
  );
}

export default CommonTopNavigation;
