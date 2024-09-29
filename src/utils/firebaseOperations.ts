import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import dayjs from "dayjs";
import { SpinAvailability, UserData } from "../types";

export interface Voucher {
  id: string;
  code: string;
  type: string;
  isUsed: boolean;
}

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
  phone: string,
  date: string,
  prize: string,
  voucherCode?: string
) => {
  try {
    await addDoc(collection(db, "spinHistory"), {
      email,
      phone,
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
  phone: string,
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

    const qByPhone = query(
      spinRef,
      where("date", "==", formattedDate),
      where("phone", "==", phone)
    );
    const querySnapshotByPhone = await getDocs(qByPhone);

    if (!querySnapshotByEmail.empty || !querySnapshotByPhone.empty) {
      return { result: "found" };
    } else {
      return { result: "none" };
    }
  } catch (e: unknown) {
    const message = (e as Error).message;
    return { result: "none", error: message };
  }
};

export const checkPrizeAvailabilityBatch = async (prizes: string[]) => {
  try {
    const today = dayjs().format("DD/MM/YYYY");
    const spinRef = collection(db, "spinHistory");

    const queries = prizes.map((prize) =>
      query(spinRef, where("prize", "==", prize), where("date", "==", today))
    );

    const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));

    return querySnapshots.map((snapshot) => snapshot.size);
  } catch {
    return Array(prizes.length).fill(0);
  }
};

export const checkTotalPrizeAvailabilityBatch = async (
  prizes: string[],
  maxLimits: number[]
) => {
  try {
    const startDate = dayjs().subtract(6, "day").format("DD/MM/YYYY");
    const today = dayjs().format("DD/MM/YYYY");
    const spinRef = collection(db, "spinHistory");

    const queries = prizes.map((prize) =>
      query(
        spinRef,
        where("prize", "==", prize),
        where("date", ">=", startDate),
        where("date", "<=", today)
      )
    );

    const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));

    return querySnapshots.map((snapshot, index) =>
      snapshot.size >= maxLimits[index] ? maxLimits[index] : snapshot.size
    );
  } catch {
    return Array(prizes.length).fill(0);
  }
};

export const getAvailableVoucher = async (
  type: string
): Promise<Voucher | null> => {
  try {
    const voucherRef = collection(db, "vouchers");
    const q = query(
      voucherRef,
      where("type", "==", type),
      where("isUsed", "==", false)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const voucherDoc = querySnapshot.docs[0]; // Lấy mã voucher đầu tiên
      const voucherData = voucherDoc.data();
      return { id: voucherDoc.id, ...voucherData } as Voucher;
    }
    return null; // Không có voucher khả dụng
  } catch (e) {
    console.error("Error getting available voucher: ", e);
    return null;
  }
};

export const markVoucherAsUsed = async (voucherId: string): Promise<void> => {
  try {
    const voucherDocRef = doc(db, "vouchers", voucherId);
    await updateDoc(voucherDocRef, {
      isUsed: true,
    });
  } catch (e) {
    console.error("Error marking voucher as used: ", e);
  }
};
