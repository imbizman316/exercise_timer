"use client";

import { Colors } from "./constants/colors";
import { ChangeEvent, useEffect, useState } from "react";
import { Times } from "./constants/types";

function Timer({
  times,
  setCurrentScreen,
}: {
  times: Times;
  setCurrentScreen: React.Dispatch<React.SetStateAction<"setting" | "timer">>;
}) {
  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);

  const [status, setStatus] = useState(true);

  const { time, title } = times[currentTimerIndex];

  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (second + minute * 60 >= time) {
      if (currentTimerIndex < times.length - 1) {
        setSecond(0);
        setMinute(0);
        setCurrentTimerIndex((prev) => prev + 1);
      } else {
        setStatus(false);
      }
    }

    const timeIncrease = setTimeout(() => {
      if (status && !(second + minute * 60 >= time)) {
        setSecond((prev) => prev + 1);
      }
    }, 1000);

    if (second >= 60) {
      setMinute((prev) => prev + 1);
      setSecond(0);
    }

    return () => {
      clearTimeout(timeIncrease);
    };
  }, [second]);

  return (
    <div className="w-full h-full flex flex-col items-center pt-28">
      <h1
        className="font-bold text-center"
        style={{
          color: Colors.fontTimeWhite,
          paddingBottom: 25,
          fontSize: 50,
        }}
      >
        {currentTimerIndex === times.length - 1 && second + minute * 60 >= time
          ? "ALL DONE. GOOD JOB"
          : title}
      </h1>
      <div
        className="rounded-full border-solid border-1 border-white flex items-center justify-center"
        style={{
          width: 300,
          height: 300,
          backgroundColor: Colors.unselectedBlack,
        }}
      >
        <p
          style={{
            color: Colors.fontTimeWhite,
            fontSize: 100,
            fontWeight: 800,
          }}
        >
          {minute.toString().length === 1 && "0"}
          {minute}:{second.toString().length <= 1 && "0"}
          {second}
        </p>
      </div>
      <button
        className="py-5 px-20 rounded-4xl z-20 mt-20"
        style={{
          backgroundColor: Colors.selectedDarkPink,
          color: status ? Colors.settingBackground : Colors.grayInputBackground,
          fontWeight: 800,
        }}
        onClick={() => setStatus(!status)}
      >
        PAUSE
      </button>
      <button
        className="py-5 px-20 rounded-4xl z-20 mt-20"
        style={{
          backgroundColor: Colors.selectedDarkPink,
          color: Colors.settingBackground,
          fontWeight: 800,
        }}
        onClick={() => setCurrentScreen("setting")}
      >
        BACK TO SETTING
      </button>
    </div>
  );
}

function SettingItem({
  id,
  times,
  setTimes,
  index,
}: {
  id: number;
  index: number;
  times: Times;
  setTimes: React.Dispatch<React.SetStateAction<Times>>;
}) {
  const handleDelete = () => {
    setTimes((prev: Times) =>
      prev.filter((item) => item.id.toString() !== id.toString())
    );
  };
  const timeItem = times.find((time) => time.id.toString() === id.toString());

  const { time, title } = timeItem ? timeItem : { time: 0, title: "" };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimes((prev) =>
      prev.map((item) => {
        if (item.id.toString() === id.toString()) {
          return {
            ...item,
            [e.target.name]: e.target.value,
          };
        } else {
          return { ...item };
        }
      })
    );
  };

  return (
    <div className="flex flex-row w-full gap-3 items-center">
      <p>{index}.</p>
      <input
        style={{
          backgroundColor: Colors.grayInputBackground,
          width: "70%",
          fontSize: 21,
        }}
        type="text"
        placeholder="Title"
        value={title}
        name={"title"}
        onChange={handleChange}
      />
      <input
        style={{
          backgroundColor: Colors.grayInputBackground,
          width: "30%",
          fontSize: 21,
        }}
        type="number"
        min={0}
        max={100}
        placeholder="Second"
        value={time}
        name={"time"}
        onChange={handleChange}
      />
      <button onClick={handleDelete}>delete</button>
    </div>
  );
}

export default function Home() {
  const [times, setTimes] = useState<Times>([]);
  const [currentScreen, setCurrentScreen] = useState<"setting" | "timer">(
    "setting"
  );

  const handleAddTime = () => {
    setTimes(
      (prev): Times => [
        ...prev,
        {
          id: times.length + 1,
          time: 0,
          title: "",
        },
      ]
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: Colors.mainBackgroundBlue,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        {currentScreen === "setting" && (
          <div
            className="rounded-xl"
            style={{
              backgroundColor: Colors.settingBackground,
              width: "90%",
              height: "85%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              padding: 20,
              position: "relative",
            }}
          >
            <button
              className="py-3 w-full rounded-lg"
              style={{
                backgroundColor: Colors.selectedDarkPink,
                color: Colors.settingBackground,
                fontWeight: 800,
              }}
              onClick={handleAddTime}
            >
              Add time
            </button>
            <div className="mt-15 flex flex-col gap-5 w-full overflow-scroll">
              {times.map((time, index) => (
                <SettingItem
                  index={index}
                  key={time.id}
                  id={time.id}
                  times={times}
                  setTimes={setTimes}
                />
              ))}
            </div>
            <div
              className="w-full absolute bottom-[-30px]"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                className="py-5 px-20 rounded-4xl z-20"
                style={{
                  backgroundColor: Colors.selectedDarkPink,
                  color: Colors.settingBackground,
                  fontWeight: 800,
                }}
                onClick={() => setCurrentScreen("timer")}
              >
                START
              </button>
            </div>
          </div>
        )}
        {currentScreen === "timer" && (
          <Timer times={times} setCurrentScreen={setCurrentScreen} />
        )}
      </div>
    </>
  );
}
