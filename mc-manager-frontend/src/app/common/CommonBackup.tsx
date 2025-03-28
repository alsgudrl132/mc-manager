"use client";

import { Database } from "lucide-react";
import React from "react";

function CommonBackup() {
  return (
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
  );
}

export default CommonBackup;
