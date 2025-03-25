"use client";
import React from "react";
import CommonPlayerList from "./common/CommonPlayerList";

const OnlinePlayersComponent = () => {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Online Players</h2>
        </div>

        <CommonPlayerList />
      </div>
    </div>
  );
};

export default OnlinePlayersComponent;
