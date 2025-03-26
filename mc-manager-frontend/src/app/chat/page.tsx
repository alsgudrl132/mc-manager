"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { fetchChatLogs, sendMessage } from "../store/store";
import { useQuery } from "@tanstack/react-query";
import CommonLoading from "../common/CommonLoading";
import { CommonKickBan } from "../common/CommonKickBan";
import { useRef, useState, useMemo } from "react";

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
  const [searchOption, setSearchOption] = useState("text");
  const [searchKeyword, setSearchKeyword] = useState("");
  const messageInputEl = useRef<HTMLInputElement>(null);

  const {
    data: chatLogs,
    isLoading,
    refetch,
  } = useQuery<ChatLog[]>({
    queryKey: ["chatLogs"],
    queryFn: () => fetchChatLogs({ limit: 10, player: "", search: "" }),
  });

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

  // 필터링 로직
  const displayChats = useMemo(() => {
    if (!chatLogs) return [];

    return chatLogs.filter((chatLog) =>
      searchOption === "text"
        ? chatLog.message.toLowerCase().includes(searchKeyword.toLowerCase())
        : chatLog.playerName
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase())
    );
  }, [chatLogs, searchOption, searchKeyword]);

  // 필터링 함수
  const handleFilterChat = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  // 새로고침 함수
  const refreshChatLogs = () => {
    refetch();
  };

  if (isLoading) {
    return <CommonLoading />;
  }

  function ChatData() {
    return (
      <Card className="mt-5 p-3 mr-10 w-full">
        <div className="max-h-96 overflow-y-auto">
          {displayChats.length === 0 ? (
            <div className="flex justify-center">
              <span>일치하는 채팅로그가 없습니다.</span>
            </div>
          ) : (
            displayChats.map((chatLog) => (
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
            ))
          )}
        </div>
      </Card>
    );
  }

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
          placeholder="Send global message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={messageInputEl}
        />
        <Button
          className="py-5 bg-green-400 text-black hover:bg-green-600"
          onClick={handleSendMessage}
        >
          Send Global Message
        </Button>
      </div>
      <div className="flex items-center mt-5 justify-center gap-2">
        <select
          className="rounded-lg border-2 py-2.5 pl-3 bg-white"
          onChange={(e) => setSearchOption(e.target.value)}
          value={searchOption}
        >
          <option value="text">text</option>
          <option value="name">name</option>
        </select>
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="text"
          placeholder="Search chat logs..."
          value={searchKeyword}
          onChange={(e) => handleFilterChat(e.target.value)}
        />
      </div>
      <ChatData />
    </div>
  );
}

export default Chat;
