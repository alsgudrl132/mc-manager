"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Filter, MessageSquare } from "lucide-react";
import { fetchChatLogs, sendMessage } from "../store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CommonLoading from "../common/CommonLoading";
import { CommonKickBan } from "../common/CommonKickBan";
import { useRef, useState } from "react";

interface ChatLog {
  id: number;
  timestamp: number;
  uuid: string;
  playerName: string | null;
  message: string;
  banned: boolean;
}

function Chat() {
  const [message, setMessage] = useState("");
  const messageInputEl = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    try {
      if (message === "") {
        alert("메세지를 입력해주세요.");
        messageInputEl.current?.focus();
      } else {
        const result = await sendMessage(message);
        console.log(result);
        alert(`${message} 글로벌 메세지가 전달되었습니다`);
        setMessage("");
      }
    } catch (error) {
      alert("메세지 전달에 실패하였습니다" + error);
    }
  };

  const queryClient = useQueryClient();
  const { data: chatLogs, isLoading } = useQuery<ChatLog[]>({
    queryKey: ["chatLogs"],
    queryFn: () => fetchChatLogs({ limit: 10, player: "", search: "" }),
  });

  // 벤/언벤 후 데이터 새로고침 함수
  const refreshChatLogs = () => {
    queryClient.invalidateQueries({ queryKey: ["chatLogs"] });
  };

  if (isLoading) {
    return <CommonLoading />;
  }

  function ChatData() {
    return (
      <Card className="mt-5 p-3 mr-10 w-full">
        <div className="max-h-96 overflow-y-auto">
          {chatLogs?.map((chatLog) => (
            <div
              key={chatLog.id}
              className="mb-2 w-full flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={`https://mc-heads.net/avatar/${chatLog.uuid}`}
                  alt={`${chatLog.playerName || "Unknown"}'s skin`}
                  className="w-full h-full"
                />
              </div>
              <div className="w-full items-center flex justify-between">
                <div className="overflow-hidden">
                  <div>
                    <span className="mr-3 text-sm">
                      Name : {chatLog.playerName}
                    </span>
                    <span className="text-gray-600 text-sm">|</span>
                    <span className="text-gray-600 text-sm ml-3">
                      {new Date(chatLog.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="break-words">
                    <span>{chatLog.message}</span>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <CommonKickBan
                    name={chatLog.playerName ?? ""}
                    uuid={chatLog.uuid}
                    option="kick"
                    banned={chatLog.banned}
                    onActionComplete={refreshChatLogs}
                  />
                  <CommonKickBan
                    name={chatLog.playerName ?? ""}
                    uuid={chatLog.uuid}
                    option="ban"
                    banned={chatLog.banned}
                    onActionComplete={refreshChatLogs}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="pt-4 pb-3 px-5 mx-7 my-12 border-2 bg-white rounded-lg">
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
          onChange={(e) => setMessage(e.target.value)}
          ref={messageInputEl}
        />
        <Button
          className="py-5 bg-green-400 text-black hover:bg-green-600"
          onClick={() => handleSendMessage()}
        >
          Send Global Message
        </Button>
      </div>
      <div>
        <input
          className="py-2 mt-5 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Search chat logs..."
        />
      </div>
      <ChatData />
    </div>
  );
}

export default Chat;
