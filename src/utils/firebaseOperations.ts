/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import { User } from "../types";

// Hàm thêm thông tin người dùng vào Firestore
export const addUser = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      fullName: data.name,
      phone: data.phone,
      address: data.address,
      createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Hàm lấy dữ liệu người dùng từ Firestore
export const exportUserData = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userData: User[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<User, "id">;
      userData.push({ id: doc.id, ...data });
    });
    return userData;
  } catch (e) {
    console.error("Error retrieving user data: ", e);
    return [];
  }
};

// Thêm thông tin người chơi và ngày quay vào Firestore
export const addUserSpinDate = async (userId: string, date: string) => {
  try {
    await addDoc(collection(db, "spinHistory"), {
      userId,
      date,
    });
  } catch (e) {
    console.error("Error adding spin history: ", e);
  }
};

// Lấy lịch sử quay của người chơi từ Firestore
export const getUserSpinHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, "spinHistory"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const spinDates: string[] = [];
    querySnapshot.forEach((doc) => {
      spinDates.push(doc.data().date);
    });
    return spinDates;
  } catch (e) {
    console.error("Error retrieving spin history: ", e);
    return [];
  }
};
