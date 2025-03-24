"use client";

import { Ban, Shield } from "lucide-react";
import React from "react";
import CommonPlayerList from "./common/CommonPlayerList";

const OnlinePlayersComponent = () => {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Online Players</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white">
              <Shield size={18} />
              <span>Whitelist</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white">
              <Ban size={18} />
              <span>Banned Players</span>
            </button>
          </div>
        </div>

        <CommonPlayerList />
      </div>
    </div>
  );
};

export default OnlinePlayersComponent;
