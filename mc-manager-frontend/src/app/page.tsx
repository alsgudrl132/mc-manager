import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Database, Search, Users } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="flex">
        <Card className="max-w-48  max-h-32 mt-10 ml-10 bg-gray-50">
          <CardContent className="mt-5">
            <div className="flex justify-between">
              <div>
                <CardTitle className="mb-3 text-gray-500">
                  Active Players
                </CardTitle>
                <CardDescription className="font-bold text-2xl text-black">
                  42
                </CardDescription>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg h-10">
                <Users className="text-green-500  " />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-48 min-h-32 m-10 bg-gray-50">
          <CardContent className="mt-5">
            <div className="flex justify-between">
              <div>
                <CardTitle className="mb-3 text-gray-500">
                  Server Uptime
                </CardTitle>
                <CardDescription className="font-bold text-base text-black">
                  24d 12h 50m
                </CardDescription>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg h-10">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-48 max-h-32 mt-10 bg-gray-50 ">
          <CardContent className="mt-5">
            <div className="flex justify-between gap-4">
              <div>
                <CardTitle className="mb-3 text-gray-500">RAM Usage</CardTitle>
                <CardDescription className="font-bold text-2xl text-black">
                  6.2/8GB
                </CardDescription>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg h-10">
                <Database className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="ml-10 pl-10 pt-5 pb-5 w-[658px] bg-gray-50">
        <div className="flex gap-5 items-center mb-5">
          <Users />
          <CardTitle className="font-bold text-xl">Online Players</CardTitle>
        </div>
        <div className="flex pt-3 pb-3 mr-10 bg-white border-2 rounded-lg">
          <Search className="ml-5" />
          <input
            className="ml-2 mr-2 w-full"
            type="text"
            placeholder="Search Players..."
          />
        </div>
        <Card className="mt-5 p-3 mr-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200  rounded-full"></div>
          <div>
            <p>Player_1</p>
            <p>Level 30</p>
          </div>
          <div>
            <span className=" rounded-lg text-white bg-black pt-1 pb-1 pl-3 pr-3">
              Online
            </span>
          </div>
        </Card>
        <Card className="mt-5 p-3 mr-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200  rounded-full"></div>
          <div>
            <p>Player_1</p>
            <p>Level 30</p>
          </div>
          <div>
            <span className=" rounded-lg text-white bg-black pt-1 pb-1 pl-3 pr-3">
              Online
            </span>
          </div>
        </Card>
        <Card className="mt-5 p-3 mr-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 border-2 border-emerald-200  rounded-full"></div>
          <div>
            <p>Player_1</p>
            <p>Level 30</p>
          </div>
          <div>
            <span className=" rounded-lg text-white bg-black pt-1 pb-1 pl-3 pr-3">
              Online
            </span>
          </div>
        </Card>
      </Card>
    </div>
  );
}
