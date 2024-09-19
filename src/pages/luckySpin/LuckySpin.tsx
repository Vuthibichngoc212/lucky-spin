/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// import { PRIZES } from "../../data/constant";
import dayjs, { Dayjs } from "dayjs";
import { getTimeDifference } from "../../utils/get-time-difference";

import { addUser, addUserSpinDate } from "../../utils/firebaseOperations";
import { calculateSpin, Prize, randomIndex } from "../../utils/spinLogic";
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
import { Box, Grid } from "@mui/material";
import Text from "../../assets/text.png";
import EventDialog from "../../components/EventDialog/EventDialog";
import CRUDModal from "../../components/common/CRUDModal/CRUDModal";
import CustomTextField from "../../components/common/CustomTextField/CustomTextField";
import { getPrizes } from "../../data/constant";

const ID = "luckywheel";
const CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE = 15;

const LuckySpin: React.FC = () => {
  const [styleRotate, setStyleRotate] = useState<StyleRotate>({
    deg: 0,
    timingFunc: "ease-in-out",
    timeDuration: 0,
  });

  const [count, setCount] = useState<number>(0);

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
  const [availablePrizes, setAvailablePrizes] = useState<Prize[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UserData) => {
    setCount(count + 1);
    await addUser(data);
    setEmail(data.email);
    setIsUserInfoValid(true);
    setConfigModal({ ...configModal, openModal: false });
  };

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await fetchUseIP();
      setIpAddress(ip);
    };
    fetchIP();
  }, []);

  useEffect(() => {
    const fetchPrizes = async () => {
      const prizes = await getPrizes(); // Gọi hàm để lấy phần thưởng động
      setAvailablePrizes(prizes); // Lưu danh sách phần thưởng vào state
    };
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (isUserInfoValid && countSpin > 0) {
      handleSpin();
    }
  }, [isUserInfoValid]);

  const handleSpin = async () => {
    const today = dayjs().startOf("day").format("YYYY-MM-DD");

    const startDate = dayjs("2024-09-17").startOf("day");
    const endDate = dayjs("2024-09-19").endOf("day");
    const checkDate = dayjs(today).startOf("day");

    if (checkDate.isBefore(startDate)) {
      setDialogMessage(
        "Sự kiện chưa bắt đầu. Bạn chỉ có thể quay từ ngày 12/09."
      );
      setOpenDialog(true);
      return;
    } else if (checkDate.isAfter(endDate)) {
      setDialogMessage("Sự kiện đã kết thúc.");
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

    // const availability = await checkSpinAvailability(email, ipAddress, today);
    // if (availability.result !== "none") {
    //   setDialogMessage(
    //     "Bạn đã quay trong ngày hôm nay. Vui lòng quay lại vào ngày mai!"
    //   );
    //   setOpenDialog(true);
    //   return;
    // }

    // Lấy danh sách phần thưởng động
    const availablePrizes = await getPrizes();

    setSpinning(true);
    setTime(dayjs());

    // const result = randomIndex(PRIZES);
    const result = randomIndex(availablePrizes);
    setIndexPrizeWon(result);
    setCountSpin((prevState) => prevState - 1);

    // const prize = PRIZES[result];
    const prize = availablePrizes[result];
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
      CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE,
      availablePrizes
    );

    await addUserSpinDate(
      email,
      ipAddress,
      currentDate,
      // PRIZES[result].name,
      availablePrizes[result].name,
      voucherCode || ""
    );

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
      // const numberOfPrizes = PRIZES.length;
      const numberOfPrizes = availablePrizes.length;
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
        // name: PRIZES[indexPrizeWon].name,
        // img: PRIZES[indexPrizeWon].img,
        name: availablePrizes[indexPrizeWon].name,
        img: availablePrizes[indexPrizeWon].img,
      });

      // Thêm phần thưởng vào danh sách đã trúng
      setListPrizeWon([
        ...listPrizeWon,
        {
          // name: PRIZES[indexPrizeWon].name,
          // img: PRIZES[indexPrizeWon].img,
          // time: dayjs().format("DD/MM/YYYY HH:mm:ss"),
          name: availablePrizes[indexPrizeWon].name,
          img: availablePrizes[indexPrizeWon].img,
          time: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        },
      ]);

      alertAfterTransitionEnd();
      setIndexPrizeWon(null);
    }
  }, [indexPrizeWon, availablePrizes, time]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={Text} alt="text" className="img-text" />
      </Box>
      <div className="w-1/2 flex flex-col items-center">
        <LuckyWheel
          id={ID}
          styleRotate={styleRotate}
          // prizes={PRIZES}
          prizes={availablePrizes}
          spinning={spinning}
          timeNeedleRotate={timeNeedleRotate}
          onSpin={handleSpin}
        />

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
