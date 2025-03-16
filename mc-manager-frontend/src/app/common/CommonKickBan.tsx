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
import { useState } from "react";
import { kickBanPlayer } from "../store/store";

interface IKickProps {
  name: string;
  uuid: string;
  option: string;
}

export function CommonKickBan({ name, uuid, option }: IKickProps) {
  const [reason, setReason] = useState("");

  const handleKickBan = async (option: string) => {
    try {
      const result = await kickBanPlayer(uuid, reason, option);

      console.log(result);
      alert(
        `${name} 플레이어가 ${option === "kick" ? "추방" : "벤"} 되었습니다.`
      );
    } catch (error) {
      alert(`${option === "kick" ? "추방" : "벤"} 에 실패하였습니다 ${error}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-3">
          <div className="flex flex-col items-center cursor-pointer">
            {option === "ban" ? (
              <div className="flex flex-col justify-center items-center ">
                <ShieldBan />
                <strong className="text-red-500">Ban</strong>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <Ban />
                <strong className="text-red-500">Kick</strong>
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {option === "ban" ? (
            <DialogTitle>Ban Player</DialogTitle>
          ) : (
            <DialogTitle>Kick Player</DialogTitle>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Reason
            </Label>
            <Input
              id="username"
              className="col-span-3"
              onChange={(e) => setReason(e.target.value)}
              placeholder="사유를 입력해주세요."
            />
          </div>
        </div>
        <DialogFooter>
          {option === "ban" ? (
            <Button type="submit" onClick={() => handleKickBan("ban")}>
              Confirm
            </Button>
          ) : (
            <Button type="submit" onClick={() => handleKickBan("kick")}>
              Confirm
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
