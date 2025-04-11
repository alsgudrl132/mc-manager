import React from "react";
import { useServerStateStore } from "../store/store";

function CommonPerformance() {
  const { usedMemory, totalMemory, tps } = useServerStateStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-3">Performance Monitoring</h3>
      <div className="grid gap-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">TPS</span>
            <span className="text-sm font-medium">{tps}/20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(tps / 20) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Memory</span>
            <span className="text-sm font-medium">
              {usedMemory}/{totalMemory}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(usedMemory / totalMemory) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonPerformance;
