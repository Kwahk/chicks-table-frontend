import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { loginAsTestUser, renderApp } from "@/test/renderApp";

const openMenu = async (user) => user.click(screen.getByAltText("Dropdown"));

describe("로그인 상태", () => {
  it("로그인하지 않았으면 레시피 검색을 누를 때 로그인 페이지로 이동한다", async () => {
    const { user } = renderApp("/");

    await user.click(screen.getByText("레시피 검색"));

    expect(window.alert).toHaveBeenCalledWith("로그인이 필요합니다.");
    expect(window.location.pathname).toBe("/login");
  });

  it("로그인하면 새로고침 없이 헤더 메뉴가 바뀐다", async () => {
    const { user } = renderApp("/login");

    await user.type(screen.getByPlaceholderText("아이디"), "chick");
    await user.type(screen.getByPlaceholderText("비밀번호"), "password");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(window.location.pathname).toBe("/");
    await openMenu(user);
    expect(await screen.findByText("마이페이지")).toBeInTheDocument();
  });

  it("로그아웃하면 헤더 메뉴가 로그인, 회원가입으로 바뀐다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/");

    await openMenu(user);
    await user.click(await screen.findByText("로그아웃"));
    await openMenu(user);

    expect(await screen.findByText("회원가입")).toBeInTheDocument();
    expect(screen.queryByText("마이페이지")).not.toBeInTheDocument();
  });
});
