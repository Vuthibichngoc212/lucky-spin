import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    maxHeight: "100vh",
    overflow: "auto",
    backgroundColor: "#fafafa", // Màu nền cho container bảng
  },
  table: {
    minWidth: 650, // Đảm bảo bảng có đủ không gian để hiển thị dữ liệu
  },
  head: {
    backgroundColor: "#1A2B57", // Màu nền cho header bảng
    color: "#ffffff", // Màu chữ cho header
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f4f4f8", // Màu nền cho các hàng lẻ
    },
  },
  cell: {
    padding: "16px 24px", // Khoảng cách trong cho mỗi ô
    color: "#333333", // Màu chữ cho các ô
    border: "1px solid #e0e0e0", // Đường viền cho mỗi ô
  },
});
