import { useEffect, useState } from "react";
import "./chats.css";

const DOTS = ["..", "...", "...."];

export default function LoadingChat() {
  const [step, setStep] = useState(0);

  // 1초마다 점 개수를 바꾸고, 화면에서 사라질 때 타이머를 정리한다
  useEffect(() => {
    const timer = setInterval(
      () => setStep((prev) => (prev + 1) % DOTS.length),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="chat-container model">
      <div className="bubble model loading">
        <div className="spinner"></div>
        <p>{`불러오는 중${DOTS[step]}`}</p>
      </div>
    </div>
  );
}
