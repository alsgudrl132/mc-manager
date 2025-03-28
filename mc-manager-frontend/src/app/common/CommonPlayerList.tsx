import { Search } from "lucide-react";
import React from "react";
import { CommonKickBan } from "./CommonKickBan";
import CommonManage from "./CommonManage";

function CommonPlayerList() {
  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search players..."
          className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* 플레이어 1 - 온라인 */}
      <div className="space-y-4 mb-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="https://mc-heads.net/avatar/Player1"
                  alt="Player1's skin"
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Player1</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                    online
                  </span>
                </div>
                <div className="text-sm text-gray-500">Level: 30</div>
              </div>
            </div>
            <div className="flex gap-2">
              <CommonManage name="Player1" />
              <CommonKickBan name="Player1" option="kick" banned={false} />
              <CommonKickBan name="Player1" option="ban" banned={false} />
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Health:</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Location:</div>
              <div className="text-sm">world (100, 64, -200)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 플레이어 2 - 오프라인 및 밴 */}
      <div className="space-y-4 mb-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="https://mc-heads.net/avatar/Player2"
                  alt="Player2's skin"
                  className="w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Player2</span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                    banned
                  </span>
                </div>
                <div className="text-sm text-gray-500">Level: 42</div>
              </div>
            </div>
            <div className="flex gap-2">
              <CommonManage name="Player2" />
              <CommonKickBan name="Player2" option="unban" banned={true} />
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Health:</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Location:</div>
              <div className="text-sm">world_the_end (-120, 65, 300)</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Last Seen:</div>
              <div className="text-sm">2025-03-25 14:30:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonPlayerList;
