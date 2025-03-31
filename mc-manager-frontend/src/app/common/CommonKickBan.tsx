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
import { Ban, Loader2, ShieldBan } from "lucide-react";
import { kickBanPlayer } from "../store/store";
import { useState } from "react";

interface IKickBanProps {
  name: string;
  option: string;
  onActionComplete?: () => void;
}

export function CommonKickBan({ name, option }: IKickBanProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const kickBanPlayerHandler = async () => {
    setLoading(true);
    try {
      const result = await kickBanPlayer(name, option, reason);
      alert(result.data.message);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

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
            {option === "kick" ? "Kick Player" : "Ban Player"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} readOnly className="col-span-3" />
          </div>
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => kickBanPlayerHandler()}>
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </span>
            ) : option === "kick" ? (
              "Kick Player"
            ) : (
              "Ban Player"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
