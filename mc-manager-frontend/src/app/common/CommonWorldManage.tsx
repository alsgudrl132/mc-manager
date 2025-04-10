import React from "react";
import { setTime, setWeather, Time, Weather } from "../store/store";
import { Cloud, CloudRain, Moon, Sun } from "lucide-react";

function CommonWorldManage() {
  const weatherHandler = async (weather: Weather) => {
    try {
      const result = await setWeather(weather);
      console.log(result);
    } catch (error) {
      alert(error);
    }
  };

  const timeHandler = async (time: Time) => {
    try {
      const result = await setTime(time);
      console.log(result);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-3">World Settings</h3>

      {/* 날씨 설정 */}
      <div className="mb-4">
        <p className="text-md font-medium mb-2">Weather</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="flex items-center justify-center gap-2 border py-2 rounded-lg"
            onClick={() => weatherHandler({ weather: "clear" })}
          >
            <Cloud size={16} />
            <span>Clear</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 border py-2 rounded-lg"
            onClick={() => weatherHandler({ weather: "rain" })}
          >
            <CloudRain size={16} />
            <span>Rain</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 border py-2 rounded-lg"
            onClick={() => weatherHandler({ weather: "thunder" })}
          >
            <CloudRain size={16} />
            <span>Thunder</span>
          </button>
        </div>
      </div>

      {/* 시간 설정 */}
      <div>
        <p className="text-md font-medium mb-2">Time</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex items-center justify-center gap-2 border py-2 rounded-lg"
            onClick={() => timeHandler({ time: "day" })}
          >
            <Sun size={16} />
            <span>Day</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 border py-2 rounded-lg"
            onClick={() => timeHandler({ time: "night" })}
          >
            <Moon size={16} />
            <span>Night</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonWorldManage;
