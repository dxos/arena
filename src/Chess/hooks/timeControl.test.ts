import { describe, it, expect } from "vitest";
import { thinkingTime, timeRemaining } from "./useTimeControl";
import { TimeControl } from "../game";
import { ms } from "../../lib/time";

describe("thinkingTime", () => {
  it("should correctly calculate thinking time for both players, including ongoing time", () => {
    const moveTimes = ["2023-01-01T10:00:00.000Z", "2023-01-01T10:05:00.000Z"];
    const currentTime = "2023-01-01T10:10:00.000Z"; // 5 minutes after the last move

    const result = thinkingTime(moveTimes, currentTime);

    expect(result.whiteThinkingTime).toBe(ms({ minutes: 5 }));
    expect(result.blackThinkingTime).toBe(ms({ minutes: 5 }));
  });

  it("should correctly calculate thinking time for both players, no current time", () => {
    const moveTimes = ["2023-01-01T10:00:00.000Z", "2023-01-01T10:05:00.000Z"];

    const result = thinkingTime(moveTimes, undefined);

    expect(result.whiteThinkingTime).toBe(0);
    expect(result.blackThinkingTime).toBe(ms({ minutes: 5 }));
  });

  it("calculates thinking time correctly for alternating moves", () => {
    const moveTimes = [
      "2023-11-23T10:00:00.000Z",
      "2023-11-23T10:00:30.000Z",
      "2023-11-23T10:01:00.000Z",
    ];
    const currentTime = "2023-11-23T10:01:30.000Z";

    const { whiteThinkingTime, blackThinkingTime } = thinkingTime(moveTimes, currentTime);

    expect(whiteThinkingTime).toBe(ms({ seconds: 30 }));
    expect(blackThinkingTime).toBe(ms({ seconds: 60 }));
  });

  it("handles no moves with zero thinking time", () => {
    const moveTimes: string[] = [];
    const currentTime = "2023-11-23T10:00:00.000Z";

    const { whiteThinkingTime, blackThinkingTime } = thinkingTime(moveTimes, currentTime);
    expect(whiteThinkingTime).toBe(0);
    expect(blackThinkingTime).toBe(0);
  });

  it("handles uneven number of moves", () => {
    const moveTimes = [
      "2023-11-23T10:00:00.000Z",
      "2023-11-23T10:00:20.000Z",
      "2023-11-23T10:00:50.000Z",
    ];
    const currentTime = "2023-11-23T10:01:10.000Z";

    const { whiteThinkingTime, blackThinkingTime } = thinkingTime(moveTimes, currentTime);

    expect(whiteThinkingTime).toBe(ms({ seconds: 30 }));
    expect(blackThinkingTime).toBe(ms({ seconds: 40 }));
  });
});

describe("timeRemaining", () => {
  it("should calculate remaining time correctly", () => {
    const moveTimes = ["2022-03-01T00:00:00Z", "2022-03-01T00:01:00Z", "2022-03-01T00:02:00Z"];
    const timeControl: TimeControl = { baseMinutes: 5, incrementSeconds: 3 };
    const currentTime = "2022-03-01T00:03:00Z";

    const result = timeRemaining(timeControl, moveTimes, currentTime);

    // NOTE: White does not get the increment on the first move
    expect(result.whiteRemainingTime).toEqual(ms({ minutes: 5 - 1, seconds: 3 }));
    expect(result.blackRemainingTime).toEqual(ms({ minutes: 5 - 2, seconds: 3 }));
  });
});
