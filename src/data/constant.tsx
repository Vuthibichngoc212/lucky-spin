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

  const [voucher50k, voucher20k, tonerCount] = prizeAvailability;
  const [totalVoucher50k, totalVoucher20k, totalToner] = totalPrizeAvailability;

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
      percentpage: 70,
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
      percentpage: voucher20k < 1 && totalVoucher20k < 10 ? 5 : 0,
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
      percentpage: tonerCount < 5 && totalToner < 30 ? 15 : 0,
      type: "toner",
    },
  ];

  return PRIZES;
};
export const COLORS = {
  primary_first: "#1A2B57",
  primary_second: "black",
};

export const voucherList20k = [
  "VOUCHER20K_1",
  "VOUCHER20K_2",
  "VOUCHER20K_3",
  "VOUCHER20K_4",
  "VOUCHER20K_5",
  "VOUCHER20K_6",
  "VOUCHER20K_7",
  "VOUCHER20K_8",
  "VOUCHER20K_9",
  "VOUCHER20K_10",
];

export const voucherList50k = [
  "VOUCHER50K_1",
  "VOUCHER50K_2",
  "VOUCHER50K_3",
  "VOUCHER50K_4",
  "VOUCHER50K_5",
  "VOUCHER50K_6",
  "VOUCHER50K_7",
  "VOUCHER50K_8",
  "VOUCHER50K_9",
  "VOUCHER50K_10",
  "VOUCHER50K_11",
  "VOUCHER50K_12",
  "VOUCHER50K_13",
  "VOUCHER50K_14",
  "VOUCHER50K_15",
  "VOUCHER50K_16",
  "VOUCHER50K_17",
  "VOUCHER50K_18",
  "VOUCHER50K_19",
  "VOUCHER50K_20",
];
