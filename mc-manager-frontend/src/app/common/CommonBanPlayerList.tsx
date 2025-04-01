import React, { useState } from "react";
import { CommonKickBan } from "./CommonKickBan";
import { Search } from "lucide-react";

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

interface IPropsPlayers {
  players: Player[] | undefined;
  onActionComplete?: () => void;
}

function CommonBanPlayerList({ players, onActionComplete }: IPropsPlayers) {
  const [searchTerm, setSearchTerm] = useState("");

  // 벤된 플레이어만 필터링
  const bannedPlayers = players?.filter((player) => player.isBanned) || [];

  // 검색어로 추가 필터링
  const filteredPlayers = bannedPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (bannedPlayers.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        벤 처리된 플레이어가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search players..."
          className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          검색 결과가 없습니다.
        </div>
      ) : (
        filteredPlayers.map((player) => (
          <div key={player.uuid} className="space-y-4 mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={player.skinUrl}
                      alt={`${player.name}'s skin`}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{player.name}</span>
                      {player.isOnline && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <CommonKickBan
                    name={player.name}
                    option="unban"
                    isBanned={true}
                    onActionComplete={onActionComplete}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Last login:</div>
                  <div>{new Date(player.lastLogin).toLocaleString()}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Play time:</div>
                  <div>
                    {Math.floor(player.playTime / 3600000)}시간{" "}
                    {Math.floor((player.playTime % 3600000) / 60000)}분
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommonBanPlayerList;
