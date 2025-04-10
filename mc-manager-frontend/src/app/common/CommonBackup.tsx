"use client";

import { Database, Loader2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useBackupStore } from "../store/store";
import CommonBackupSetup from "./CommonBackupSetup";
import { formatMillisecondsToHoursMinutes } from "@/utils/util";

function CommonBackup() {
  const [loading, setLoading] = useState(false);
  const [timerUpdated, setTimerUpdated] = useState(false);

  // 백업 스토어에서 필요한 상태와 메서드 가져오기
  const { currentRemainingTime, updateTimer, performBackup, isBackingUp } =
    useBackupStore();

  // 1초마다 타이머 업데이트 확인 (useCallback으로 래핑하여 의존성 문제 방지)
  const checkTimerUpdate = useCallback(() => {
    const wasUpdated = updateTimer();

    // 타이머가 업데이트 되었으면 시각적 피드백 표시
    if (wasUpdated) {
      setTimerUpdated(true);

      // 3초 후 알림 상태 초기화
      setTimeout(() => {
        setTimerUpdated(false);
      }, 3000);
    }
  }, [updateTimer]);

  // 컴포넌트 마운트 시 타이머 업데이트 간격 설정
  useEffect(() => {
    console.log("Setting up timer interval");

    // 컴포넌트 마운트 시 즉시 타이머 확인
    checkTimerUpdate();

    // 1초마다 타이머 확인
    const intervalId = setInterval(checkTimerUpdate, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      console.log("Clearing timer interval");
      clearInterval(intervalId);
    };
  }, [checkTimerUpdate]);

  // 수동 백업 실행 함수
  const handleManualBackup = async () => {
    if (isBackingUp) return; // 이미 백업 중이면 무시

    setLoading(true);
    try {
      await performBackup();
    } catch (error) {
      console.error("Manual backup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-600">Next Backup</h3>
          <div className="flex items-center">
            <p
              className={`text-2xl font-bold ${
                timerUpdated ? "text-green-500" : ""
              }`}
            >
              {formatMillisecondsToHoursMinutes(currentRemainingTime)}
            </p>
            {timerUpdated && (
              <span className="ml-2 text-sm text-green-500 animate-pulse">
                1분 경과!
              </span>
            )}
            {isBackingUp && (
              <span className="ml-2 text-sm text-blue-500 animate-pulse">
                백업 진행 중...
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <CommonBackupSetup />
          <button
            className="px-3 py-1 border rounded-md bg-white"
            onClick={handleManualBackup}
            disabled={loading || isBackingUp}
          >
            {loading || isBackingUp ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {loading ? "로딩중..." : "백업 중..."}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <Database size={18} />
                <span>백업</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonBackup;
