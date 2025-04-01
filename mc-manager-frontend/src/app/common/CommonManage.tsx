"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MapPin } from "lucide-react";
import { operatorStatusManage } from "../store/store";
import { useState } from "react";
import CommonLoading from "./CommonLoading";

interface IManageProps {
  name: string;
}

function CommonManage({ name }: IManageProps) {
  const [loading, setLoading] = useState(false);

  const operatorStatusHandler = async (option: string) => {
    setLoading(true);
    try {
      const result = await operatorStatusManage(name, option);
      alert(result.data.data.response);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) <CommonLoading />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md text-sm">
          <Settings size={16} />
          <span>Manage</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Player</DialogTitle>
          <DialogDescription>{name} 플레이어 관리</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3">Operator Status</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="border py-2 rounded-lg"
                onClick={() => operatorStatusHandler("deop")}
              >
                Not OP
              </button>
              <button
                className="border py-2 rounded-lg"
                onClick={() => operatorStatusHandler("op")}
              >
                OP
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3">Game Mode</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="border py-2 rounded-lg"
                onClick={() => alert("서바이벌 모드로 변경했습니다.")}
              >
                Survival
              </button>
              <button
                className="border py-2 rounded-lg"
                onClick={() => alert("크리에이티브 모드로 변경했습니다.")}
              >
                Creative
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium mb-3">Teleport</div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <input
                type="number"
                placeholder="X"
                className="border p-2 rounded-lg"
                defaultValue="0"
              />
              <input
                type="number"
                placeholder="Y"
                className="border p-2 rounded-lg"
                defaultValue="64"
              />
              <input
                type="number"
                placeholder="Z"
                className="border p-2 rounded-lg"
                defaultValue="0"
              />
            </div>
            <button
              className="w-full border py-2 rounded-lg flex items-center justify-center gap-2"
              onClick={() => alert("플레이어를 텔레포트했습니다.")}
            >
              <MapPin size={16} />
              <span>Teleport</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonManage;
