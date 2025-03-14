"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ban, Bell, Filter, MessageSquare, VolumeX } from "lucide-react";
import React from "react";
import { fetchChatLogs } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import CommonLoading from "../common/CommonLoading";

interface ChatLog {
  id: number;
  timestamp: number;
  uuid: string;
  playerName: string | null;
  message: string;
}

function Chat() {
  const { data: chatLogs, isLoading } = useQuery<ChatLog[]>({
    queryKey: ["chatLogs"],
    queryFn: () => fetchChatLogs({ limit: 10, player: "", search: "" }),
  });

  if (isLoading) {
    return <CommonLoading />;
  }

  function ChatData() {
    return (
      <Card className="mt-5 p-3 mr-10 w-full items-center gap-4">
        {chatLogs?.map((chatLog) => (
          <div key={chatLog.id} className="mb-2 w-full flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full overflow-hidden">
              <img
                src={`https://mc-heads.net/avatar/${chatLog.uuid}`}
                alt={`${chatLog.playerName || "Unknown"}'s skin`}
                className="w-full h-full"
              />
            </div>
            <div className="w-full items-center flex justify-between">
              <div>
                <div>
                  <span className="mr-3 text-sm">
                    Name : {chatLog.playerName}
                  </span>
                  <span className="text-gray-600 text-sm">|</span>
                  <span className="text-gray-600 text-sm ml-3">
                    {new Date(chatLog.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span>{chatLog.message}</span>
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
          </div>
        ))}
      </Card>
    );
  }

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
      <ChatData />
      <div>
        <input
          className="py-2 mt-5 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Search chat logs..."
        />
      </div>
    </div>
  );
}

export default Chat;
