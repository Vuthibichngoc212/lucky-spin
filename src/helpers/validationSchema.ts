import * as yup from "yup";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const validationSchema = yup.object().shape({
  name: yup.string().required("Họ tên không được để trống"),
  phone: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(
      /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  address: yup.string().required("Địa chỉ không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .matches(EMAIL_REGEX, "Email không hợp lệ"),
});
