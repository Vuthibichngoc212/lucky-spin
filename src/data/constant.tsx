import { ImgIp16, Voucher, TonerEveline, BetterLuck, TuiVang } from "../assets";

export const PRIZES = [
  {
    name: "Iphone 16",
    img: ImgIp16,
    percentpage: 0, // code để không quay trúng
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
    percentpage: 10,
    type: "voucher50k", // thêm thuộc tính type
  },
  {
    name: "Voucher 20k",
    img: TuiVang,
    percentpage: 5,
    type: "voucher20k", // thêm thuộc tính type
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
    percentpage: 15,
    type: "toner", // thêm thuộc tính type
  },
];

export const COLORS = {
  primary_first: "#1A2B57",
  primary_second: "black",
};
