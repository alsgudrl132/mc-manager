"use client";

import React from "react";
import {
  RefreshCw,
  Power,
  Database,
  Sun,
  Moon,
  CloudRain,
  Cloud,
  ArrowDown,
} from "lucide-react";

function Admin() {
  return (
    <div className="p-6 space-y-6">
      {/* 서버 상태 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-600">Server Online</h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
              onClick={() => alert("서버를 재시작했습니다.")}
            >
              <RefreshCw size={18} />
              <span>Restart</span>
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-red-500 text-white"
              onClick={() => alert("서버를 중지했습니다.")}
            >
              <Power size={18} />
              <span>Stop</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600">Running for 24d 12h</p>
      </div>

      {/* 다음 백업 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-600">Next Backup</h3>
            <p className="text-2xl font-bold">2h 15m</p>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
            onClick={() => alert("월드를 백업했습니다.")}
          >
            <Database size={18} />
            <span>Backup</span>
          </button>
        </div>
      </div>

      {/* 다음 재시작 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-600">Next Restart</h3>
            <p className="text-2xl font-bold">6h 00m</p>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white opacity-50 cursor-not-allowed">
            <span>?</span>
          </button>
        </div>
      </div>

      {/* 퍼포먼스 모니터링 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Performance Monitoring</h3>
        <div className="grid gap-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">TPS</span>
              <span className="text-sm font-medium">19.8/20</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "99%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Memory</span>
              <span className="text-sm font-medium">3.2GB/4GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">CPU</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 월드 설정 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">World Settings</h3>

        {/* 날씨 설정 */}
        <div className="mb-4">
          <p className="text-md font-medium mb-2">Weather</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              className="flex items-center justify-center gap-2 border py-2 rounded-lg"
              onClick={() => alert("날씨를 맑음으로 변경했습니다.")}
            >
              <Cloud size={16} />
              <span>Clear</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 border py-2 rounded-lg"
              onClick={() => alert("날씨를 비로 변경했습니다.")}
            >
              <CloudRain size={16} />
              <span>Rain</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 border py-2 rounded-lg"
              onClick={() => alert("날씨를 폭풍으로 변경했습니다.")}
            >
              <CloudRain size={16} />
              <span>Storm</span>
            </button>
          </div>
        </div>

        {/* 시간 설정 */}
        <div>
          <p className="text-md font-medium mb-2">Time</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center gap-2 border py-2 rounded-lg"
              onClick={() => alert("시간을 낮으로 변경했습니다.")}
            >
              <Sun size={16} />
              <span>Day</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 border py-2 rounded-lg"
              onClick={() => alert("시간을 밤으로 변경했습니다.")}
            >
              <Moon size={16} />
              <span>Night</span>
            </button>
          </div>
        </div>
      </div>

      {/* 백업 관리 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Backup Management</h3>

        {/* 최신 백업 */}
        <div className="border-b pb-3 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Latest Backup</p>
              <p className="text-sm text-gray-600">2025-03-28 15:00</p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
                onClick={() => alert("백업 파일을 다운로드합니다.")}
              >
                <ArrowDown size={16} />
                <span>Download</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
                onClick={() => alert("이 백업으로 복원하시겠습니까?")}
              >
                <span>Restore</span>
              </button>
            </div>
          </div>
        </div>

        {/* 자동 백업 */}
        <div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto Backup</p>
              <p className="text-sm text-gray-600">2025-03-28 10:00</p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
                onClick={() => alert("백업 파일을 다운로드합니다.")}
              >
                <ArrowDown size={16} />
                <span>Download</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
                onClick={() => alert("이 백업으로 복원하시겠습니까?")}
              >
                <span>Restore</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 서버 로그 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Server Logs</h3>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-48 overflow-y-auto">
          <div>[15:00:23] Server backup completed successfully</div>
          <div>[14:58:12] Player Player1 logged in</div>
          <div className="text-yellow-400">
            [14:55:01] Warning: TPS dropped to 19.5
          </div>
          <div>[14:52:45] Player Player2 logged out</div>
          <div className="text-red-400">
            [14:50:30] Error: Failed to load chunk at (120, -340)
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
