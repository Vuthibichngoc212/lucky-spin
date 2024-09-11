/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import * as XLSX from "xlsx";
// import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Export: React.FC = () => {
  const exportToExcel = async () => {
    // Lấy dữ liệu từ collection "users"
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersData: any[] = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      usersData.push({
        id: doc.id,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        email: data.email,
        createdAt: data.createdAt,
      });
    });

    // Lấy dữ liệu từ collection "spinHistory"
    const spinSnapshot = await getDocs(collection(db, "spinHistory"));
    const spinData: any[] = [];
    spinSnapshot.forEach((doc) => {
      const data = doc.data();
      spinData.push({
        email: data.email, // Đảm bảo email trùng khớp với collection "users"
        prize: data.prize,
        date: data.date,
        ip: data.ipAddress,
      });
    });

    const combinedData = usersData.map((user) => {
      const spinInfo = spinData.find((spin) => spin.email === user.email); // Tìm thông tin quay của người dùng
      if (spinInfo) {
        return {
          ...user,
          prize: spinInfo.prize || "Không có", // Nếu không có thông tin quay, để trống
          spinDate: spinInfo.date || "Không có",
          ip: spinInfo.ip || "Không có",
        };
      } else {
        // Trường hợp không có thông tin quay trong spinHistory
        return {
          ...user,
          prize: "Không có",
          spinDate: "Không có",
          ip: "Không có",
        };
      }
    });

    // Tạo một WorkBook mới
    const wb = XLSX.utils.book_new();
    // Chuyển đổi dữ liệu sang sheet
    const ws = XLSX.utils.json_to_sheet(combinedData);
    // Thêm sheet vào WorkBook
    XLSX.utils.book_append_sheet(wb, ws, "User_Spin_Data");
    // Xuất file Excel
    XLSX.writeFile(wb, "User_Spin_Data.xlsx");
  };

  return (
    <div>
      <button
        onClick={exportToExcel}
        className="py-2 px-5 w-[100%] rounded-lg bg-[#1A2B57] text-white font-bold"
      >
        Xuất file
      </button>
    </div>
  );
};

export default Export;
