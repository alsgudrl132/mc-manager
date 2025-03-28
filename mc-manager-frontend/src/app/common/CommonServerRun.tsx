"use client";

import React from "react";
import { ArrowRightCircleIcon, Power, RefreshCw } from "lucide-react";

function CommonServerRun() {
  // 서버가 온라인 상태로 하드코딩
  const isOnline = true;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-600">
          {isOnline ? "Online" : "Offline"}
        </h2>
        {isOnline ? (
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
        ) : (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-green-400"
              onClick={() => alert("서버를 시작했습니다.")}
            >
              <ArrowRightCircleIcon size={18} />
              <span>Start</span>
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600">Running 24d 12h</p>
    </div>
  );
}

export default CommonServerRun;
