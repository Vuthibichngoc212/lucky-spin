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

// Hàm lấy dữ liệu người dùng từ Firestore
// export const exportUserData = async (): Promise<any[]> => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "spinHistory"));
//     const userData: any[] = [];
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       userData.push({
//         id: doc.id,
//         fullName: data.fullName,
//         email: data.email,
//         ip: data.userIp,
//         date: data.date,
//         prize: data.prize,
//       });
//     });
//     return userData;
//   } catch (e) {
//     console.error("Error retrieving user data: ", e);
//     return [];
//   }
// };

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

// Lấy lịch sử quay của người chơi từ Firestore dựa trên IP
export const getUserSpinHistory = async (userIp: string) => {
  try {
    const q = query(
      collection(db, "spinHistory"),
      where("userIp", "==", userIp) // Lấy lịch sử quay dựa trên IP
    );
    const querySnapshot = await getDocs(q);
    const spinDates: string[] = [];
    querySnapshot.forEach((doc) => {
      spinDates.push(doc.data().date); // Lưu ngày quay
    });
    return spinDates; // Trả về danh sách các ngày quay
  } catch (e) {
    console.error("Error retrieving spin history: ", e);
    return [];
  }
};
