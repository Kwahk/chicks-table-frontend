import { http, HttpResponse } from "msw";
import { db, recipeRows, TEST_USER_ID } from "./data";

export const API_URL = "http://api.test";
const RECIPE_URL =
  "http://openapi.foodsafetykorea.go.kr/api/:key/COOKRCP01/:type/:start/:end/:query";
const GEMINI_URL = /generativelanguage\.googleapis\.com/;

// 요청 기록. 테스트에서 "몇 번 요청했는지" 확인할 때 쓴다
export const requests = { recipe: [] };
export const resetRequests = () => {
  requests.recipe = [];
};

const escapeXml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// 공공 API는 주소의 :type 에 따라 xml 또는 json으로 응답한다
const recipeResponse = (type, rows) => {
  const result = rows.length
    ? { CODE: "INFO-000", MSG: "정상처리되었습니다." }
    : { CODE: "INFO-200", MSG: "해당하는 데이터가 없습니다." };

  if (type === "json") {
    return HttpResponse.json({
      COOKRCP01: {
        total_count: String(rows.length),
        ...(rows.length && { row: rows }),
        RESULT: result,
      },
    });
  }

  const rowXml = rows
    .map(
      (row) =>
        `<row>${Object.entries(row)
          .map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`)
          .join("")}</row>`,
    )
    .join("");
  return new HttpResponse(
    `<COOKRCP01><total_count>${rows.length}</total_count>${rowXml}<RESULT><MSG>${result.MSG}</MSG><CODE>${result.CODE}</CODE></RESULT></COOKRCP01>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};

// 챗봇 답변 (Gemini generateContent 응답 형식)
export const geminiReply = (text) =>
  HttpResponse.json({
    candidates: [
      { content: { role: "model", parts: [{ text }] }, finishReason: "STOP" },
    ],
  });

export const handlers = [
  // 공공 레시피 API
  http.get(RECIPE_URL, ({ params }) => {
    const keyword = decodeURIComponent(params.query).replace("RCP_NM=", "");
    requests.recipe.push(keyword);
    const matched = recipeRows
      .filter((row) => row.RCP_NM.includes(keyword))
      .slice(Number(params.start) - 1, Number(params.end));
    return recipeResponse(params.type, matched);
  }),

  // 로그인: 토큰과 아이디를 응답 헤더로 준다
  http.post(
    `${API_URL}/login`,
    () =>
      new HttpResponse(null, {
        headers: { token: "test-token", id: TEST_USER_ID },
      }),
  ),
  http.post(`${API_URL}/join`, () => new HttpResponse("ok", { status: 201 })),

  http.patch(`${API_URL}/user/password/:id`, () => HttpResponse.text("ok")),
  http.get(`${API_URL}/user/:id`, () => HttpResponse.json(db.user)),
  // 프로필 수정은 multipart: data 파트(JSON)와 file 파트(사진)
  http.patch(`${API_URL}/user/:id`, async ({ request }) => {
    const form = await request.formData();
    Object.assign(db.user, JSON.parse(await form.get("data").text()));
    return HttpResponse.json(db.user);
  }),

  http.get(`${API_URL}/scrap`, () =>
    HttpResponse.json({
      scraps: db.scraps.map(({ id, title }) => ({ id, title })),
    }),
  ),
  http.get(`${API_URL}/scrap/:id`, ({ params }) => {
    const scrap = db.scraps.find((s) => String(s.id) === params.id);
    return scrap
      ? HttpResponse.json(scrap)
      : new HttpResponse("not found", { status: 404 });
  }),
  http.post(`${API_URL}/scrap`, async ({ request }) => {
    const { title, contents } = await request.json();
    const scrap = { id: db.nextScrapId++, title, contents };
    db.scraps.push(scrap);
    return HttpResponse.json(scrap, { status: 201 });
  }),
  http.delete(`${API_URL}/scrap/:id`, ({ params }) => {
    db.scraps = db.scraps.filter((s) => String(s.id) !== params.id);
    return HttpResponse.text("ok");
  }),

  // 챗봇 (Google Gemini)
  http.post(GEMINI_URL, () =>
    geminiReply("## 추천 레시피\n두부 샐러드를 추천합니다."),
  ),
];
