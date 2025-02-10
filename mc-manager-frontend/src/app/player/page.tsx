import { Card, CardTitle } from "@/components/ui/card";
import { Ban, Gamepad, Map, Search, Settings, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

function player() {
  return (
    <div>
      <Card className="py-7 px-5 mx-7 my-12 border-2 bg-white rounded-lg">
        <div className="flex gap-5 items-center mb-5">
          <Users />
          <CardTitle className="font-bold text-xl">Online Players</CardTitle>
        </div>
        <div className="flex pt-3 pb-3 bg-white border-2 rounded-lg">
          <Search className="ml-5" />
          <input
            className="ml-2 mr-2 w-full"
            type="text"
            placeholder="Search Players..."
          />
        </div>
        <Card className="mt-5 p-3">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full">
                <img alt="skin" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold">Player_1</p>
                <span className="px-2 py-1 text-sm bg-emerald-100 text-emerald-700 rounded">
                  online
                </span>
                <span className="text-yellow-500">👑</span>
              </div>
              <p className="text-gray-500">Level 42</p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2 items-center border-2 rounded-lg py-1 px-3">
                <Gamepad />
                survival
              </div>
              <div className="flex gap-2 items-center border-2 rounded-lg py-1 px-3">
                <Map />
                Teleport
              </div>
              <div className="flex gap-2 items-center border-2 rounded-lg py-1 px-3">
                <Settings />
                Manage
              </div>
              <div className="flex gap-2 items-center border-2 rounded-lg py-1 px-3 bg-red-500 text-white">
                <Ban />
                Kick
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-2 mb-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Health:</span>
              </div>
              <Progress
                value={80}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-red-500"
              >
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: "80%" }}
                />
              </Progress>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Hunger:</span>
              </div>
              <Progress
                value={70}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-yellow-500"
              >
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: "70%" }}
                />
              </Progress>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">XP:</span>
              </div>
              <Progress
                value={30}
                className="h-2 bg-gray-200"
                indicatorClassName="bg-green-500"
              >
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "30%" }}
                />
              </Progress>
            </div>

            <div>
              <div className="flex items-center justify-center mb-2">
                <span className="font-medium">Location:</span>
                <span className="text-gray-600">world (-123, 64, 789)</span>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}

export default player;
