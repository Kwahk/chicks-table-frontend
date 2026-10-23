const MODEL = "gemini-3.1-flash-lite";

// SDK 용량이 커서 앱 첫 화면에 포함하지 않고, 챗봇을 처음 시작할 때 따로 내려받는다
let clientPromise;
const getClient = () => {
  clientPromise ??= import("@google/genai").then(
    ({ GoogleGenAI }) =>
      new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY }),
  );
  return clientPromise;
};

let chatPromise;

// 이전 대화(history)를 이어받아 새 채팅 세션을 만든다
export const startChat = (history = []) => {
  chatPromise = getClient().then((ai) =>
    ai.chats.create({ model: MODEL, history }),
  );
};

// 메시지를 보내고 답변 텍스트를 돌려준다. 실패하면 오류를 던져 호출한 쪽에서 처리한다
export const getModelResponse = async (message) => {
  const chat = await chatPromise;
  const response = await chat.sendMessage({ message });
  return response.text;
};
