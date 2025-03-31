import { AlertTriangle } from "lucide-react";
import React from "react";

function CommonError({ message = "오류가 발생했습니다. 다시 시도해 주세요." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-red-500 font-medium text-center">{message}</p>
    </div>
  );
}

export default CommonError;
