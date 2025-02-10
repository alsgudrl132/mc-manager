import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ban, Bell, Filter, MessageSquare, VolumeX } from "lucide-react";
import React from "react";

function Chat() {
  return (
    <div className="py-7 px-5 mx-7 my-12 border-2 bg-white rounded-lg">
      <div className=" flex justify-between">
        <div className="flex gap-2">
          <MessageSquare className="w-6 h-6" />
          <span>Server Chat</span>
        </div>
        <div className="flex gap-4">
          <Filter className="w-6 h-6" />
          <Bell className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-5  flex justify-between items-center gap-4">
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Send global message..."
        />
        <Button className="py-5 bg-green-400 text-black hover:bg-green-600">
          Send Global Message
        </Button>
      </div>
      <div>
        <input
          className="py-2 mt-5 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Search chat logs..."
        />
        <Card className="mt-5 p-3 mr-10 flex w-full items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full">
            <img alt="skin" />
          </div>
          <div className="w-full items-center flex justify-between">
            <div>
              <div>
                <span className="mr-3 text-sm">Name : Player1</span>
                <span className="text-gray-600 text-sm">|</span>
                <span className="text-gray-600 text-sm ml-3">
                  2 minutes ago
                </span>
              </div>
              <div>
                <span>Anyone want to trade golden apples?</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center cursor-pointer">
                <Ban />
                <strong className="text-red-500">Kick</strong>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <VolumeX />
                <strong>Mute</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Chat;
