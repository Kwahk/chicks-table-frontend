import axios, { AxiosError } from "axios";

// .env 에 VITE_USE_MOCK=true 이면 백엔드 없이 더미 데이터로 동작
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const DB_KEY = "mock_db";
const MOCK_USERNAME = "chick";

const initialDb = () => ({
  user: {
    id: MOCK_USERNAME,
    email: "chick@example.com",
    nickname: "병아리",
    profilePath: "",
    diseases: [
      { name: "고혈압", contents: "90/140" },
      { name: "알레르기", contents: "땅콩" },
    ],
  },
  scraps: [
    {
      id: 1,
      title: "저염 두부 채소 볶음",
      contents:
        "## 저염 두부 채소 볶음\n\n**재료**: 두부 1모, 애호박 1/2개, 양파 1/2개, 저염 간장 1큰술\n\n1. 두부는 물기를 빼고 깍둑썰기 합니다.\n2. 채소를 한입 크기로 썹니다.\n3. 팬에 두부를 노릇하게 굽고 채소를 넣어 볶습니다.\n4. 저염 간장으로 간을 맞춥니다.",
    },
    {
      id: 2,
      title: "현미 닭가슴살 샐러드",
      contents:
        "## 현미 닭가슴살 샐러드\n\n**재료**: 닭가슴살 100g, 현미밥 1/2공기, 양상추, 방울토마토, 올리브유\n\n1. 닭가슴살을 삶아 결대로 찢습니다.\n2. 채소를 씻어 먹기 좋게 자릅니다.\n3. 현미밥과 함께 담고 올리브유를 뿌립니다.",
    },
  ],
  nextScrapId: 3,
});

// 새로고침해도 저장한 레시피가 남도록 localStorage 에 보관
const loadDb = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DB_KEY));
    if (saved && saved.user && Array.isArray(saved.scraps)) return saved;
  } catch {
    // 저장된 값이 깨졌으면 초기 데이터 사용
  }
  return initialDb();
};

let db = loadDb();

const saveDb = () => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // 저장 공간 부족 등은 무시 (메모리에는 남아 있음)
  }
};

// axios 요청 body 를 객체로 변환 (JSON 문자열, 객체, FormData 모두 처리)
const parseBody = async (data) => {
  if (!data) return {};
  if (data instanceof FormData) {
    const result = {};
    for (const [key, value] of data.entries()) {
      if (key === "data" && value instanceof Blob) {
        Object.assign(result, JSON.parse(await value.text()));
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
};

const routes = [
  {
    method: "post",
    path: /\/login$/,
    handler: () => ({ headers: { token: "mock-token", id: MOCK_USERNAME } }),
  },
  {
    method: "post",
    path: /\/join$/,
    handler: () => ({ status: 201, data: "회원가입 성공" }),
  },
  {
    method: "patch",
    path: /\/user\/password\/[^/]+$/,
    handler: () => ({ data: "비밀번호 변경 성공" }),
  },
  {
    method: "get",
    path: /\/user\/[^/]+$/,
    handler: () => ({ data: db.user }),
  },
  {
    method: "patch",
    path: /\/user\/[^/]+$/,
    handler: ({ body }) => {
      if (body.nickname !== undefined) db.user.nickname = body.nickname;
      if (Array.isArray(body.diseases)) db.user.diseases = body.diseases;
      if (body.file instanceof Blob)
        db.user.profilePath = URL.createObjectURL(body.file);
      saveDb();
      return { data: db.user };
    },
  },
  {
    method: "get",
    path: /\/scrap$/,
    handler: () => ({
      data: { scraps: db.scraps.map(({ id, title }) => ({ id, title })) },
    }),
  },
  {
    method: "get",
    path: /\/scrap\/[^/]+$/,
    handler: ({ id }) => {
      const scrap = db.scraps.find((s) => String(s.id) === id);
      return scrap
        ? { data: scrap }
        : { status: 404, data: "레시피를 찾을 수 없습니다." };
    },
  },
  {
    method: "post",
    path: /\/scrap$/,
    handler: ({ body }) => {
      const scrap = {
        id: db.nextScrapId++,
        title: body.title,
        contents: body.contents,
      };
      db.scraps.push(scrap);
      saveDb();
      return { status: 201, data: scrap };
    },
  },
  {
    method: "delete",
    path: /\/scrap\/[^/]+$/,
    handler: ({ id }) => {
      db.scraps = db.scraps.filter((s) => String(s.id) !== id);
      saveDb();
      return { data: "삭제 성공" };
    },
  },
];

const mockAdapter = async (config) => {
  const method = (config.method || "get").toLowerCase();
  const path = new URL(config.url, window.location.origin).pathname;
  const route = routes.find((r) => r.method === method && r.path.test(path));

  let result = {
    status: 404,
    data: `mock 에 없는 API 입니다: ${method.toUpperCase()} ${path}`,
  };
  if (route) {
    const body = await parseBody(config.data);
    const id = decodeURIComponent(path.split("/").pop());
    result = {
      status: 200,
      data: {},
      headers: {},
      ...route.handler({ body, id }),
    };
  }

  const response = {
    data: result.data,
    status: result.status,
    statusText: result.status < 400 ? "OK" : "Error",
    headers: result.headers || {},
    config,
    request: {},
  };
  console.log(
    "[MOCK]",
    method.toUpperCase(),
    path,
    response.status,
    response.data,
  );

  if (result.status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${result.status}`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    );
  }
  return response;
};

if (USE_MOCK) {
  // 로그인 없이 바로 쓸 수 있게 로그인 상태로 시작
  localStorage.setItem("access_token", "mock-token");
  localStorage.setItem("username", MOCK_USERNAME);
  axios.defaults.adapter = mockAdapter;
  console.info(
    "[MOCK] mock 모드로 실행 중입니다. 백엔드 요청은 더미 데이터로 응답합니다.",
  );
}
