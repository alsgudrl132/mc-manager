import { Database } from "lucide-react";
import React from "react";
import { createBackupWorld } from "../store/store";

function CommonBackup() {
  const handleCreateBackup = async () => {
    try {
      const result = await createBackupWorld();
      alert(result.message);
    } catch (error) {
      alert("백업 생성에 실패하였습니다." + error);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-600">Next Backup</h3>
          <p className="text-2xl font-bold">2h 15m</p>
        </div>
        <button
          className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
          onClick={handleCreateBackup}
        >
          <Database size={18} />
          <span>Backup</span>
        </button>
      </div>
    </div>
  );
}

export default CommonBackup;
