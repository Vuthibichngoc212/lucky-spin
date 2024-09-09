/* eslint-disable @typescript-eslint/no-explicit-any */

export function randomIndex(
  prizes: { name: string; img: any; percentpage: number }[]
) {
  let winningPrizeIndex = 0;

  // Lọc bỏ những phần quà có percentpage bằng 0
  const filteredPrizes = prizes.filter((prize) => prize.percentpage > 0);

  // Mảng tỉ lệ tích luỹ qua các phần quà
  const cumulativeRatios: number[] = [];
  let cumulativeRatio = 0;

  for (const prize of filteredPrizes) {
    cumulativeRatio += prize.percentpage;
    cumulativeRatios.push(cumulativeRatio);
  }

  // Tổng tỉ lệ tích luỹ qua tất cả phần quà
  const totalCumulativeRatio = cumulativeRatios[cumulativeRatios.length - 1];

  // Tạo số ngẫu nhiên trong khoảng từ 0 đến tổng tỉ lệ tích lũy
  const randomValue = Math.random() * totalCumulativeRatio;

  console.log(randomValue);

  // So sánh giá trị ngẫu nhiên với các tỉ lệ tích lũy để xác định phần thưởng trúng
  for (let i = 0; i < cumulativeRatios.length; i++) {
    if (randomValue <= cumulativeRatios[i]) {
      winningPrizeIndex = i;
      break;
    }
  }

  return prizes.findIndex(
    (prize) => prize.name === filteredPrizes[winningPrizeIndex].name
  );
}
