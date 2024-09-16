import { memo, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./style.css";
import { COLORS } from "../../data/constant";
// import centerImage from "../../assets/center2.png";
import centerImage from "../../assets/centerImg.png";

type Props = {
  id: string;
  styleRotate: {
    deg: number;
    timingFunc: string;
    timeDuration: number;
  };
  spinning?: boolean;
  prizes: { name: string; img: string; percentpage: number }[];
  timeNeedleRotate: number;
};

const COLOR = ["#b0061a", "#fed882"];

const LuckyWheel = ({
  id,
  styleRotate,
  prizes,
  spinning,
  timeNeedleRotate,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawWheel = (
    prizes: { name: string; img: string; percentpage: number }[]
  ) => {
    const num = prizes.length;
    // const rotateDeg = 360 / num / 2 + 90; // Tính toán góc xoay
    const rotateDeg = (360 / num) * 0.5;
    const turnNum = 1 / num;
    const html = [];

    const ele = document.getElementById(id);
    const ulElementFirstRender = document.querySelector(".luckywheel-list");

    if (ulElementFirstRender) {
      ulElementFirstRender.remove();
    }

    if (ele) {
      const prizeItems = document.createElement("ul");
      const container = ele.querySelector(".luckywheel-container");

      if (canvasRef.current && container) {
        const ctx = canvasRef.current.getContext("2d")!;
        for (let i = 0; i < num; i++) {
          // Vẽ phần của vòng quay
          ctx.save();
          ctx.beginPath();
          ctx.translate(250, 250); // Tâm vòng quay
          ctx.moveTo(0, 0);
          ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180); // Tính góc từng phần thưởng
          ctx.arc(0, 0, 250, 0, (2 * Math.PI) / num, false); // Vẽ phần bánh xe
          ctx.fillStyle = COLOR[i % 2];
          ctx.fill();
          // ctx.lineWidth = 1;
          // ctx.strokeStyle = "#1A2B57";
          // ctx.stroke();
          ctx.restore();

          const textColor = i % 2 === 0 ? "white" : "black";

          const htmlString = `<li class="luckywheel-item"><span style="transform: rotate(${
            i * turnNum
          }turn); width: ${
            (100 / num) * 2 - 2
          }%"><div style="border: 1.5px solid ${
            i % 2 === 0 ? COLORS.primary_first : COLORS.primary_second
          }" class="luckywheel-item__content"><img src="${
            prizes[i].img
          }" style="margin: 0 auto" /><div class="text-container"><p class="name-prize" style="color: ${textColor}; margin-top: 5px">${
            prizes[i].name
          }</p></div></div></span></li>`;

          html.push(htmlString);
        }
        prizeItems.className = "luckywheel-list";
        container.appendChild(prizeItems);
        prizeItems.innerHTML = html.join("");
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function rotateArrow(
    spinningLuckyWheel?: boolean,
    timeNeedleRotate?: number
  ) {
    if (arrowRef.current) {
      if (spinningLuckyWheel && timeNeedleRotate) {
        arrowRef.current.style.animation = `rotate ${timeNeedleRotate}s linear infinite`;
      } else {
        arrowRef.current.style.animation = "";
      }
    }
    requestAnimationFrame(() =>
      rotateArrow(spinningLuckyWheel, timeNeedleRotate)
    );
  }

  useEffect(() => {
    void rotateArrow(spinning, timeNeedleRotate);
  }, [spinning, arrowRef, timeNeedleRotate, rotateArrow]);

  useEffect(() => {
    // Chỉ vẽ lại bánh xe khi có thay đổi về phần thưởng hoặc góc quay
    void drawWheel(prizes);
  }, [drawWheel, prizes, styleRotate]);

  return (
    <div className="wrapper sm:w-[300px] md:w-[600px]" id="wrapper">
      <section id="luckywheel" className="luckywheel">
        <div className="luckywheel-btn">
          <div ref={arrowRef} className="luckywheel-btn-icon ">
            <FaMapMarkerAlt className="color-icon text-[60px]" />
          </div>
        </div>

        <div
          className="luckywheel-container"
          style={
            styleRotate.deg !== 0
              ? {
                  transform: `rotate(${styleRotate.deg}deg)`,
                  transitionTimingFunction: styleRotate.timingFunc,
                  transitionDuration: `${styleRotate.timeDuration}s`,
                }
              : {}
          }
        >
          <canvas
            ref={canvasRef}
            className="luckywheel-canvas"
            width={"500px"}
            height={"500px"}
          />
        </div>

        <img src={centerImage} className="luckywheel-logo flex border-0" />
      </section>
    </div>
  );
};

export default memo(LuckyWheel);
