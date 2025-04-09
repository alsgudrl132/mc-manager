import { Settings } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
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
import { useBackupStore } from "../store/store";

interface TimeInterval {
  hours: number;
  minutes: number;
}

function CommonBackupSetup() {
  const [timeInterval, setTimeInterval] = useState<TimeInterval>({
    hours: 2,
    minutes: 30,
  });

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTimeInterval((prev) => ({ ...prev, hours: value }));
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTimeInterval((prev) => ({ ...prev, minutes: value }));
  };

  const { setStoreTimeInterval } = useBackupStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 py-1 border rounded-md bg-white">
          <div className="flex items-center gap-1">
            <Settings size={18} />
            BackupSetup
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Backup setup</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Next Backup</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="24"
                value={timeInterval.hours}
                onChange={handleHourChange}
                className="w-20"
              />
              <span>시간</span>
              <Input
                type="number"
                min="0"
                max="59"
                value={timeInterval.minutes}
                onChange={handleMinuteChange}
                className="w-20"
              />
              <span>분</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => setStoreTimeInterval(timeInterval)}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CommonBackupSetup;
