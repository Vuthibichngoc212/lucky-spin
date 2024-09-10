/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./App.css";
import { PRIZES } from "./data/constant";
import { AiOutlineMenu } from "react-icons/ai";
import { ListPrizeWon, LuckyWheel, Modal, WinningResult } from "./components";
import dayjs, { Dayjs } from "dayjs";
import { getTimeDifference } from "./utils/get-time-difference";
import { ConfigModal, PrizeWon, StyleRotate, WinningResultType } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { validationSchema } from "./helpers/validationSchema";
import {
  addUser,
  addUserSpinDate,
  exportUserData,
  getUserSpinHistory,
} from "./utils/firebaseOperations";
import { calculateSpin, randomIndex } from "./utils/spinLogic";

const ID = "luckywheel";
const CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE = 12;
const CURRENT_TIME_DURATION_NEEDLE_ROTATE = 0.6;

const App: React.FC = () => {
  const [userData, setUserData] = useState(null);
  const [styleRotate, setStyleRotate] = useState<StyleRotate>({
    deg: 0,
    timingFunc: "ease-in-out",
    timeDuration: 0,
  });
  // Trạng thái quản lý xem vòng quay có đang quay hay không.
  const [spinning, setSpinning] = useState<boolean>(false);
  //  Số lượt quay còn lại của người chơi.
  const [countSpin, setCountSpin] = useState<number>(7);
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
  /**
   * State for case call api get prize on server
   * If use case random index, you should remove this useState
   */
  //Chỉ số phần thưởng trúng khi gọi API (nếu dùng).
  const [indexPrizeWon, setIndexPrizeWon] = useState<number | null>(null);

  const [isUserInfoValid, setIsUserInfoValid] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    await addUser(data);
    setUserData(data);

    console.log(11, userData);

    setIsUserInfoValid(true);
    setConfigModal({ ...configModal, openModal: false });
  };

  const exportToExcel = async () => {
    const userData = await exportUserData();
    // Tạo một WorkBook mới
    const wb = XLSX.utils.book_new();
    // Chuyển đổi dữ liệu sang sheet
    const ws = XLSX.utils.json_to_sheet(userData);
    // Thêm sheet vào WorkBook
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    // Xuất file Excel
    XLSX.writeFile(wb, "User_Data.xlsx");
  };

  useEffect(() => {
    // if (isUserInfoValid && countSpin > 0) {
    if (isUserInfoValid && countSpin > 0 && userData) {
      handleSpin(userData);
    }
  }, [isUserInfoValid, userData]);

  /**
   * Function to spin and call api get prize on server
   */

  const handleSpin = async (formData: any) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    const startDate = dayjs("2024-09-09");
    const endDate = dayjs("2024-09-19");
    const currentDateDayjs = dayjs();

    // Kiểm tra nếu ngày quay không hợp lệ
    if (
      currentDateDayjs.isBefore(startDate) ||
      currentDateDayjs.isAfter(endDate)
    ) {
      alert("Vòng quay chỉ diễn ra từ ngày 12/9 đến 19/9.");
      return;
    }

    // Kiểm tra nếu người chơi chưa nhập thông tin
    if (!isUserInfoValid) {
      // Hiển thị modal yêu cầu người chơi nhập thông tin
      setConfigModal({ openModal: true, typeModal: "userInfo" });
      return;
    }

    // Kiểm tra lịch sử quay
    const userId = formData.phone;
    const spinHistory = await getUserSpinHistory(userId);

    // Kiểm tra xem đã quay trong ngày chưa
    if (spinHistory && spinHistory.includes(currentDate)) {
      alert("Bạn đã quay hôm nay rồi, vui lòng quay lại vào ngày mai!");
      return;
    }

    // Kiểm tra nếu đã quay quá 7 ngày
    if (spinHistory.length >= 7) {
      alert("Bạn đã quay đủ 7 lần.");
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
      CURRENT_TIME_DURATION_LUCKY_WHEEL_ROTATE,
      CURRENT_TIME_DURATION_NEEDLE_ROTATE
    );

    // Lưu ngày quay vào Firestore
    await addUserSpinDate(userId, currentDate);
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
    if (winningResult.name === "Lượt chơi")
      setCountSpin((prevState) => prevState + 1);
  };

  const handleOpenListOfPrizeWon = () => {
    setConfigModal({
      openModal: true,
      typeModal: "list",
    });
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
    <div className="relative flex flex-col justify-center items-center">
      <div
        onClick={handleOpenListOfPrizeWon}
        className="menu-list-prize-won fixed top-10 right-7 p-3 rounded-lg bg-[#1A2B57] text-white cursor-pointer"
      >
        Danh sách quà đã trúng thưởng
      </div>
      <AiOutlineMenu
        onClick={handleOpenListOfPrizeWon}
        className={
          "icon-menu-list-prize-won text-[30px] fixed top-10 right-7 cursor-pointer"
        }
      />

      <Modal
        close={() => {
          setConfigModal({
            typeModal: "notify",
            openModal: false,
          });
        }}
        className={
          configModal.openModal ? "" : "invisible opacity-0 scale-0 transition"
        }
      >
        {configModal.typeModal === "notify" ? (
          <WinningResult
            winningResult={winningResult}
            handleContinue={handleContinue}
          />
        ) : configModal.typeModal === "list" ? (
          <ListPrizeWon listPrizeWon={listPrizeWon} />
        ) : (
          <div className="list-prize-won-container flex flex-col gap-3 py-8 px-5 bg-white rounded-lg">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="custom-heading font-bold">
                Nhập thông tin để quay
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="custom-label">
                    Họ tên
                  </label>
                  <div style={{ marginTop: "0.5rem" }}>
                    <input
                      id="name"
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      {...register("name")}
                      className="custom-text border-solid border-2 w-full rounded-lg mb-5"
                    />
                    {errors.name && (
                      <p className="text-error">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="custom-label">
                    Số điện thoại
                  </label>
                  <div style={{ marginTop: "0.5rem" }}>
                    <input
                      id="phone"
                      type="text"
                      placeholder="Nhập số điện thoại"
                      {...register("phone")}
                      className="custom-text border-solid border-2 w-full rounded-lg mb-5"
                    />
                    {errors.phone && (
                      <p className="text-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="custom-label">
                    Địa chỉ
                  </label>
                  <div style={{ marginTop: "0.5rem" }}>
                    <input
                      id="address"
                      type="text"
                      placeholder="Nhập địa chỉ"
                      {...register("address")}
                      className="custom-text border-solid border-2 w-full rounded-lg mb-5"
                    />
                    {errors.address && (
                      <p className="text-error">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="py-2  px-5 w-[100%] rounded-lg bg-[#1A2B57] text-white font-bold btn-shadow-animate"
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Modal>

      <button
        onClick={exportToExcel}
        className="py-2 px-5 w-[100%] rounded-lg bg-[#1A2B57] text-white font-bold"
      >
        Xuất file
      </button>

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
          } px-5 w-[100%] rounded-lg bg-[#1A2B57] text-white font-bold`}
        >
          {spinning ? "Đang quay" : "Quay"}
          <p className="font-light">
            {countSpin > 0
              ? `Còn ${countSpin} lượt quay`
              : "Bạn đã hết lượt quay"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default App;
