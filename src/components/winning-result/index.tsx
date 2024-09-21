import "./style.css";

type Props = {
  winningResult: { name: string; img: string; voucherCode?: string };
  handleContinue: () => void;
};

const WinningResult = ({ winningResult }: Props) => {
  return (
    <div className="modal-container flex flex-col justify-center items-center gap-2 py-1 px-5 bg-white rounded-lg">
      {winningResult.name === "Chúc bạn may mắn lần sau" ? (
        <span className="text-lg font-bold text-[#C49B60]">
          {winningResult.name}
        </span>
      ) : (
        <>
          <img src={winningResult.img} className="w-[25%] object-cover" />
          <span className="text-lg font-bold">Chúc mừng</span>
          <span className="text-lg font-bold">Phần thưởng của bạn là</span>
          <span className="text-lg font-bold text-[#C49B60]">
            {winningResult.name}
          </span>
          {winningResult.voucherCode && (
            <span className="text-lg font-bold text-[#C49B60]">
              Mã voucher: {winningResult.voucherCode}
            </span>
          )}
          <span className="text-base text-[#C49B60]">
            Vui lòng chụp lại màn hình hoặc copy mã voucher để áp dụng khi mua
            hàng
          </span>
        </>
      )}
    </div>
  );
};

export default WinningResult;
