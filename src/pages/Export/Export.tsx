/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import "./Export.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Box } from "@mui/material";

const Export: React.FC = () => {
  useEffect(() => {
    // Thêm lớp mới cho body khi trang Export được mount
    document.body.classList.add("export-background");

    // Xóa lớp đó khi component bị unmount (rời khỏi trang Export)
    return () => {
      document.body.classList.remove("export-background");
    };
  }, []);

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

    // Đặt tiêu đề cho các cột
    const header = [
      { v: "ID" },
      { v: "Họ tên" },
      { v: "Số điện thoại" },
      { v: "Địa chỉ" },
      { v: "Email" },
      { v: "Ngày tạo" },
      { v: "Phần thưởng" },
      { v: "Ngày quay" },
      { v: "Địa chỉ Ip" },
    ];

    // Tạo một WorkBook mới
    const wb = XLSX.utils.book_new();

    // Chuyển đổi dữ liệu sang sheet
    const ws = XLSX.utils.json_to_sheet(combinedData, {
      header: [
        "id",
        "fullName",
        "phone",
        "address",
        "email",
        "createdAt",
        "prize",
        "spinDate",
        "ip",
      ],
    });

    // Thêm hàng tiêu đề vào sheet
    XLSX.utils.sheet_add_aoa(ws, [header.map((col) => col.v)], {
      origin: "A1",
    });

    // Điều chỉnh độ rộng các cột
    ws["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
    ];

    // Thêm sheet vào WorkBook
    XLSX.utils.book_append_sheet(wb, ws, "User_Spin_Data");

    // Xuất file Excel
    XLSX.writeFile(wb, "User_Spin_Data.xlsx");
  };

  return (
    <Box>
      <button
        onClick={exportToExcel}
        className="py-2 px-5  rounded-lg bg-[#1A2B57] text-white font-bold"
      >
        Xuất file
      </button>
    </Box>
  );
};

export default Export;
