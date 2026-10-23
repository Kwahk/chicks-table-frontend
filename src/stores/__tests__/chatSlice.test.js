import { describe, expect, it } from "vitest";
import { useBoundStore } from "@/stores";

const store = () => useBoundStore.getState();
const visibleTexts = () =>
  store()
    .chatList.filter((chat) => chat.role !== "prompt")
    .map((chat) => chat.parts[0].text);

describe("chat slice", () => {
  it("initChat은 질병 정보가 있으면 질병이 포함된 첫 질문으로 대화를 시작한다", () => {
    store().initChat("고혈압(90/140)");

    expect(visibleTexts()).toEqual([
      "나의 건강상태에 맞는 요리 레시피를 추천해줘. 나는 고혈압(90/140)이(가) 있어.",
    ]);
    expect(store().chatList[0].parts[0].text).toContain("고혈압(90/140)");
  });

  it("initChat은 질병 정보가 없으면 기본 질문으로 시작한다", () => {
    store().initChat("");

    expect(visibleTexts()).toEqual(["요리 레시피를 추천해줘."]);
  });

  it("sendMessage는 내 메시지와 챗봇 답변을 차례로 추가하고 응답 대기를 끝낸다", async () => {
    store().initChat("");

    const sending = store().sendMessage("두부 요리 추천해줘");
    expect(store().isResponding).toBe(true);
    await sending;

    expect(visibleTexts().slice(1)).toEqual([
      "두부 요리 추천해줘",
      "## 추천 레시피\n두부 샐러드를 추천합니다.",
    ]);
    expect(store().isResponding).toBe(false);
  });

  it("저장 모달은 내용과 함께 열리고, 닫으면 내용이 비워진다", () => {
    store().openSaveModal("저장할 답변");
    expect(store().saveModal).toEqual({ isOpen: true, content: "저장할 답변" });

    store().closeSaveModal();
    expect(store().saveModal).toEqual({ isOpen: false, content: "" });
  });
});
