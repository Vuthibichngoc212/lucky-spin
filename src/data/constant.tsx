import { ImgIp16, Voucher, TonerEveline, BetterLuck, TuiVang } from "../assets";
import {
  checkPrizeAvailability,
  checkTotalPrizeAvailability,
} from "../utils/firebaseOperations";

export const getPrizes = async () => {
  const voucher50k = await checkPrizeAvailability("Voucher 50k");
  const voucher20k = await checkPrizeAvailability("Voucher 20k");
  const tonerCount = await checkPrizeAvailability("Toner Eveline Magma");

  const totalVoucher50k = await checkTotalPrizeAvailability("Voucher 50k", 20);
  const totalVoucher20k = await checkTotalPrizeAvailability("Voucher 20k", 10);
  const totalToner = await checkTotalPrizeAvailability(
    "Toner Eveline Magma",
    30
  );

  console.log("Daily Voucher 50k Count:", voucher50k);
  console.log("Total Voucher 50k Count (7 days):", totalVoucher50k);
  console.log("Daily Voucher 20k Count:", voucher20k);
  console.log("Total Voucher 20k Count (7 days):", totalVoucher20k);
  console.log("Daily Toner Count:", tonerCount);
  console.log("Total Toner Count (7 days):", totalToner);

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
      percentpage: voucher50k < 3 && totalVoucher50k < 20 ? 10 : 0,
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
      percentpage: tonerCount < 4 && totalToner < 30 ? 15 : 0,
      type: "toner",
    },
  ];

  PRIZES.forEach((prize) => {
    console.log(`Prize: ${prize.name}, Percentpage: ${prize.percentpage}`);
  });

  return PRIZES;
};
export const COLORS = {
  primary_first: "#1A2B57",
  primary_second: "black",
};
