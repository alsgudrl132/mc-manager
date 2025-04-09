"use client";

import { Database, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { serverBackup, useBackupStore } from "../store/store";
import CommonBackupSetup from "./CommonBackupSetup";
import { formatMillisecondsToHoursMinutes } from "@/utils/util";

function CommonBackup() {
  const [loading, setLoading] = useState(false);
  const backupHandler = async () => {
    setLoading(true);
    try {
      const result = await serverBackup();
      if (result.data.success)
        alert(result.data.message + "\n" + result.data.data.name);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const { backupDelayTime } = useBackupStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-600">Next Backup</h3>
          <p className="text-2xl font-bold">
            {formatMillisecondsToHoursMinutes(backupDelayTime)}
          </p>
        </div>
        <div className="flex gap-2">
          <CommonBackupSetup />
          <button
            className="px-3 py-1 border rounded-md bg-white"
            onClick={() => backupHandler()}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <Database size={18} />
                <span>Backup</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonBackup;
