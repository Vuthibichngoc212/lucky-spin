/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { PRIZES } from "../../data/constant";
import dayjs, { Dayjs } from "dayjs";
import { getTimeDifference } from "../../utils/get-time-difference";
import {
  ImgIp16,
  Voucher,
  TonerEveline,
  BetterLuck,
  TuiVang,
} from "../../assets";

import {
  addUser,
  addUserSpinDate,
  checkSpinAvailability,
  getAllSpinHistory,
} from "../../utils/firebaseOperations";
import { calculateSpin, randomIndex } from "../../utils/spinLogic";
import { fetchUseIP } from "../../services/fetchUseIP";
import { validationSchema } from "../../helpers/validationSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ConfigModal,
  PrizeWon,
  StyleRotate,
  UserData,
  WinningResultType,
} from "../../types";
import { LuckyWheel, WinningResult } from "../../components";
import "./LuckySpin.css";
import { Box, Grid, Typography } from "@mui/material";
import EventDialog from "../../components/EventDialog/EventDialog";
import CRUDModal from "../../components/common/CRUDModal/CRUDModal";
import CustomTextField from "../../components/common/CustomTextField/CustomTextField";
import { DocumentData } from "firebase/firestore";

const ID = "luckywheel";
const CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE = 15;

const LuckySpin: React.FC = () => {
  const [styleRotate, setStyleRotate] = useState<StyleRotate>({
    deg: 0,
    timingFunc: "ease-in-out",
    timeDuration: 0,
  });
  const [history, setHistory] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getAllSpinHistory();
      setHistory(data);
    };

    fetchHistory();
    // setInterval mỗi 30s thì fetch lại data
    setInterval(fetchHistory, 30000);
  }, []);

  const date = new Date();

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear(); // Năm

  const formattedDate = `${day}/${month}/${year}`;

  const countVoucher20k = history.filter(
    (item: any) =>
      item.prize === "Voucher 20k" && item.date.split(" ")[0] === formattedDate
  ).length;

  const countVoucher50k = history.filter(
    (item: any) =>
      item.prize === "Voucher 50k" && item.date.split(" ")[0] === formattedDate
  ).length;

  const Toner_Eveline_Magma = history.filter(
    (item: any) =>
      item.prize === "Toner Eveline Magma" &&
      item.date.split(" ")[0] === formattedDate
  ).length;

  const countTotalVoucher20k = history.filter(
    (item: any) => item.prize === "Voucher 20k"
  ).length;

  const countTotalVoucher50k = history.filter(
    (item: any) => item.prize === "Voucher 50k"
  ).length;

  const countTotalToner = history.filter(
    (item: any) => item.prize === "Toner Eveline Magma"
  ).length;

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
      percentpage: countVoucher50k >= 3 || countTotalVoucher50k > 20 ? 0 : 10,
      type: "voucher50k",
    },
    {
      name: "Voucher 20k",
      img: TuiVang,
      percentpage: countVoucher20k >= 1 || countTotalVoucher20k > 10 ? 0 : 5,
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
      percentpage: Toner_Eveline_Magma >= 4 || countTotalToner > 30 ? 0 : 15,
      type: "toner",
    },
  ];

  // Trạng thái quản lý xem vòng quay có đang quay hay không.
  const [spinning, setSpinning] = useState<boolean>(false);
  //  Số lượt quay còn lại của người chơi.
  const [countSpin, setCountSpin] = useState<number>(1);
  // Thông tin về phần thưởng sau khi quay
  const [winningResult, setWinningResult] = useState<WinningResultType>({
    name: "",
    img: "",
    voucherCode: "",
  });
  // Danh sách phần thưởng đã trúng
  const [listPrizeWon, setListPrizeWon] = useState<PrizeWon[]>([]);
  // Thời gian hiện tại để đo lường thời gian thực hiện
  const [time, setTime] = useState<Dayjs>();
  // Trạng thái điều khiển hiển thị modal (popup) thông báo trúng thưởng hoặc danh sách phần thưởng đã trúng.
  const [configModal, setConfigModal] = useState<ConfigModal>({
    openModal: false,
    typeModal: "notify",
  });
  // Quản lý tốc độ quay của kim chỉ vòng quay.
  const [timeNeedleRotate, setTimeNeedleRotate] = useState<number>(0);

  //Chỉ số phần thưởng trúng khi gọi API (nếu dùng).
  const [indexPrizeWon, setIndexPrizeWon] = useState<number | null>(null);

  const [isUserInfoValid, setIsUserInfoValid] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UserData) => {
    const ip = await fetchUseIP();
    const currentDate = dayjs().format("DD/MM/YYYY");

    const userExists = await checkSpinAvailability(data.email, ip, currentDate);

    if (userExists) {
      setDialogMessage("Bạn đã quay hôm nay. Vui lòng quay lại vào ngày mai!");
      setOpenDialog(true);
    } else {
      await addUser(data);
      setEmail(data.email);
      setIsUserInfoValid(true);
      setConfigModal({ ...configModal, openModal: false });
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await fetchUseIP();
      setIpAddress(ip);
    };
    fetchIP();
  }, []);

  useEffect(() => {
    if (isUserInfoValid && countSpin > 0) {
      handleSpin();
    }
  }, [isUserInfoValid]);

  const handleSpin = async () => {
    const today = dayjs().startOf("day");
    const startDate = dayjs("2024-09-12").startOf("day");
    const endDate = dayjs("2024-09-19").endOf("day");

    if (today.isBefore(startDate)) {
      setDialogMessage(
        "Sự kiện chưa bắt đầu. Bạn chỉ có thể quay từ ngày 12/09"
      );
      setOpenDialog(true);
      return;
    }

    if (today.isAfter(endDate)) {
      setDialogMessage("Sự kiện đã kết thúc");
      setOpenDialog(true);
      return;
    }

    if (!isUserInfoValid) {
      setConfigModal({ openModal: true, typeModal: "userInfo" });
      return;
    }

    if (!ipAddress || !email) {
      setDialogMessage(
        "Có sự cố xảy ra khi xác thực thông tin của bạn. Vui lòng thử lại sau."
      );
      setOpenDialog(true);
      return;
    }

    const currentDate = dayjs().format("DD/MM/YYYY");
    const storedSpinDate = localStorage.getItem("spinDate");

    if (storedSpinDate === currentDate) {
      setDialogMessage("Bạn đã quay hôm nay. Vui lòng quay lại vào ngày mai!");
      setOpenDialog(true);
      return;
    }

    setSpinning(true);
    setTime(dayjs());

    const result = randomIndex(PRIZES);
    setIndexPrizeWon(result);
    setCountSpin((prevState) => prevState - 1);

    const prize = PRIZES[result];
    let voucherCode: string | null = null;

    if (prize.type === "voucher20k" || prize.type === "voucher50k") {
      voucherCode = `${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    calculateSpin(
      result,
      dayjs(),
      styleRotate,
      setStyleRotate,
      setTimeNeedleRotate,
      CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE
    );

    await addUserSpinDate(
      email,
      ipAddress,
      currentDate,
      PRIZES[result].name,
      voucherCode || ""
    );

    localStorage.setItem("spinDate", currentDate);

    setWinningResult({
      name: prize.name,
      img: prize.img,
      voucherCode: voucherCode || "",
    });
  };

  const alertAfterTransitionEnd = () => {
    const ele = document.getElementById(ID);
    if (ele) {
      const container = ele.querySelector(".luckywheel-container");
      if (container) {
        container.addEventListener(
          "transitionend",
          () => {
            setConfigModal({ typeModal: "notify", openModal: true });
            setSpinning(false);
          },
          false
        );
      }
    }
  };

  const handleContinue = () => {
    setConfigModal({ ...configModal, openModal: false });
  };

  useEffect(() => {
    if (indexPrizeWon !== null && time) {
      const timeCallApi = getTimeDifference(time, dayjs());
      let d = styleRotate.deg;

      // Tính toán góc quay dựa trên phần thưởng đã chọn
      const numberOfPrizes = PRIZES.length;
      const prizeAngle = 360 / numberOfPrizes;
      d = d + (360 - (d % 360)) + (360 * 10 - indexPrizeWon * prizeAngle); // Tính lại góc để kim trỏ vào phần thưởng

      const timeRotate = CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE - timeCallApi;
      setStyleRotate({
        deg: d,
        timingFunc: "ease",
        timeDuration: timeRotate,
      });
      setTimeNeedleRotate(((timeRotate / 10) * 1) / 4);

      // Giảm tốc độ của kim sau một thời gian
      setTimeout(() => {
        setTimeNeedleRotate(((timeRotate / 10) * 3) / 4);
      }, (((timeRotate / 10) * 3) / 4) * 10000);

      // Hiển thị kết quả phần thưởng
      setWinningResult({
        name: PRIZES[indexPrizeWon].name,
        img: PRIZES[indexPrizeWon].img,
      });

      // Thêm phần thưởng vào danh sách đã trúng
      setListPrizeWon([
        ...listPrizeWon,
        {
          name: PRIZES[indexPrizeWon].name,
          img: PRIZES[indexPrizeWon].img,
          time: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        },
      ]);

      alertAfterTransitionEnd();
      setIndexPrizeWon(null);
    }
  }, [indexPrizeWon]);

  return (
    <Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{ fontWeight: "bold", color: "#f1ba18", fontSize: "30px" }}
        >
          VÒNG QUAY MAY MẮN
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", color: "#ffffff", fontSize: "20px" }}
        >
          Áp dụng cho tất cả các khách hàng tại hệ thống EVELINE
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            fontSize: "16px",
          }}
        >
          Thời gian: 12/09 - 19/09
        </Typography>
      </Box>
      <div className="w-1/2 flex flex-col items-center">
        <LuckyWheel
          id={ID}
          styleRotate={styleRotate}
          prizes={PRIZES}
          spinning={spinning}
          timeNeedleRotate={timeNeedleRotate}
        />
        <div className="flex justify-center mt-[70px] w-[50%]">
          <button
            disabled={countSpin === 0 || spinning}
            onClick={handleSpin}
            className={`py-2 ${
              countSpin === 0 || spinning
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } px-5 w-[100%] rounded-lg bg-[#1A2B57] text-white font-bold btn-shadow-animate`}
          >
            {spinning
              ? "Đang quay"
              : countSpin > 0
              ? "Quay"
              : "Bạn đã hết lượt"}
          </button>
        </div>

        <CRUDModal
          isOpenModal={configModal.openModal}
          setIsOpenModal={(isOpen: boolean) =>
            setConfigModal({ ...configModal, openModal: isOpen })
          }
          headerTitle={
            configModal.typeModal === "userInfo"
              ? "Nhập thông tin để quay"
              : "Chúc mừng bạn đã trúng thưởng"
          }
          cancelButtonLabel="Hủy"
          submitButtonLabel={
            configModal.typeModal === "userInfo" ? "Xác nhận" : "Tiếp tục"
          }
          onSubmit={
            configModal.typeModal === "userInfo"
              ? handleSubmit(onSubmit)
              : handleContinue
          }
        >
          {configModal.typeModal === "userInfo" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    control={control}
                    name="name"
                    label="Họ tên"
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    control={control}
                    name="phone"
                    label="Số điện thoại"
                    required
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    control={control}
                    name="address"
                    label="Địa chỉ"
                    required
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    control={control}
                    name="email"
                    label="Email"
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
              </Grid>
            </form>
          ) : (
            <WinningResult
              winningResult={winningResult}
              handleContinue={handleContinue}
            />
          )}
        </CRUDModal>
      </div>
      <EventDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        message={dialogMessage}
      />
    </Box>
  );
};

export default LuckySpin;
