import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MapPin } from "lucide-react";

import React, { useState } from "react";
import { gamemodeChange, opStatusChange, teleport } from "../store/store";

interface IManageProps {
  name: string;
  uuid: string;
}

function CommonManage({ name, uuid }: IManageProps) {
  const [tpLocation, setTpLocation] = useState({ x: 0, y: 0, z: 0 });

  // op 변경하는 함수 true일경우 op, false일경우 not op
  const handleOpStatusChange = async (option: boolean) => {
    try {
      const result = await opStatusChange(uuid, option);
      console.log(result);
      alert(`${name} 플레이어의 op가 변경되었습니다.`);
    } catch (error) {
      alert("op 변경에 실패하였습니다." + error);
    }
  };

  // 게임모드 변경하는 함수
  const handleGamemodeChange = async (option: string) => {
    try {
      const result = await gamemodeChange(uuid, option);
      console.log(result);
      alert(`${name} 플레이어의 gamemode가 변경되었습니다.`);
    } catch (error) {
      alert("gamemode 변경에 실패하였습니다." + error);
    }
  };

  // 텔레포트 처리 함수
  const handleTeleport = async () => {
    try {
      const result = await teleport(name, tpLocation);
      console.log(result);
      alert(`${name} 플레이어의 위치가 변경되었습니다.`);
    } catch (error) {
      alert("위치변역에 실패하였습니다." + error);
    }
  };

  // 텔레포트 좌표설정 함수
  const handleTpLocation = (axis: string, location: string) => {
    setTpLocation((prev) => ({
      ...prev,
      [axis]: Number(location),
    }));
  };

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
                onClick={() => handleOpStatusChange(false)}
              >
                Not OP
              </button>
              <button
                className="border py-2 rounded-lg"
                onClick={() => handleOpStatusChange(true)}
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
                onClick={() => handleGamemodeChange("survival")}
              >
                Survival
              </button>
              <button
                className="border py-2 rounded-lg"
                onClick={() => handleGamemodeChange("creative")}
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
                onChange={(e) => handleTpLocation("x", e.target.value)}
              />
              <input
                type="number"
                placeholder="Y"
                className="border p-2 rounded-lg"
                onChange={(e) => handleTpLocation("y", e.target.value)}
              />
              <input
                type="number"
                placeholder="Z"
                className="border p-2 rounded-lg"
                onChange={(e) => handleTpLocation("z", e.target.value)}
              />
            </div>
            <button
              className="w-full border py-2 rounded-lg flex items-center justify-center gap-2"
              onClick={() => handleTeleport()}
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
