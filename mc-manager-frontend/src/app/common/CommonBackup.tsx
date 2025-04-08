"use client";

import { Database, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { serverBackup } from "../store/store";

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-600">Next Backup</h3>
          <p className="text-2xl font-bold">2h 15m</p>
        </div>
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
  );
}

export default CommonBackup;
