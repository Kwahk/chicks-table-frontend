import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/stores";
import ChatList from "@/components/chat/ChatList";
import SaveModal from "@/components/chat/SaveModal";
import { getUserDisease } from "@/api/user";

import arrowBtn from "@/assets/images/arrowButton.svg";
import "./ChatbotPage.css";

// 대화 상태와 저장 모달 상태는 chat slice에서 관리한다 (기존 SaveContext Provider 제거)
export default function ChatbotPage() {
  const { chatList, isResponding, isSaveModalOpen, initChat, sendMessage } =
    useBoundStore(
      useShallow((state) => ({
        chatList: state.chatList,
        isResponding: state.isResponding,
        isSaveModalOpen: state.saveModal.isOpen,
        initChat: state.initChat,
        sendMessage: state.sendMessage,
      })),
    );
  // 입력 중인 메시지는 이 화면에서만 쓰므로 지역 상태로 둔다
  const [chatInput, setChatInput] = useState("");
  // 새 메시지가 오면 페이지 끝(입력창 아래)이 화면 아래에 오도록 스크롤한다
  const pageRef = useRef(null);

  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatList, isResponding]);

  // 화면에 들어올 때 질병 정보 사용 여부를 묻고 새 대화를 시작한다
  useEffect(() => {
    const useDisease = confirm("나의 질병 정보를 불러오시겠습니까?");
    if (!useDisease) {
      initChat("");
      return;
    }
    getUserDisease()
      .then((disease) => initChat(disease))
      .catch((err) => {
        console.error(err);
        initChat(""); // 질병 정보를 못 불러와도 대화는 시작한다
      });
  }, [initChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = chatInput.trim();
    setChatInput("");
    if (userInput) sendMessage(userInput);
  };

  return (
    <div className="chatbot-page" ref={pageRef}>
      <div className="chatbot-container">
        <ChatList />
        <div className="chat-input-area">
          <form onSubmit={handleSubmit}>
            <input
              placeholder="챗봇에게 보낼 메세지를 입력하세요."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            ></input>
            <button type="submit">
              <img src={arrowBtn} alt="제출 버튼 화살표" />
            </button>
          </form>
        </div>
        {isSaveModalOpen && <SaveModal />}
      </div>
    </div>
  );
}
