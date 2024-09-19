import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { SpinAvailability, UserData } from "../types";

export const addUser = async (data: UserData) => {
  try {
    await addDoc(collection(db, "users"), {
      fullName: data.name,
      phone: data.phone,
      address: data.address,
      email: data.email,
      createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addUserSpinDate = async (
  email: string,
  ipAddress: string,
  date: string,
  prize: string,
  voucherCode?: string
) => {
  try {
    await addDoc(collection(db, "spinHistory"), {
      email,
      ipAddress,
      date,
      prize,
      voucherCode: voucherCode,
    });
  } catch (e) {
    console.error("Error adding spin history: ", e);
  }
};

export const checkSpinAvailability = async (
  email: string,
  ipAddress: string,
  date: string
): Promise<SpinAvailability> => {
  try {
    const spinRef = collection(db, "spinHistory");
    const formattedDate = dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY");

    const qByEmail = query(
      spinRef,
      where("date", "==", formattedDate),
      where("email", "==", email)
    );
    const querySnapshotByEmail = await getDocs(qByEmail);

    const qByIp = query(
      spinRef,
      where("date", "==", formattedDate),
      where("ipAddress", "==", ipAddress)
    );
    const querySnapshotByIp = await getDocs(qByIp);

    if (!querySnapshotByEmail.empty || !querySnapshotByIp.empty) {
      return { result: "found" };
    } else {
      return { result: "none" };
    }
  } catch (e: unknown) {
    const message = (e as Error).message;
    return { result: "none", error: message };
  }
};

export const checkPrizeAvailability = async (
  prize: string
): Promise<number> => {
  try {
    const today = dayjs().format("DD/MM/YYYY");
    const spinRef = collection(db, "spinHistory");
    const q = query(
      spinRef,
      where("prize", "==", prize),
      where("date", "==", today)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size; // Trả về số lượng phần thưởng đã trúng trong ngày
  } catch (e) {
    console.error(`Lỗi khi kiểm tra số lượng ${prize}: `, e);
    return 0;
  }
};

export const checkTotalPrizeAvailability = async (
  prize: string,
  maxLimit: number
): Promise<number> => {
  try {
    const startDate = dayjs().subtract(7, "day").format("DD/MM/YYYY");
    const today = dayjs().format("DD/MM/YYYY");

    const spinRef = collection(db, "spinHistory");
    const q = query(
      spinRef,
      where("prize", "==", prize),
      where("date", ">=", startDate),
      where("date", "<=", today)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size >= maxLimit ? maxLimit : querySnapshot.size; // Trả về số lượng phần thưởng đã trúng, nếu đạt giới hạn, trả về giới hạn
  } catch (e) {
    console.error(`Lỗi khi kiểm tra số lượng ${prize} trong 7 ngày: `, e);
    return 0;
  }
};
