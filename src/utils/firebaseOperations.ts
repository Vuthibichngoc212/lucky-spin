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
