import "./style.css";

type Props = {
  winningResult: { name: string; img: string };
  handleContinue: () => void;
};

const WinningResult = ({ winningResult }: Props) => {
  return (
    <div className="modal-container flex flex-col justify-center items-center gap-2 py-1 px-5 bg-white rounded-lg">
      <img src={winningResult.img} className="w-[25%] object-cover" />
      {/* <img src={"vite.svg"} className="w-[30%]" /> */}
      <span className="text-lg font-bold">Chúc mừng</span>
      <span className="text-lg font-bold">Phần thưởng của bạn là</span>
      <span className="text-lg font-bold text-[#C49B60]">
        {winningResult.name}
      </span>
    </div>
  );
};

export default WinningResult;
