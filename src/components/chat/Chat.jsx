import { useState } from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import { useBoundStore } from "@/stores";

import bookmark from "@/assets/images/bookmark.svg";
import bookmark_f from "@/assets/images/bookmark_filled.svg";
import "./chats.css";

export default function Chat({ role, content }) {
  const [hover, setHover] = useState(false);
  const openSaveModal = useBoundStore((state) => state.openSaveModal);

  return (
    <div className={`chat-container ${role === "model" ? "model" : "user"}`}>
      <div className={`bubble ${role === "model" ? "model" : "user"}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {role === "model" ? (
        <div className="save-btn">
          <img
            src={hover ? bookmark_f : bookmark}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            onClick={() => openSaveModal(content)}
            alt="저장 버튼"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
Chat.propTypes = {
  role: PropTypes.string,
  content: PropTypes.string,
};
