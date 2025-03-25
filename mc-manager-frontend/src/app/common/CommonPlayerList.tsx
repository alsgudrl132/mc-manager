import { Search } from "lucide-react";
import React, { useState } from "react";
import { CommonKickBan } from "./CommonKickBan";
import CommonLoading from "./CommonLoading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersList } from "../store/store";
import CommonManage from "./CommonManage";

function CommonPlayerList() {
  const [filterPlayer, setFilterPlayer] = useState<IPlayer[]>();

  interface IPlayer {
    id: number;
    uuid: string;
    name: string;
    lastLogin: number;
    lastLogout: number;
    playTime: number;
    health: number;
    level: number;
    world: string;
    x: number;
    y: number;
    z: number;
    skinUrl: string | null;
    online: boolean;
    banned: boolean;
  }

  interface IApiResponse {
    player: IPlayer;
    currentStatus: object;
    stats: object;
  }
  const queryClient = useQueryClient();
  const { data: players, isLoading } = useQuery<IPlayer[]>({
    queryKey: ["playersList"],
    queryFn: async () => {
      const res = (await fetchPlayersList()) as IApiResponse[];
      return res.map((item) => item.player);
    },
  });

  // 키워드에 따라 목록 필터링
  const handleFilterPlayer = (keyword: string) => {
    const result = players?.filter((player) =>
      player.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilterPlayer(result);
  };

  const refreshPlayer = () => {
    queryClient.invalidateQueries({ queryKey: ["playersList"] });
  };

  if (isLoading) {
    return <CommonLoading />;
  }

  // filterPlayer가 없다면 players목록 보여주기
  const displayPlayers = filterPlayer || players;

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search players..."
          className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
          onChange={(e) => handleFilterPlayer(e.target.value)}
        />
      </div>
      {displayPlayers?.map((player) => (
        <div key={player.id} className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://mc-heads.net/avatar/${player.uuid}`}
                    alt={`${player.name || "Unknown"}'s skin`}
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{player.name}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      online
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Level: {player.level}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <CommonManage name={player.name ?? ""} uuid={player.uuid} />
                <CommonKickBan
                  name={player.name ?? ""}
                  uuid={player.uuid}
                  option="kick"
                  banned={player.banned}
                  onActionComplete={refreshPlayer}
                />
                <CommonKickBan
                  name={player.name ?? ""}
                  uuid={player.uuid}
                  option="ban"
                  banned={player.banned}
                  onActionComplete={refreshPlayer}
                />
              </div>
            </div>

            <div className="grid  gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Health:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(player.health / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Location:</div>
                <div className="text-sm">world (-120.62, 67.0, 35.7)</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommonPlayerList;
