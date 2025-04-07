import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getItems } from "../store/store";
import { useQuery } from "@tanstack/react-query";

interface Items {
  name: string;
  namespacedId: string;
  description: string;
  image: string;
  stackSize: number;
  renewable: boolean;
}

function CommonGiveItem() {
  const { data: items } = useQuery({
    queryKey: ["getItems"],
    queryFn: getItems,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="font-medium mb-3 text-center">Give item</div>
          <div>
            <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-colors">
              Open
            </button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] p-0 bg-white border-gray-200">
        <DialogHeader className="bg-gray-100 p-4 border-b border-gray-200">
          <DialogTitle>Give item</DialogTitle>
          <DialogDescription>
            Select an item to give to the player.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="mb-4">
            <Label htmlFor="itme-name" className="mb-2 block font-bold">
              Item name
            </Label>
            <Input
              id="itme-name"
              placeholder="diamond"
              className="border-gray-300"
            />
          </div>

          {/* 아이템 그리드 */}
          <div className="max-h-[400px] overflow-auto">
            <div className="grid grid-cols-9 gap-1">
              {items?.data.map((item: Items, index: number) => (
                <div
                  key={index}
                  title={item.name}
                  className="relative w-12 h-12 bg-gray-100 border border-gray-300 hover:border-blue-500 cursor-pointer"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img src={item.image} alt={item.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* 수량 입력 모달 구조 */}
      <Dialog>
        <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle>아이템 지급</DialogTitle>
            <DialogDescription>지급할 수량을 입력하세요</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center">
                {/* 선택한 아이템 이미지 자리 */}
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <Button
                variant="outline"
                className="h-10 w-10 p-0 border-gray-300"
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                max="64"
                defaultValue="1"
                className="w-20 text-center border-gray-300"
              />
              <Button
                variant="outline"
                className="h-10 w-10 p-0 border-gray-300"
              >
                +
              </Button>
            </div>

            <div className="flex justify-center mt-2">
              <span className="text-gray-500 text-sm">최대 64개</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="border-gray-300">
              취소
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              지급하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default CommonGiveItem;
