import { PRIZES } from "../data/constant";

// function callApi(): Promise<number> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const randomNumber = Math.floor(Math.random() * PRIZES.length);
//       resolve(randomNumber);
//     }, 3000);
//   });
// }

function callApi(): Promise<number> {
  // Lọc bỏ những phần quà có percentpage bằng 0 trước khi thực hiện quay
  const filteredPrizes = PRIZES.filter((prize) => prize.percentpage > 0);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tạo số ngẫu nhiên dựa trên số lượng phần quà đã lọc
      const randomNumber = Math.floor(Math.random() * filteredPrizes.length);
      resolve(randomNumber);
    }, 3000);
  });
}

export async function delayedApiCall() {
  try {
    const result = await callApi();
    return result;
  } catch (error) {
    throw error;
  }
}
