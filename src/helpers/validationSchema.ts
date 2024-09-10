import * as yup from "yup";

export const validationSchema = yup.object().shape({
  name: yup.string().required("Họ tên là bắt buộc"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(
      /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  address: yup.string().required("Địa chỉ là bắt buộc"),
});
