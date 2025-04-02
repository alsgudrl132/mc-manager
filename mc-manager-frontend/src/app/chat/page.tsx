"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { CommonKickBan } from "../common/CommonKickBan";
import { fetchChatLogs, sendGlobalMessage } from "../store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CommonError from "../common/CommonError";
import CommonLoading from "../common/CommonLoading";
import { useRef, useState } from "react";
interface IChatLogs {
  id: number;
  timestamp: number;
  uuid: string;
  playerName: string;
  message: string;
  isBanned: boolean;
}

function Chat() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const {
    data: chatLogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatLogs"],
    queryFn: fetchChatLogs,
    refetchInterval: 5000,
  });

  const onActionHandler = () => {
    queryClient.invalidateQueries({ queryKey: ["chatLogs"] });
  };

  const onSendGlobalMessageHandler = async () => {
    setLoading(true);
    try {
      if (message === "") {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        const result = await sendGlobalMessage(message);
        alert(result.data.message + " " + message);
        setMessage("");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <CommonLoading />;
  if (error) return <CommonError />;

  return (
    <div className="pt-4 pb-3 px-5 mx-7 my-12 border-2 bg-white rounded-lg">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MessageSquare className="w-6 h-6" />
          <span>Server Chat</span>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-center gap-4">
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          placeholder="Send global message..."
        />
        <Button
          className="py-5 bg-green-400 text-black hover:bg-green-600"
          onClick={() => onSendGlobalMessageHandler()}
        >
          Send Global Message
        </Button>
      </div>
      <div className="flex items-center mt-5 justify-center gap-2">
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Search chat logs..."
        />
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Filter by player name"
        />
      </div>
      <Card className="mt-5 p-3 mr-10 w-full">
        <div className="max-h-96 overflow-y-auto">
          {/* 채팅 로그 */}
          {chatLogs?.data.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              검색 결과가 없습니다.
            </div>
          ) : (
            chatLogs?.data?.data.map((chat: IChatLogs) => (
              <div
                key={chat.id}
                className="mb-2 w-full flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={`https://mc-heads.net/avatar/${chat.uuid}`}
                    alt="Player1's skin"
                    className="w-full h-full"
                  />
                </div>
                <div className="w-full items-center flex justify-between">
                  <div className="overflow-hidden">
                    <div>
                      <span className="mr-3 text-sm">
                        Name : {chat.playerName}
                      </span>
                      <span className="text-gray-600 text-sm">|</span>
                      <span className="text-gray-600 text-sm ml-3">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="break-words">
                      <span>{chat.message}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <CommonKickBan
                      name={chat.playerName}
                      option="kick"
                      isBanned={chat.isBanned}
                      onActionComplete={onActionHandler}
                    />
                    <CommonKickBan
                      name={chat.playerName}
                      option="ban"
                      isBanned={chat.isBanned}
                      onActionComplete={onActionHandler}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default Chat;
