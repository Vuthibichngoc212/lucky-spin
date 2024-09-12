/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";

// Hàm thêm thông tin người dùng vào Firestore
export const addUser = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      fullName: data.name,
      phone: data.phone,
      address: data.address,
      email: data.email,
      createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Thêm ngày quay của người dùng và phần thưởng trúng vào Firestore
export const addUserSpinDate = async (
  email: string,
  ipAddress: string,
  date: string,
  prize: string
) => {
  try {
    await addDoc(collection(db, "spinHistory"), {
      email,
      ipAddress,
      date,
      prize,
    });
  } catch (e) {
    console.error("Error adding spin history: ", e);
  }
};

// Lấy lịch sử quay của người chơi từ Firestore dựa trên email hoặc IP
export const getUserSpinHistory = async (email: string, ipAddress: string) => {
  try {
    const qEmail = query(
      collection(db, "spinHistory"),
      where("email", "==", email) // Lấy lịch sử quay dựa trên email
    );
    const qIp = query(
      collection(db, "spinHistory"),
      where("ipAddress", "==", ipAddress) // Lấy lịch sử quay dựa trên IP
    );

    const [emailSnapshot, ipSnapshot] = await Promise.all([
      getDocs(qEmail),
      getDocs(qIp),
    ]);

    const spinDates: string[] = [];

    emailSnapshot.forEach((doc) => {
      spinDates.push(doc.data().date); // Lưu ngày quay từ email
    });

    ipSnapshot.forEach((doc) => {
      spinDates.push(doc.data().date); // Lưu ngày quay từ IP
    });

    return spinDates; // Trả về danh sách các ngày quay từ cả email và IP
  } catch (e) {
    console.error("Error retrieving spin history: ", e);
    return [];
  }
};
