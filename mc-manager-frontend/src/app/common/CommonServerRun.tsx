"use client";

import React from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { serverStartManage, useServerStateStore } from "../store/store";
import CommonServerStartModal from "./CommonServerStartModal";

function CommonServerRun() {
  const { status } = useServerStateStore();

  const serverStartHandler = async (option: string) => {
    try {
      const result = await serverStartManage(option);
      console.log(result);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-600">
          {status === "online" ? "Online" : "Offline"}
        </h2>
        {status === "online" ? (
          // 서버가 실행중일때 재시작, 종료 보이게 설정
          <div className="flex gap-2">
            <CommonServerStartModal />
          </div>
        ) : (
          // 서버가 종료중일때 시작 보이게 설정
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-green-400"
              onClick={() => serverStartHandler("start")}
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
