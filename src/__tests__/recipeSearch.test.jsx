import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { renderApp } from "@/test/renderApp";
import { server } from "@/test/server";

const search = async (user, keyword) => {
  await user.type(
    screen.getByPlaceholderText("레시피 검색"),
    `${keyword}{Enter}`,
  );
};

describe("레시피 검색", () => {
  it("검색어를 입력하고 Enter를 누르면 레시피 카드가 보인다", async () => {
    const { user } = renderApp("/recipesearch");

    await search(user, "두부");

    expect(await screen.findByText("두부조림")).toBeInTheDocument();
    expect(screen.getByText("두부조림 정식")).toBeInTheDocument();
  });

  it("검색 결과가 없으면 안내 문구가 보인다", async () => {
    const { user } = renderApp("/recipesearch");

    await search(user, "없는음식");

    expect(
      await screen.findByText("검색 결과가 없습니다."),
    ).toBeInTheDocument();
  });

  it("결과가 8개를 넘으면 페이지 버튼으로 다음 페이지를 볼 수 있다", async () => {
    const { user } = renderApp("/recipesearch");

    await search(user, "샐러드");
    expect(await screen.findByText("채소 샐러드 1")).toBeInTheDocument();
    expect(screen.queryByText("채소 샐러드 9")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(await screen.findByText("채소 샐러드 9")).toBeInTheDocument();
    expect(screen.queryByText("채소 샐러드 1")).not.toBeInTheDocument();
  });

  it("카드를 누르면 상세 페이지로 이동한다", async () => {
    const { user } = renderApp("/recipesearch");

    await search(user, "두부");
    await user.click(await screen.findByText("두부조림"));

    expect(await screen.findByText("재료 정보")).toBeInTheDocument();
    expect(window.location.pathname).toBe(
      `/recipe/${encodeURIComponent("두부조림")}`,
    );
  });

  it("상세 페이지에서 뒤로 가도 검색 결과가 유지된다", async () => {
    const { user } = renderApp("/recipesearch");

    await search(user, "샐러드");
    await user.click(await screen.findByText("채소 샐러드 2"));
    await screen.findByText("재료 정보");
    window.history.back();

    await waitFor(() => expect(window.location.pathname).toBe("/recipesearch"));
    expect(await screen.findByText("채소 샐러드 3")).toBeInTheDocument();
  });

  it("검색어와 페이지가 주소에 남아 새로고침해도 유지된다", async () => {
    renderApp("/recipesearch?q=샐러드&page=2");

    expect(await screen.findByText("채소 샐러드 9")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("레시피 검색")).toHaveValue("샐러드");
  });

  it("공공 API가 오류를 주면 다시 시도 버튼이 보이고, 누르면 다시 불러온다", async () => {
    server.use(
      http.get(
        /openapi\.foodsafetykorea\.go\.kr/,
        () =>
          HttpResponse.json({
            RESULT: { CODE: "INFO-600", MSG: "인증키가 만료되었습니다." },
          }),
        { once: true },
      ),
    );
    const { user } = renderApp("/recipesearch?q=두부");

    expect(
      await screen.findByText(/레시피를 불러오지 못했습니다/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("두부조림")).toBeInTheDocument();
  });
});
