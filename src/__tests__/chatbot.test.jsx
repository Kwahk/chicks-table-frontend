import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { loginAsTestUser, renderApp } from "@/test/renderApp";
import { server } from "@/test/server";
import { API_URL } from "@/test/handlers";

const sendMessage = async (user, text) => {
  await user.type(
    await screen.findByPlaceholderText("챗봇에게 보낼 메세지를 입력하세요."),
    `${text}{Enter}`,
  );
};

describe("챗봇", () => {
  it("질병 정보를 불러오면 질병이 포함된 첫 질문이 보인다", async () => {
    loginAsTestUser();
    renderApp("/chatbot");

    expect(
      await screen.findByText(/나는 고혈압\(90\/140\)이\(가\) 있어/),
    ).toBeInTheDocument();
  });

  it("메시지를 보내면 챗봇 답변이 보인다", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    loginAsTestUser();
    const { user } = renderApp("/chatbot");

    await sendMessage(user, "두부 요리 추천해줘");

    expect(screen.getByText("두부 요리 추천해줘")).toBeInTheDocument();
    expect(
      await screen.findByText("두부 샐러드를 추천합니다."),
    ).toBeInTheDocument();
  });

  it("답변을 저장하면 저장한 레시피 목록에 추가된다", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    loginAsTestUser();
    const { user } = renderApp("/chatbot");

    await sendMessage(user, "두부 요리 추천해줘");
    await user.click(await screen.findByAltText("저장 버튼"));
    const modal = screen
      .getByRole("heading", { name: "내 레시피로 저장하기" })
      .closest(".chat-save-modal");
    await user.type(
      within(modal).getAllByRole("textbox")[0],
      "챗봇 추천 두부 샐러드",
    );
    await user.click(within(modal).getByRole("button", { name: "저장" }));

    expect(window.alert).toHaveBeenCalledWith("저장 성공!");
    await user.click(screen.getByAltText("Dropdown"));
    await user.click(screen.getByText("저장된 레시피"));
    expect(
      await screen.findByText("챗봇 추천 두부 샐러드"),
    ).toBeInTheDocument();
  });

  it("답변 요청이 실패해도 로딩 표시가 사라진다", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    vi.spyOn(console, "error").mockImplementation(() => {}); // 일부러 낸 오류 로그 숨김
    server.use(
      http.post(/generativelanguage/, async () => {
        await delay(200); // 로딩 표시가 보일 시간을 준다
        return new HttpResponse(null, { status: 500 });
      }),
    );
    loginAsTestUser();
    const { user } = renderApp("/chatbot");

    await sendMessage(user, "두부 요리 추천해줘");

    expect(await screen.findByText(/불러오는 중/)).toBeInTheDocument();
    await waitFor(
      () => expect(screen.queryByText(/불러오는 중/)).not.toBeInTheDocument(),
      { timeout: 1500 },
    );
  });

  // 수정 전에는 대화가 시작되지 않아 메시지를 보내면 "console.err is not a function" 오류가 났다
  it("질병 정보를 불러오지 못해도 대화할 수 있다", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // 일부러 낸 오류 로그 숨김
    server.use(
      http.get(
        `${API_URL}/user/:id`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    loginAsTestUser();
    const { user } = renderApp("/chatbot");

    await sendMessage(user, "두부 요리 추천해줘");

    expect(
      await screen.findByText("두부 샐러드를 추천합니다."),
    ).toBeInTheDocument();
  });
});
