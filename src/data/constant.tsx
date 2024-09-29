import { ImgIp16, Voucher, TonerEveline, BetterLuck, TuiVang } from "../assets";
import {
  checkPrizeAvailabilityBatch,
  checkTotalPrizeAvailabilityBatch,
} from "../utils/firebaseOperations";

export const getPrizes = async () => {
  const prizeNames = ["Voucher 50k", "Voucher 20k", "Toner Eveline Magma"];
  const maxLimits = [20, 10, 30];

  const [prizeAvailability, totalPrizeAvailability] = await Promise.all([
    checkPrizeAvailabilityBatch(prizeNames),
    checkTotalPrizeAvailabilityBatch(prizeNames, maxLimits),
  ]);

  const [voucher50k, tonerCount] = prizeAvailability;
  const [totalVoucher50k, totalToner] = totalPrizeAvailability;

  const PRIZES = [
    {
      name: "Iphone 16",
      img: ImgIp16,
      percentpage: 0,
      type: "none",
    },
    {
      name: "Voucher 500k",
      img: TuiVang,
      percentpage: 0,
      type: "none",
    },
    {
      name: "Voucher 300k",
      img: TuiVang,
      percentpage: 0,
      type: "none",
    },
    {
      name: "Chúc bạn may mắn lần sau",
      img: BetterLuck,
      percentpage: 80,
      type: "betterLuck",
    },
    {
      name: "Voucher 50k",
      img: TuiVang,
      percentpage: voucher50k < 4 && totalVoucher50k < 20 ? 10 : 0,
      type: "voucher50k",
    },
    {
      name: "Voucher 20k",
      img: TuiVang,
      // percentpage: voucher20k < 1 && totalVoucher20k < 10 ? 90 : 0,
      percentpage: 0,
      type: "voucher20k",
    },
    {
      name: "Voucher giảm 70%",
      img: Voucher,
      percentpage: 0,
      type: "none",
    },
    {
      name: "Toner Eveline Magma",
      img: TonerEveline,
      percentpage: tonerCount < 5 && totalToner < 30 ? 10 : 0,
      type: "toner",
    },
  ];

  return PRIZES;
};
export const COLORS = {
  primary_first: "#1A2B57",
  primary_second: "black",
};
