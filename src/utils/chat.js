import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const MODEL = "gemini-3.1-flash-lite";

let chat;

// 이전 대화(history)를 이어받아 새 채팅 세션을 만든다
export const startChat = (history = []) => {
  chat = ai.chats.create({ model: MODEL, history });
};

// 메시지를 보내고 답변 텍스트를 돌려준다. 실패하면 오류를 던져 호출한 쪽에서 처리한다
export const getModelResponse = async (message) => {
  const response = await chat.sendMessage({ message });
  return response.text;
};
