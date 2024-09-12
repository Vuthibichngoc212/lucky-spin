/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { PRIZES } from "../../data/constant";
import dayjs, { Dayjs } from "dayjs";
import { getTimeDifference } from "../../utils/get-time-difference";
import {
  addUser,
  addUserSpinDate,
  getUserSpinHistory,
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
  WinningResultType,
} from "../../types";
import {
  // ListPrizeWon,
  LuckyWheel,
  WinningResult,
} from "../../components";
import "./LuckySpin.css";
// import { AiOutlineMenu } from "react-icons/ai";
import { Box, Grid, Typography } from "@mui/material";
import EventDialog from "../../components/EventDialog/EventDialog";
import CRUDModal from "../../components/common/CRUDModal/CRUDModal";
import CustomTextField from "../../components/common/CustomTextField/CustomTextField";
// import PrizeListTable from "../../components/common/PrizeListTable/PrizeListTable";

const ID = "luckywheel";
const CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE = 15;
// const CURRENT_TIME_DURATION_NEEDLE_ROTATE = 0.6;

const LuckySpin: React.FC = () => {
  const [styleRotate, setStyleRotate] = useState<StyleRotate>({
    deg: 0,
    timingFunc: "ease-in-out",
    timeDuration: 0,
  });
  // Trạng thái quản lý xem vòng quay có đang quay hay không.
  const [spinning, setSpinning] = useState<boolean>(false);
  //  Số lượt quay còn lại của người chơi.
  const [countSpin, setCountSpin] = useState<number>(1);
  // Thông tin về phần thưởng sau khi quay
  const [winningResult, setWinningResult] = useState<WinningResultType>({
    name: "",
    img: "",
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

  const onSubmit = async (data: any) => {
    await addUser(data);
    console.log(11, data);

    setEmail(data.email);
    setIsUserInfoValid(true);
    setConfigModal({ ...configModal, openModal: false });
  };

  // Lấy địa chỉ IP của người chơi khi load ứng dụng
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

    // Kiểm tra nếu sự kiện chưa bắt đầu
    if (today.isBefore(startDate)) {
      setDialogMessage(
        "Sự kiện chưa bắt đầu. Bạn chỉ có thể quay từ ngày 12/09"
      );
      setOpenDialog(true);
      return;
    }

    // Kiểm tra nếu sự kiện đã kết thúc
    if (today.isAfter(endDate)) {
      setDialogMessage("Sự kiện đã kết thúc");
      setOpenDialog(true); // Hiển thị popup
      return;
    }

    // Kiểm tra nếu người chơi chưa nhập thông tin
    if (!isUserInfoValid) {
      // Hiển thị modal yêu cầu người chơi nhập thông tin
      setConfigModal({ openModal: true, typeModal: "userInfo" });
      return;
    }
    // Kiểm tra nếu không có địa chỉ IP thì không cho phép quay
    if (!ipAddress) {
      alert("Không thể lấy địa chỉ IP của bạn. Vui lòng thử lại.");
      return;
    }
    if (!email) {
      alert("Email không được xác định. Vui lòng nhập thông tin.");
      return;
    }

    // Lấy ngày hiện tại
    const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");
    // Lấy lịch sử quay của người dùng
    const spinHistory = await getUserSpinHistory(email, ipAddress);

    // Kiểm tra nếu đã quay trong ngày hôm nay
    const hasSpunToday = spinHistory.some((date) =>
      dayjs(date).isSame(currentDate, "day")
    );

    if (hasSpunToday) {
      setDialogMessage("Bạn đã quay hôm nay. Vui lòng quay lại vào ngày mai!");
      setOpenDialog(true); // Hiển thị popup
      return;
    }

    // Nếu các điều kiện hợp lệ, tiến hành quay
    setSpinning(true);
    setTime(dayjs());

    const result = randomIndex(PRIZES);
    setIndexPrizeWon(result);
    setCountSpin((prevState) => prevState - 1);

    calculateSpin(
      result,
      dayjs(),
      styleRotate,
      setStyleRotate,
      setTimeNeedleRotate,
      CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE
    );

    // Lưu lịch sử quay kèm phần quà và thông tin email, IP
    await addUserSpinDate(email, ipAddress, currentDate, PRIZES[result].name);
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

  // const handleOpenListOfPrizeWon = () => {
  //   setConfigModal({
  //     openModal: true,
  //     typeModal: "list",
  //   });
  // };

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
      setIndexPrizeWon(null); // Reset trạng thái sau khi quay
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
