import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "@/test/renderApp";
import { requests } from "@/test/handlers";

// 레시피 상세는 로그인 없이 볼 수 있다
const openDetail = (name) => renderApp(`/recipe/${encodeURIComponent(name)}`);

describe("레시피 상세", () => {
  it("재료와 영양 성분이 보인다", async () => {
    openDetail("두부조림 정식");

    expect(await screen.findByText("두부, 밥, 김치")).toBeInTheDocument();
    expect(screen.getByText("550 kcal")).toBeInTheDocument();
    expect(screen.getByText("70 g")).toBeInTheDocument();
  });

  it("조리 과정이 순서대로 보인다", async () => {
    openDetail("두부조림 정식");

    expect(await screen.findByText("정식 1단계")).toBeInTheDocument();
    expect(screen.getByText("정식 3단계")).toBeInTheDocument();
  });

  it("조리 과정이 10단계를 넘어도 모두 보인다", async () => {
    openDetail("두부조림");

    expect(await screen.findByText("조림 12단계")).toBeInTheDocument();
  });

  it("이름이 비슷한 레시피가 먼저 와도 누른 레시피를 보여준다", async () => {
    openDetail("두부조림");

    expect(
      await screen.findByText("두부 1모, 저염 간장 2큰술"),
    ).toBeInTheDocument();
  });

  it("상세 페이지는 레시피 API를 한 번만 요청한다", async () => {
    openDetail("두부조림 정식");

    await screen.findByText("정식 1단계");
    expect(requests.recipe).toHaveLength(1);
  });
});
