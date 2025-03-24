import React from "react";
import { Search, Shield, Ban, Navigation, Settings } from "lucide-react";

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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search players..."
            className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  <div className="text-gray-400 text-2xl">•••</div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Bico_</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      online
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Level: 0</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md text-sm">
                  <span>survival</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md text-sm">
                  <Navigation size={16} className="rotate-45" />
                  <span>Teleport</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md text-sm">
                  <Settings size={16} />
                  <span>Manage</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md text-sm">
                  <Ban size={16} />
                  <span>Kick</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Health:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "44%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">XP:</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "0%" }}
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
      </div>
    </div>
  );
};

export default OnlinePlayersComponent;
