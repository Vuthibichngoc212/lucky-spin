import dayjs, { Dayjs } from "dayjs";
import { StyleRotate } from "../types";
import { getTimeDifference } from "./get-time-difference";

export type Prize = {
  name: string;
  img: string;
  percentpage: number;
};

export function randomIndex(prizes: Prize[]) {
  const validPrizes = prizes.filter((prize) => prize.percentpage > 0);

  if (validPrizes.length === 0) {
    return -1;
  }

  // Tính tổng tất cả các `percentpage`
  const totalPercent = validPrizes.reduce(
    (sum, prize) => sum + prize.percentpage,
    0
  );

  // Tạo một số ngẫu nhiên từ 0 đến `totalPercent`
  const randomValue = Math.random() * totalPercent;

  // Dùng biến để theo dõi xác suất tích lũy
  let accumulatedPercent = 0;

  // Lặp qua các phần quà hợp lệ và chọn dựa trên xác suất
  for (let i = 0; i < validPrizes.length; i++) {
    accumulatedPercent += validPrizes[i].percentpage;
    if (randomValue <= accumulatedPercent) {
      // Tìm chỉ số phần thưởng trong danh sách gốc `prizes`
      return prizes.findIndex((prize) => prize.name === validPrizes[i].name);
    }
  }

  return -1;
}

// Hàm tính góc quay và tốc độ xoay kim
export function calculateSpin(
  indexPrizeWon: number,
  time: Dayjs,
  styleRotate: StyleRotate,
  setStyleRotate: React.Dispatch<React.SetStateAction<StyleRotate>>,
  setTimeNeedleRotate: React.Dispatch<React.SetStateAction<number>>,
  CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE: number,
  prizes: Prize[]
) {
  const timeCallApi = getTimeDifference(time, dayjs());
  let d = styleRotate.deg;

  const numberOfPrizes = prizes.length;
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
