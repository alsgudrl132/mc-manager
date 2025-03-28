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
import { Ban, ShieldBan } from "lucide-react";

interface IKickBanProps {
  name: string;
  option: string;
  banned: boolean;
  onActionComplete?: () => void;
}

export function CommonKickBan({ name, option, banned }: IKickBanProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-3">
          <div className="flex flex-col items-center cursor-pointer">
            {option === "kick" ? (
              <div className="flex flex-col justify-center items-center">
                <Ban />
                <strong className="text-red-500">Kick</strong>
              </div>
            ) : banned ? (
              <div className="flex flex-col justify-center items-center">
                <ShieldBan />
                <strong className="text-green-500">Unban</strong>
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
            {option === "kick"
              ? "Kick Player"
              : banned
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
          {/* 언벤할 때는 사유 입력 필드 제외 */}
          {!(option === "ban" && banned) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                className="col-span-3"
                placeholder="사유를 입력해주세요."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">
            {option === "kick"
              ? "Kick Player"
              : banned
              ? "Unban Player"
              : "Ban Player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
