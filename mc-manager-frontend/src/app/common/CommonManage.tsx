import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { gamemodeChange, opStatusChange } from "../store/store";

interface IManageProps {
  name: string;
  uuid: string;
}

function CommonManage({ name, uuid }: IManageProps) {
  const handleOpStatusChange = async (option: boolean) => {
    try {
      const result = await opStatusChange(uuid, option);
      console.log(result);
      alert(`${name} 플레이어의 op가 변경되었습니다.`);
    } catch (error) {
      alert("op 변경에 실패하였습니다." + error);
    }
  };

  const handleGamemodeChange = async (option: string) => {
    try {
      const result = await gamemodeChange(uuid, option);
      console.log(result);
      alert(`${name} 플레이어의 gamemode가 변경되었습니다.`);
    } catch (error) {
      alert("gamemode 변경에 실패하였습니다." + error);
    }
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
          <DialogTitle>Manage</DialogTitle>
          <DialogDescription>{name}</DialogDescription>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonManage;
