import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Power, RefreshCw } from "lucide-react";
import { serverStartManage } from "../store/store";

function CommonServerStartModal() {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState("");
  const [delay, setDelay] = useState<number>(30);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (selectedOption: string) => {
    setOption(selectedOption);
    setOpen(true);

    // 옵션에 따라 기본 메시지 설정
    if (selectedOption === "restart") {
      setMessage("서버가 곧 재시작됩니다");
    } else if (selectedOption === "stop") {
      setMessage("서버가 곧 종료됩니다");
    }
  };

  const serverRestartStopHandler = async () => {
    try {
      setIsLoading(true);
      console.log(
        `Executing ${option} with delay: ${delay}, message: ${message}`
      );
      const result = await serverStartManage(option, delay, message);
      console.log("Server command result:", result);
      alert(
        `서버 ${
          option === "restart" ? "재시작" : "종료"
        } 명령이 실행되었습니다.`
      );
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert(`오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-1 px-3 py-1 border rounded-md bg-white"
        onClick={() => handleOpenModal("restart")}
      >
        <RefreshCw size={18} />
        <span>Restart</span>
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 border rounded-md bg-red-500 text-white"
        onClick={() => handleOpenModal("stop")}
      >
        <Power size={18} />
        <span>Stop</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {option === "restart" ? "서버 재시작" : "서버 종료"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delay" className="text-right">
                딜레이 (초)
              </Label>
              <Input
                id="delay"
                type="number"
                className="col-span-3"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                메시지
              </Label>
              <Input
                id="message"
                className="col-span-3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={serverRestartStopHandler}
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommonServerStartModal;
