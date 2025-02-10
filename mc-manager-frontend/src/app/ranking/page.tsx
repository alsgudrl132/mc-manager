import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Star, Swords, Trophy } from "lucide-react";
import React from "react";

function ranking() {
  return (
    <div className="flex justify-between py-7 px-5 mx-7 my-12 border-2 bg-white rounded-lg ">
      <Card className="max-h-32 bg-yellow-50">
        <CardContent className="mt-5">
          <div className="flex justify-between">
            <div>
              <CardTitle className="mb-3 text-amber-500">Top Player</CardTitle>
              <CardDescription className="font-bold text-lg text-black">
                Player_1
              </CardDescription>
              <CardDescription className="text-sm text-amber-500">
                Level 75
              </CardDescription>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg h-10">
              <Trophy className="text-amber-500  " />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-h-32 bg-green-50">
        <CardContent className="mt-5">
          <div className="flex justify-between">
            <div>
              <CardTitle className="mb-3 text-green-600">
                Most Playtime
              </CardTitle>
              <CardDescription className="font-bold text-lg text-black">
                432h
              </CardDescription>
              <CardDescription className="text-sm text-green-600">
                Player_1
              </CardDescription>
            </div>
            <div className="bg-green-50 p-2 rounded-lg h-10">
              <Clock className="text-green-600  " />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-h-32 bg-blue-50">
        <CardContent className="mt-5">
          <div className="flex justify-between">
            <div>
              <CardTitle className="mb-3 text-blue-600">Most Kills</CardTitle>
              <CardDescription className="font-bold text-lg text-black">
                1,234
              </CardDescription>
              <CardDescription className="text-sm text-blue-600">
                Player_1
              </CardDescription>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg h-10">
              <Swords className="text-blue-600  " />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="max-h-32 bg-purple-50">
        <CardContent className="mt-5">
          <div className="flex justify-between">
            <div>
              <CardTitle className="mb-3 text-purple-600">
                Highst Level
              </CardTitle>
              <CardDescription className="font-bold text-lg text-black">
                100
              </CardDescription>
              <CardDescription className="text-sm text-purple-600">
                Player_1
              </CardDescription>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg h-10">
              <Star className="text-purple-600  " />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ranking;
