import { getModelResponse, startChat } from "@/utils/chat";

const buildInitialChat = (disease) => {
  const diseasePrompt = disease
    ? `The recipe must suitable with my health status. This is my disease list in korean, '${disease}'. `
    : "";
  const promptToShow = disease
    ? `나의 건강상태에 맞는 요리 레시피를 추천해줘. 나는 ${disease}이(가) 있어.`
    : "요리 레시피를 추천해줘.";
  return [
    // prompt: 모델에게만 보내는 지시문, promptToShow: 화면에만 보여주는 문장
    {
      role: "prompt",
      parts: [
        {
          text: `Recommend me the cuisine recipe that I ask you. ${diseasePrompt}All of your response must be in korean.`,
        },
      ],
    },
    { role: "promptToShow", parts: [{ text: promptToShow }] },
  ];
};

// 챗봇 대화와 저장 모달 상태
export const createChatSlice = (set, get) => ({
  chatList: [],
  isResponding: false,
  saveModal: { isOpen: false, content: "" },

  // 질병 정보(없으면 빈 문자열)로 새 대화를 시작한다
  initChat: (disease) => {
    const initialChatList = buildInitialChat(disease);
    set({ chatList: initialChatList, isResponding: false });
    startChat(
      initialChatList
        .filter((chat) => chat.role !== "promptToShow")
        .map((chat) => ({ ...chat, role: "user" })),
    );
  },

  addChat: (role, text) =>
    set((state) => ({
      chatList: [...state.chatList, { role, parts: [{ text }] }],
    })),

  sendMessage: async (text) => {
    get().addChat("user", text);
    set({ isResponding: true });
    try {
      const response = await getModelResponse(text);
      if (response) get().addChat("model", response);
    } catch (error) {
      console.error(error);
    } finally {
      set({ isResponding: false });
    }
  },

  openSaveModal: (content) => set({ saveModal: { isOpen: true, content } }),
  closeSaveModal: () => set({ saveModal: { isOpen: false, content: "" } }),
});
