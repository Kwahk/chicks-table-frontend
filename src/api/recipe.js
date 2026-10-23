import axios from "axios";

// 식품안전나라 조리식품 레시피 DB(COOKRCP01) 공공 API
const API_KEY = import.meta.env.VITE_FOOD_API_KEY;

export const recipeApi = axios.create({
  baseURL: `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json`,
});

const SUCCESS = "INFO-000";
const NO_DATA = "INFO-200";
const MAX_STEPS = 20;

// 공공 API는 실패해도 HTTP 200으로 응답하므로 RESULT.CODE로 성공 여부를 판단한다
const getRows = (data) => {
  const body = data.COOKRCP01 ?? data;
  const { CODE, MSG } = body.RESULT ?? {};
  if (CODE === NO_DATA) return [];
  if (CODE !== SUCCESS) throw new Error(`레시피 API 오류 (${CODE}): ${MSG}`);
  return body.row ?? [];
};

// API 응답(대문자 필드)을 화면에서 쓰는 형태로 변환
const toRecipeSummary = (row) => ({
  id: row.RCP_SEQ,
  name: row.RCP_NM,
  category: row.RCP_PAT2,
  thumbnail: row.ATT_FILE_NO_MAIN,
});

const toRecipeDetail = (row) => ({
  ...toRecipeSummary(row),
  image: row.ATT_FILE_NO_MK,
  ingredients: row.RCP_PARTS_DTLS,
  nutrition: {
    calories: row.INFO_ENG || "N/A",
    carbs: row.INFO_CAR || "N/A",
    protein: row.INFO_PRO || "N/A",
    fat: row.INFO_FAT || "N/A",
  },
  // 조리 과정은 MANUAL01 ~ MANUAL20 필드에 나뉘어 있다
  steps: Array.from({ length: MAX_STEPS }, (_, i) => {
    const no = String(i + 1).padStart(2, "0");
    return {
      order: i + 1,
      text: row[`MANUAL${no}`],
      image: row[`MANUAL_IMG${no}`],
    };
  }).filter((step) => step.text),
});

// 공공 API는 검색어에 띄어쓰기가 있으면 결과를 주지 않는다
// 가장 긴 단어 하나로 요청하고, 나머지 단어는 받아온 결과에서 거른다
const fetchRowsByName = async (text, count) => {
  const words = text.trim().split(/\s+/);
  const keyword = words.reduce((a, b) => (b.length > a.length ? b : a));
  const res = await recipeApi.get(
    `/1/${count}/RCP_NM=${encodeURIComponent(keyword)}`,
  );
  return getRows(res.data).filter((row) =>
    words.every((word) => row.RCP_NM.includes(word)),
  );
};

export const searchRecipes = (keyword) =>
  fetchRowsByName(keyword, 100).then((rows) => rows.map(toRecipeSummary));

// 이름 검색은 부분 일치라 비슷한 이름이 먼저 올 수 있어 정확히 같은 이름을 우선한다
export const getRecipeDetail = (name) =>
  fetchRowsByName(name, 100).then((rows) => {
    const row = rows.find((r) => r.RCP_NM === name) ?? rows[0];
    return row ? toRecipeDetail(row) : null;
  });
