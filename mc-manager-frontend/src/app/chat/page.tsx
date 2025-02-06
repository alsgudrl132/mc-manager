import { Button } from "@/components/ui/button";
import { Bell, Filter, MessageSquare } from "lucide-react";
import React from "react";

function Chat() {
  return (
    <div className="mx-7 my-12">
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
          placeholder="Send announcement..."
        />
        <Button className="py-5 bg-green-400 text-black hover:bg-green-600">
          Send Announcement
        </Button>
      </div>
    </div>
  );
}

export default Chat;
