import React, { useEffect } from "react";
import CommonLoading from "./CommonLoading";
import { controlServer, useServerStore } from "../store/store";
import { ArrowRightCircleIcon, Power, RefreshCw } from "lucide-react";

function CommonServerRun() {
  interface IControlServer {
    success: boolean;
    message: string;
  }
  const { serverStatus, isLoading, fetchServerStatus } = useServerStore();

  useEffect(() => {
    fetchServerStatus();
  }, [fetchServerStatus]);

  if (isLoading && !serverStatus) {
    return <CommonLoading />;
  }

  const handleControlServer = async (option: string) => {
    try {
      const result: IControlServer = await controlServer(option);
      alert(
        result.success
          ? `서버 ${option} 에 성공하였습니다.`
          : `서버 ${option} 에 실패하였습니다.`
      );
    } catch (error) {
      alert(`서버 ${option}에 실패하였습니다. ${error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-600">
          {serverStatus?.actuallyOnline ? "Online" : "Offline"}
        </h2>
        {serverStatus?.actuallyOnline ? (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
              onClick={() => handleControlServer("restart")}
            >
              <RefreshCw size={18} />
              <span>Restart</span>
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-red-500 text-white"
              onClick={() => handleControlServer("stop")}
            >
              <Power size={18} />
              <span>Stop</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 border rounded-md bg-green-400"
              onClick={() => handleControlServer("start")}
            >
              <ArrowRightCircleIcon size={18} />
              <span>Start</span>
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600">Running {serverStatus?.uptime}</p>
    </div>
  );
}

export default CommonServerRun;
