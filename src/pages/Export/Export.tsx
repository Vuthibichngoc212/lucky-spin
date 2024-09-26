import React, { useEffect } from "react";
import * as XLSX from "xlsx";
import "./Export.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Box } from "@mui/material";
import dayjs from "dayjs";

interface User {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  createdAt: string;
}

interface Spin {
  email: string;
  prize: string;
  date: string;
  voucherCode: string;
}

const Export: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("export-background");
    return () => {
      document.body.classList.remove("export-background");
    };
  }, []);

  const exportToExcel = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const spinSnapshot = await getDocs(collection(db, "spinHistory"));

      const usersData: User[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      const spinData: Spin[] = spinSnapshot.docs.map((doc) => ({
        email: doc.data().email,
        prize: doc.data().prize,
        date: doc.data().date,
        voucherCode: doc.data().voucherCode,
      })) as Spin[];

      const combinedData = usersData.map((user) => {
        const createdAtParts = user.createdAt.split(" ");
        const dateParts = createdAtParts[0].split("/");
        const isoDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${createdAtParts[1]}`;
        const userDateFormatted = dayjs(isoDateString);

        const spinInfo = spinData.find(
          (spin) =>
            spin.email === user.email &&
            spin.date === userDateFormatted.format("DD/MM/YYYY")
        );

        return {
          ...user,
          prize: spinInfo ? spinInfo.prize : "Không có thông tin",
          spinDate: spinInfo ? spinInfo.date : "Không có thông tin",
          voucherCode: spinInfo ? spinInfo.voucherCode : "",
        };
      });

      const header = [
        { v: "ID" },
        { v: "Họ tên" },
        { v: "Số điện thoại" },
        { v: "Địa chỉ" },
        { v: "Email" },
        { v: "Ngày tạo" },
        { v: "Phần thưởng" },
        { v: "Mã voucher" },
        { v: "Ngày quay" },
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(combinedData, {
        header: [
          "id",
          "fullName",
          "phone",
          "address",
          "email",
          "createdAt",
          "prize",
          "voucherCode",
          "spinDate",
        ],
      });

      XLSX.utils.sheet_add_aoa(ws, [header.map((col) => col.v)], {
        origin: "A1",
      });

      ws["!cols"] = [
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "User_Spin_Data");
      XLSX.writeFile(wb, "User_Spin_Data.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel: ", error);
    }
  };

  return (
    <Box>
      <button
        onClick={exportToExcel}
        className="py-2 px-5 rounded-lg bg-[#1A2B57] text-white font-bold"
      >
        Xuất file
      </button>
    </Box>
  );
};

export default Export;
