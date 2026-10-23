import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { loginAsTestUser, renderApp } from "@/test/renderApp";

const search = async (user, keyword) => {
  await user.type(
    screen.getByPlaceholderText("레시피 검색"),
    `${keyword}{Enter}`,
  );
};

describe("레시피 검색", () => {
  it("검색어를 입력하고 Enter를 누르면 레시피 카드가 보인다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/recipesearch");

    await search(user, "두부");

    expect(await screen.findByText("두부조림")).toBeInTheDocument();
    expect(screen.getByText("두부조림 정식")).toBeInTheDocument();
  });

  it("검색 결과가 없으면 안내 문구가 보인다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/recipesearch");

    await search(user, "없는음식");

    expect(
      await screen.findByText("검색 결과가 없습니다."),
    ).toBeInTheDocument();
  });

  it("결과가 8개를 넘으면 페이지 버튼으로 다음 페이지를 볼 수 있다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/recipesearch");

    await search(user, "샐러드");
    expect(await screen.findByText("채소 샐러드 1")).toBeInTheDocument();
    expect(screen.queryByText("채소 샐러드 9")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(await screen.findByText("채소 샐러드 9")).toBeInTheDocument();
    expect(screen.queryByText("채소 샐러드 1")).not.toBeInTheDocument();
  });

  it("카드를 누르면 상세 페이지로 이동한다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/recipesearch");

    await search(user, "두부");
    await user.click(await screen.findByText("두부조림"));

    expect(await screen.findByText("재료 정보")).toBeInTheDocument();
    expect(window.location.pathname).toBe(
      `/recipe/${encodeURIComponent("두부조림")}`,
    );
  });

  // 알려진 문제: 검색 결과가 컴포넌트 state에만 있어 뒤로 가면 사라진다 (PR #5에서 수정)
  it.fails("상세 페이지에서 뒤로 가도 검색 결과가 유지된다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/recipesearch");

    await search(user, "샐러드");
    await user.click(await screen.findByText("채소 샐러드 2"));
    await screen.findByText("재료 정보");
    window.history.back();

    await waitFor(() => expect(window.location.pathname).toBe("/recipesearch"));
    expect(await screen.findByText("채소 샐러드 3")).toBeInTheDocument();
  });
});
