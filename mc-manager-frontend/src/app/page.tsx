"use client";

import React, { useState } from "react";
import CommonPlayerList from "./common/CommonPlayerList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersStatus, fetchServerStatus } from "./store/store";
import CommonLoading from "./common/CommonLoading";
import CommonError from "./common/CommonError";
import CommonBanPlayerList from "./common/CommonBanPlayerList";
interface Player {
  uuid: string;
  name: string;
  lastLogin: number;
  lastLogout: number;
  isOnline: boolean;
  playTime: number;
  skinUrl: string;
  isBanned: boolean;
}
const OnlinePlayersComponent = () => {
  const [category, setCategory] = useState<"online" | "ban">("online");
  const queryClient = useQueryClient();
  const {
    data: serverStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["serverStatus"],
    queryFn: fetchServerStatus,
    refetchInterval: 5000,
  });

  const {
    data: playerStatus,
    isLoading: playerStatusIsLoading,
    error: playerStatusError,
  } = useQuery({
    queryKey: ["playerStatus"],
    queryFn: fetchPlayersStatus,
    refetchInterval: 5000,
  });

  const onActionHandler = () => {
    queryClient.invalidateQueries({ queryKey: ["serverStatus"] });
    queryClient.invalidateQueries({ queryKey: ["playerStatus"] });
  };

  if (isLoading || playerStatusIsLoading) return <CommonLoading />;
  if (error || playerStatusError) return <CommonError />;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <h2
              className={`text-lg font-bold rounded-md px-3 py-1 cursor-pointer ${
                category === "online"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100"
              }`}
              onClick={() => setCategory("online")}
            >
              Online Players
            </h2>
            <h2
              className={`text-lg font-bold rounded-md px-3 py-1 cursor-pointer ${
                category === "ban" ? "bg-red-100 text-red-800" : "bg-gray-100"
              }`}
              onClick={() => setCategory("ban")}
            >
              Ban Players
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            Total :
            {category === "online"
              ? serverStatus?.data.data.onlinePlayers
              : playerStatus?.data.data.filter(
                  (player: Player) => player.isBanned
                ).length}{" "}
            Players
          </div>
        </div>
        {category === "online" ? (
          <CommonPlayerList
            players={serverStatus?.data.data.players}
            onActionComplete={onActionHandler}
          />
        ) : (
          <CommonBanPlayerList
            players={playerStatus?.data.data}
            onActionComplete={onActionHandler}
          />
        )}
      </div>
    </div>
  );
};

export default OnlinePlayersComponent;
