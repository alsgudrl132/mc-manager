"use client";

import React from "react";
import CommonPlayerList from "./common/CommonPlayerList";
import { useQuery } from "@tanstack/react-query";
import { fetchServerStatus } from "./store/store";
import CommonLoading from "./common/CommonLoading";
import CommonError from "./common/CommonError";
const OnlinePlayersComponent = () => {
  const {
    data: serverStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: fetchServerStatus,
    refetchInterval: 5000,
  });

  if (isLoading) return <CommonLoading />;
  if (error) return <CommonError />;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Online Players</h2>
          <div className="text-sm text-gray-500">
            Total: {serverStatus?.data.data.onlinePlayers} Players
          </div>
        </div>

        <CommonPlayerList players={serverStatus?.data.data.players} />
      </div>
    </div>
  );
};

export default OnlinePlayersComponent;
