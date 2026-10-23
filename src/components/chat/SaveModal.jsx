import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/stores";

import "./SaveModal.css";
import cancel from "@/assets/images/cancel.svg";
import { useCreateScrap } from "@/hooks/scrap";

export default function SaveModal() {
  const { content, closeSaveModal } = useBoundStore(
    useShallow((state) => ({
      content: state.saveModal.content,
      closeSaveModal: state.closeSaveModal,
    })),
  );
  // 제목, 내용 입력값은 이 모달 안에서만 쓰므로 지역 상태로 둔다
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState(content);
  const { mutate: saveScrap, isPending } = useCreateScrap();
  const handleSubmit = (e) => {
    e.preventDefault();
    saveScrap(
      { title: titleInput.slice(0, 30), contents: contentInput },
      {
        onSuccess: () => {
          alert("저장 성공!");
          closeSaveModal();
        },
        onError: (err) => {
          console.error(err);
          alert("저장에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div className="chat-save-modal-back">
      <div className="chat-save-modal">
        <div className="close btn-container">
          <button onClick={closeSaveModal}>
            <img src={cancel} alt="취소 버튼" />
          </button>
        </div>
        <h2 className="chat-save-title">내 레시피로 저장하기</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="title">
            <label className="title-name">제목:</label>
            <input
              className="title-input"
              type="text"
              value={titleInput}
              onChange={(e) => {
                setTitleInput(e.target.value);
              }}
            ></input>
          </div>
          <div className="save-modal-content">
            <textarea
              value={contentInput}
              onChange={(e) => {
                setContentInput(e.target.value);
              }}
            ></textarea>
          </div>
          <div className="save-btn-container">
            <button type="submit" className="save-btn" disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
