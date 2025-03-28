"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { CommonKickBan } from "../common/CommonKickBan";

function Chat() {
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
        />
        <Button
          className="py-5 bg-green-400 text-black hover:bg-green-600"
          onClick={() => alert("메시지를 전송했습니다!")}
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
          placeholder="Filter by player UUID..."
        />
        <input
          className="py-2 pl-3 rounded-lg w-full border-2"
          type="number"
          placeholder="Limit results..."
          defaultValue={100}
        />
      </div>
      <Card className="mt-5 p-3 mr-10 w-full">
        <div className="max-h-96 overflow-y-auto">
          {/* 채팅 로그 1 */}
          <div className="mb-2 w-full flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="https://mc-heads.net/avatar/Player1"
                alt="Player1's skin"
                className="w-full h-full"
              />
            </div>
            <div className="w-full items-center flex justify-between">
              <div className="overflow-hidden">
                <div>
                  <span className="mr-3 text-sm">Name : Player1</span>
                  <span className="text-gray-600 text-sm">|</span>
                  <span className="text-gray-600 text-sm ml-3">
                    2025-03-28 10:45:23
                  </span>
                </div>
                <div className="break-words">
                  <span>안녕하세요! 오늘 날씨가 정말 좋네요.</span>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <CommonKickBan name="Player1" option="kick" banned={false} />
                <CommonKickBan name="Player1" option="ban" banned={false} />
              </div>
            </div>
          </div>

          {/* 채팅 로그 2 */}
          <div className="mb-2 w-full flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="https://mc-heads.net/avatar/Admin"
                alt="Admin's skin"
                className="w-full h-full"
              />
            </div>
            <div className="w-full items-center flex justify-between">
              <div className="overflow-hidden">
                <div>
                  <span className="mr-3 text-sm">Name : Admin</span>
                  <span className="text-gray-600 text-sm">|</span>
                  <span className="text-gray-600 text-sm ml-3">
                    2025-03-28 10:46:15
                  </span>
                </div>
                <div className="break-words">
                  <span>
                    서버 점검은 오늘 오후 3시에 있을 예정입니다. 모두
                    로그아웃해주세요.
                  </span>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <CommonKickBan name="Admin" option="kick" banned={false} />
                <CommonKickBan name="Admin" option="ban" banned={false} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Chat;
