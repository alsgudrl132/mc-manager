import React, { useState } from "react";
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
import { getItems, giveItems } from "../store/store";
import { useQuery } from "@tanstack/react-query";

interface Items {
  name: string;
  namespacedId: string;
  description: string;
  image: string;
  stackSize: number;
  renewable: boolean;
}

interface IPlayerName {
  playerName: string;
}

function CommonGiveItem({ playerName }: IPlayerName) {
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState(1);

  const { data: items } = useQuery({
    queryKey: ["getItems"],
    queryFn: getItems,
  });

  const filteredItems = items?.data.filter((item: Items) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const giveItemsHandler = async (item: string) => {
    try {
      const result = await giveItems(
        playerName,
        item.toLowerCase().split(" ").join("_"),
        amount
      );
      console.log(result);
    } catch (error) {
      alert(error);
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 아이템 그리드 */}
          <div className="max-h-[400px] overflow-auto">
            <div className="grid grid-cols-9 gap-1">
              {filteredItems?.map((item: Items, index: number) => (
                <div
                  key={index}
                  title={item.name}
                  className="relative w-12 h-12 bg-gray-100 border border-gray-300 hover:border-blue-500 cursor-pointer"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={item.image} alt={item.name} />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] bg-white border-gray-200">
                      <DialogHeader>
                        <DialogTitle>아이템 지급</DialogTitle>
                        <DialogDescription>
                          {playerName}에게 지급할 수량을 입력하세요
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-4 text-center ">
                        <span>{item.name}</span>
                        <div className="flex items-center justify-center mb-4">
                          <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center">
                              <img src={item.image} alt={item.name} />
                            </div>
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
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-20 text-center border-gray-300"
                          />
                          <Button
                            variant="outline"
                            className="h-10 w-10 p-0 border-gray-300"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => giveItemsHandler(item.namespacedId)}
                        >
                          지급하기
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommonGiveItem;
