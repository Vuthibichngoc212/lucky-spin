import { PRIZES } from "../data/constant";
import dayjs, { Dayjs } from "dayjs";
import { StyleRotate } from "../types";
import { getTimeDifference } from "./get-time-difference";

export type Prize = {
  name: string;
  img: string | unknown;
  percentpage: number;
};

// Hàm tính toán chỉ số phần thưởng trúng
export function randomIndex(prizes: Prize[]) {
  // Lọc ra những phần quà có `percentpage > 0`
  const validPrizes = prizes.filter((prize) => prize.percentpage > 0);

  // Nếu không có phần quà nào hợp lệ thì trả về -1
  if (validPrizes.length === 0) {
    return -1;
  }

  // Random chọn ngẫu nhiên một phần quà từ danh sách validPrizes
  const randomIndex = Math.floor(Math.random() * validPrizes.length);

  // Tìm chỉ số phần thưởng trong danh sách gốc `prizes`
  return prizes.findIndex(
    (prize) => prize.name === validPrizes[randomIndex].name
  );
}

// Hàm tính góc quay và tốc độ xoay kim
export function calculateSpin(
  indexPrizeWon: number,
  time: Dayjs,
  styleRotate: StyleRotate,
  setStyleRotate: React.Dispatch<React.SetStateAction<StyleRotate>>,
  setTimeNeedleRotate: React.Dispatch<React.SetStateAction<number>>,
  CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE: number
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
