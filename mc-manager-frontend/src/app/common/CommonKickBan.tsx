"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ban, Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { kickBanPlayer, unBanPlayer } from "../store/store";
import { useState } from "react";

interface IKickBanProps {
  name: string;
  option?: "kick" | "ban" | "unban"; // "unban" 추가
  onActionComplete?: () => void;
  isBanned?: boolean;
}

export function CommonKickBan({
  name,
  option = "ban",
  isBanned = false,
  onActionComplete,
}: IKickBanProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const kickBanPlayerHandler = async () => {
    setLoading(true);
    try {
      // 실제 API 호출 시 사용할 option
      const actionOption = option === "kick" ? "kick" : "ban";
      const result = await kickBanPlayer(name, actionOption, reason);
      alert(result.data.message);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const unBanPlayerHandler = async () => {
    setLoading(true);
    try {
      const result = await unBanPlayer(name);
      alert(result.data.message);
      if (onActionComplete) onActionComplete();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // 현재 액션 타입 결정 (kick, ban, unban)
  const actionType =
    option === "kick"
      ? "kick"
      : option === "unban" || isBanned
      ? "unban"
      : "ban";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-3">
          <div className="flex flex-col items-center cursor-pointer">
            {actionType === "kick" ? (
              <div className="flex flex-col justify-center items-center">
                <Ban />
                <strong className="text-red-500">Kick</strong>
              </div>
            ) : actionType === "unban" ? (
              <div className="flex flex-col justify-center items-center">
                <ShieldCheck />
                <strong className="text-green-500">UnBan</strong>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <ShieldBan />
                <strong className="text-red-500">Ban</strong>
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {actionType === "kick"
              ? "Kick Player"
              : actionType === "unban"
              ? "Unban Player"
              : "Ban Player"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} readOnly className="col-span-3" />
          </div>
          {actionType !== "unban" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                className="col-span-3"
                placeholder="사유를 입력해주세요."
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() =>
              actionType === "unban"
                ? unBanPlayerHandler()
                : kickBanPlayerHandler()
            }
            variant={actionType === "unban" ? "default" : "destructive"}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </span>
            ) : actionType === "kick" ? (
              "Kick Player"
            ) : actionType === "unban" ? (
              "UnBan Player"
            ) : (
              "Ban Player"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
