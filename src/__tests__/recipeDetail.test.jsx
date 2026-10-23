import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { loginAsTestUser, renderApp } from "@/test/renderApp";
import { requests } from "@/test/handlers";

const openDetail = (name) => {
  loginAsTestUser();
  return renderApp(`/recipe/${encodeURIComponent(name)}`);
};

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

  // 알려진 문제: MANUAL0${i}로 필드를 만들어 10단계부터 MANUAL010이 됨 (PR #4에서 수정)
  it.fails("조리 과정이 10단계를 넘어도 모두 보인다", async () => {
    openDetail("두부조림");

    expect(await screen.findByText("조림 12단계")).toBeInTheDocument();
  });

  // 알려진 문제: 이름 부분 일치 결과의 첫 번째를 사용함 (PR #4에서 수정)
  it.fails(
    "이름이 비슷한 레시피가 먼저 와도 누른 레시피를 보여준다",
    async () => {
      openDetail("두부조림");

      expect(
        await screen.findByText("두부 1모, 저염 간장 2큰술"),
      ).toBeInTheDocument();
    },
  );

  // 알려진 문제: 상세 페이지와 조리 방법이 같은 API를 각각 호출함 (PR #4에서 수정)
  it.fails("상세 페이지는 레시피 API를 한 번만 요청한다", async () => {
    openDetail("두부조림 정식");

    await screen.findByText("정식 1단계");
    expect(requests.recipe).toHaveLength(1);
  });
});
