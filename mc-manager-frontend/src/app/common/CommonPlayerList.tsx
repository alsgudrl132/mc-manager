import { Search } from "lucide-react";
import React, { useState } from "react";
import { CommonKickBan } from "./CommonKickBan";
import CommonManage from "./CommonManage";

interface Player {
  uuid: string;
  name: string;
  lastLogin: number;
  playTime: number;
  health: number;
  level: number;
  world: string;
  x: number;
  y: number;
  z: number;
  skinUrl: string;
}

// 컴포넌트 props를 위한 인터페이스
interface IPropsPlayers {
  players: Player[] | undefined;
}

const CommonPlayerList = ({ players }: IPropsPlayers) => {
  const [searchTerm, setSearchTerm] = useState("");
  // 검색어로 추가 필터링
  const filteredPlayers = players?.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!players || players.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        현재 접속 중인 플레이어가 없습니다.
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

      {filteredPlayers?.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          검색 결과가 없습니다.
        </div>
      ) : (
        filteredPlayers?.map((player) => (
          <div key={player.uuid} className="space-y-4 mb-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={player.skinUrl}
                      alt="Player1's skin"
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
                  <CommonManage
                    name={player.name}
                    currentLocationX={player.x}
                    currentLocationY={player.y}
                    currentLocationZ={player.z}
                  />
                  <CommonKickBan
                    name={player.name}
                    option="kick"
                    onActionComplete={() => {}}
                  />
                  <CommonKickBan
                    name={player.name}
                    option="ban"
                    onActionComplete={() => {}}
                  />
                </div>
              </div>

              <div className="grid gap-4">
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
                  <div className="text-sm">
                    world ({Math.round(player.x)}, {Math.round(player.y)},
                    {Math.round(player.z)})
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommonPlayerList;
