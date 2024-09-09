export type User = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
};

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
};

export type StyleRotate = {
  deg: number;
  timingFunc: "ease-in-out" | "ease";
  timeDuration: number;
};
