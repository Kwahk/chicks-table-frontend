import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { requests } from "@/test/handlers";
import { getRecipeDetail, searchRecipes } from "@/api/recipe";

describe("api/recipe", () => {
  it("검색 결과를 화면용 모델로 바꿔 돌려준다", async () => {
    const recipes = await searchRecipes("두부조림");

    expect(recipes).toEqual([
      { id: "1", name: "두부조림 정식", category: "일품", thumbnail: "" },
      { id: "2", name: "두부조림", category: "반찬", thumbnail: "" },
    ]);
  });

  it("검색 결과가 없으면(INFO-200) 빈 배열을 돌려준다", async () => {
    expect(await searchRecipes("없는음식")).toEqual([]);
  });

  it("상세 조회는 조리 과정을 순서대로 steps 배열로 만든다", async () => {
    const recipe = await getRecipeDetail("두부조림");

    expect(recipe.steps).toHaveLength(12);
    expect(recipe.steps[11]).toEqual({
      order: 12,
      text: "조림 12단계",
      image: undefined,
    });
    expect(recipe.nutrition).toEqual({
      calories: "180",
      carbs: "8",
      protein: "14",
      fat: "10",
    });
  });

  // 공공 API는 검색어에 띄어쓰기가 있으면 결과를 주지 않는다
  it("이름에 띄어쓰기가 있어도 상세 조회할 수 있다", async () => {
    const recipe = await getRecipeDetail("두부조림 정식");

    expect(recipe.name).toBe("두부조림 정식");
    expect(requests.recipe).toEqual(["두부조림"]); // 가장 긴 단어로만 요청
  });

  it("띄어쓰기가 있는 검색어는 모든 단어가 들어간 레시피만 돌려준다", async () => {
    const recipes = await searchRecipes("두부 정식");

    expect(recipes.map((recipe) => recipe.name)).toEqual(["두부조림 정식"]);
  });

  it("없는 레시피를 조회하면 null을 돌려준다", async () => {
    expect(await getRecipeDetail("없는음식")).toBeNull();
  });

  it("인증키 만료처럼 공공 API가 오류 코드를 주면 에러를 던진다", async () => {
    // 공공 API는 오류여도 HTTP 200으로 응답한다
    server.use(
      http.get(/openapi\.foodsafetykorea\.go\.kr/, () =>
        HttpResponse.json({
          RESULT: { CODE: "INFO-600", MSG: "인증키가 만료되었습니다." },
        }),
      ),
    );

    await expect(searchRecipes("두부")).rejects.toThrow("INFO-600");
  });
});
