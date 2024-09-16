import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { UserData } from "../types";

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

//lấy tất cả các người dùng từ Firestore
export const getAllSpinHistory = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "spinHistory"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const checkSpinAvailability = async (
  email: string,
  ipAddress: string,
  date: string
) => {
  try {
    const spinRef = collection(db, "spinHistory");

    const q = query(
      spinRef,
      where("date", "==", date),
      where("email", "==", email)
    );
    const querySnapshotByEmail = await getDocs(q);

    const qIp = query(
      spinRef,
      where("date", "==", date),
      where("ipAddress", "==", ipAddress)
    );
    const querySnapshotByIp = await getDocs(qIp);

    const qBoth = query(
      spinRef,
      where("date", "==", date),
      where("email", "==", email),
      where("ipAddress", "==", ipAddress)
    );
    const querySnapshotByBoth = await getDocs(qBoth);

    // Kiểm tra các trường hợp
    if (!querySnapshotByBoth.empty) {
      return { result: "both" };
    } else if (!querySnapshotByEmail.empty || !querySnapshotByIp.empty) {
      return { result: "either" };
    } else {
      return { result: "none" };
    }
  } catch (e) {
    console.error("Error checking user in Firestore: ", e);
    return false;
  }
};
