"use client";

import React from "react";
import CommonServerRun from "../common/CommonServerRun";
import CommonBackup from "../common/CommonBackup";
import CommonBackupManage from "../common/CommonBackupManage";
import CommonWorldManage from "../common/CommonWorldManage";
import CommonPerformance from "../common/CommonPerformance";

function Admin() {
  return (
    <div className="p-6 space-y-6 overflow-auto">
      <CommonServerRun />

      {/* 다음 재시작 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-600">Next Restart</h3>
            <p className="text-2xl font-bold">6h 00m</p>
          </div>
        </div>
      </div>

      {/* 백업 카드 */}
      <CommonBackup />

      {/* 백업 관리 카드 */}
      <CommonBackupManage />

      {/* 퍼포먼스 모니터링 카드 */}
      <CommonPerformance />

      {/* 월드 설정 카드 */}
      <CommonWorldManage />

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
