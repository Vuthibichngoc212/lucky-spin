export type ConfigModal = {
  openModal: boolean;
  typeModal: "list" | "notify" | "userInfo";
};

export type PrizeWon = {
  name: string;
  img: string;
  time: string;
};

export type WinningResultType = {
  name: string;
  img: string;
  voucherCode?: string;
};

export type StyleRotate = {
  deg: number;
  timingFunc: "ease-in-out" | "ease";
  timeDuration: number;
};

export type UserData = {
  name: string;
  phone: string;
  address: string;
  email: string;
};
