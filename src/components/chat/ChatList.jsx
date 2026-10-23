import Chat from "./Chat";
import LoadingChat from "./LoadingChat";
import { useBoundStore } from "@/stores";

// 대화 목록과 응답 대기 상태를 스토어에서 직접 읽어 props로 전달받지 않는다
// 자동 스크롤은 입력창까지 포함한 화면 전체를 아는 ChatbotPage에서 처리한다
export default function ChatList() {
  const chatList = useBoundStore((state) => state.chatList);
  const isResponding = useBoundStore((state) => state.isResponding);

  return (
    <div className="chat-list">
      {chatList.map((chat, idx) => {
        // 'prompt' 내용은 보여주지 않습니다.
        if (chat.role == "prompt") return;
        return <Chat key={idx} role={chat.role} content={chat.parts[0].text} />;
      })}
      {isResponding ? <LoadingChat /> : <></>}
    </div>
  );
}
