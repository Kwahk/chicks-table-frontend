import { useQuery } from "@tanstack/react-query";
import { getRecipeDetail, searchRecipes } from "@/api/recipe";

// 캐시 키를 한곳에서 관리해 오타와 중복을 막는다
export const recipeKeys = {
  all: ["recipes"],
  search: (keyword) => [...recipeKeys.all, "search", keyword],
  detail: (name) => [...recipeKeys.all, "detail", name],
};

// 검색어가 있을 때만 요청한다
export const useRecipeSearch = (keyword) =>
  useQuery({
    queryKey: recipeKeys.search(keyword),
    queryFn: () => searchRecipes(keyword),
    enabled: !!keyword,
  });

export const useRecipeDetail = (name) =>
  useQuery({
    queryKey: recipeKeys.detail(name),
    queryFn: () => getRecipeDetail(name),
    enabled: !!name,
  });
