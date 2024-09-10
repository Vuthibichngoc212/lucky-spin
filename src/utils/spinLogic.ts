/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PRIZES } from "../data/constant";
import dayjs, { Dayjs } from "dayjs";
import { StyleRotate } from "../types";
import { getTimeDifference } from "./get-time-difference";

// Hàm tính toán chỉ số phần thưởng trúng
export function randomIndex(
  prizes: { name: string; img: any; percentpage: number }[]
) {
  let winningPrizeIndex = 0;

  const filteredPrizes = prizes.filter((prize) => prize.percentpage > 0);
  const cumulativeRatios: number[] = [];
  let cumulativeRatio = 0;

  for (const prize of filteredPrizes) {
    cumulativeRatio += prize.percentpage;
    cumulativeRatios.push(cumulativeRatio);
  }

  const totalCumulativeRatio = cumulativeRatios[cumulativeRatios.length - 1];
  const randomValue = Math.random() * totalCumulativeRatio;

  for (let i = 0; i < cumulativeRatios.length; i++) {
    if (randomValue <= cumulativeRatios[i]) {
      winningPrizeIndex = i;
      break;
    }
  }

  return prizes.findIndex(
    (prize) => prize.name === filteredPrizes[winningPrizeIndex].name
  );
}

// Hàm tính góc quay và tốc độ xoay kim
export function calculateSpin(
  indexPrizeWon: number,
  time: Dayjs,
  styleRotate: StyleRotate,
  setStyleRotate: React.Dispatch<React.SetStateAction<StyleRotate>>,
  setTimeNeedleRotate: React.Dispatch<React.SetStateAction<number>>,
  CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE: number,
  CURRENT_TIME_DURATION_NEEDLE_ROTATE: number
) {
  const timeCallApi = getTimeDifference(time, dayjs());
  let d = styleRotate.deg;

  const numberOfPrizes = PRIZES.length;
  const prizeAngle = 360 / numberOfPrizes;
  d = d + (360 - (d % 360)) + (360 * 10 - indexPrizeWon * prizeAngle);

  const timeRotate = CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE - timeCallApi;
  setStyleRotate({
    deg: d,
    timingFunc: "ease",
    timeDuration: timeRotate,
  });

  setTimeNeedleRotate(((timeRotate / 10) * 1) / 4);
  setTimeout(() => {
    setTimeNeedleRotate(((timeRotate / 10) * 3) / 4);
  }, (((timeRotate / 10) * 3) / 4) * 10000);
}
