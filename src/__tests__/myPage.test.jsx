import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { loginAsTestUser, renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

describe("마이페이지", () => {
  it("로그인한 사용자 정보가 보인다", async () => {
    loginAsTestUser();
    renderApp("/mypage");

    expect(await screen.findByText("chick@example.com")).toBeInTheDocument();
    expect(screen.getByText("병아리")).toBeInTheDocument();
    expect(screen.getByText(/고혈압/)).toBeInTheDocument();
  });

  it("정보 수정에서 닉네임을 바꾸면 마이페이지에 반영된다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/mypage");

    await user.click(await screen.findByAltText("Edit"));
    const nicknameInput = await screen.findByDisplayValue("병아리");
    await user.clear(nicknameInput);
    await user.type(nicknameInput, "새병아리");
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("새병아리")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/mypage");
  });

  it("헤더와 마이페이지가 같은 사용자 정보를 쓰지만 요청은 한 번만 보낸다", async () => {
    let userRequests = 0;
    server.events.on("request:start", ({ request }) => {
      if (new URL(request.url).pathname.startsWith("/user/")) userRequests += 1;
    });
    loginAsTestUser();
    renderApp("/mypage");

    await screen.findByText("chick@example.com");
    expect(userRequests).toBe(1);
  });
});
