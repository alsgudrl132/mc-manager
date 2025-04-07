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
import {
  gamemodeManage,
  operatorStatusManage,
  teleportMange,
} from "../store/store";
import { useState } from "react";
import CommonLoading from "./CommonLoading";
import CommonGiveItem from "./CommonGiveItem";

interface IManageProps {
  name: string;
  currentLocationX: number;
  currentLocationY: number;
  currentLocationZ: number;
}

function CommonManage({
  name,
  currentLocationX,
  currentLocationY,
  currentLocationZ,
}: IManageProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
    x: Math.round(currentLocationX),
    y: Math.round(currentLocationY),
    z: Math.round(currentLocationZ),
  });

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

  const gamemodeHandler = async (option: string) => {
    setLoading(true);
    try {
      const result = await gamemodeManage(name, option);
      if (result.data.data.response === "") {
        alert(`${name} is already in ${option} mode.`);
      } else {
        alert(result.data.data.response);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const locationHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: string
  ) => {
    setLocation((prevState) => {
      return { ...prevState, [option]: event?.target.value };
    });
  };

  const teleportHandler = async () => {
    setLoading(true);
    try {
      const result = await teleportMange(name, location);
      alert(result.data.data.response);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <CommonLoading />
          </div>
        )}
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
                onClick={() => gamemodeHandler("survival")}
              >
                Survival
              </button>
              <button
                className="border py-2 rounded-lg"
                onClick={() => gamemodeHandler("creative")}
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
                value={location.x}
                onChange={(e) => {
                  locationHandler(e, "x");
                }}
              />
              <input
                type="number"
                placeholder="Y"
                className="border p-2 rounded-lg"
                value={location.y}
                onChange={(e) => {
                  locationHandler(e, "y");
                }}
              />
              <input
                type="number"
                placeholder="Z"
                className="border p-2 rounded-lg"
                value={location.z}
                onChange={(e) => {
                  locationHandler(e, "z");
                }}
              />
            </div>
            <button
              className="w-full border py-2 rounded-lg flex items-center justify-center gap-2"
              onClick={() => teleportHandler()}
            >
              <MapPin size={16} />
              <span>Teleport</span>
            </button>
          </div>
          <CommonGiveItem playerName={name} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonManage;
