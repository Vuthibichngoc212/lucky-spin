import { ImgIp16, Voucher, TonerEveline, BetterLuck, TuiVang } from "../assets";
// import {
//   checkPrizeAvailabilityBatch,
//   checkTotalPrizeAvailabilityBatch,
// } from "../utils/firebaseOperations";

export const getPrizes = async () => {
  // const prizeNames = ["Voucher 50k", "Voucher 20k", "Toner Eveline Magma"];
  // const maxLimits = [20, 10, 30];

  // const [prizeAvailability, totalPrizeAvailability] = await Promise.all([
  //   checkPrizeAvailabilityBatch(prizeNames),
  //   checkTotalPrizeAvailabilityBatch(prizeNames, maxLimits),
  // ]);

  // const [voucher20k, voucher50k] = prizeAvailability;
  // const [totalVoucher20k, totalVoucher50k] = totalPrizeAvailability;

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
      percentpage: 100,
      type: "betterLuck",
    },
    {
      name: "Voucher 50k",
      img: TuiVang,
      // percentpage: voucher50k < 4 && totalVoucher50k < 20 ? 7 : 0,
      percentpage: 0,
      type: "voucher50k",
    },
    {
      name: "Voucher 20k",
      img: TuiVang,
      // percentpage: voucher20k < 1 && totalVoucher20k < 10 ? 3 : 0,
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
      // percentpage: tonerCount < 5 && totalToner < 30 ? 5 : 0,
      percentpage: 0,
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
  "VCBTJNA20K",
  "VC5GQQC20K",
  "VC1MG3820K",
  "VC79GWM20K",
  "VCJAH2J20K",
  "VCTQJEF20K",
  "VC7NNIO20K",
  "VCE3GF920K",
  "VCOSWW420K",
];

export const voucherList50k = [
  "VCC8XNT50K",
  "VCH7HXN50K",
  "VCMIOXK50K",
  "VCP38MC50K",
  "VC5TE9V50K",
  "VCJHRU250K",
  "VCUVPQK50K",
  "VCCUXPY50K",
  "VCD7V0X50K",
  "VCUI7YD50K",
  "VCNTE5Z50K",
  "VCJJAD650K",
  "VCI0AHX50K",
  "VCRXM6B50K",
  "VCJA3IN50K",
  "VCODILK50K",
];
