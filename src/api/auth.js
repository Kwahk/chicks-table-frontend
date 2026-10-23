import { api } from "./client";

// 로그인 성공 시 토큰과 아이디는 응답 헤더로 내려온다
export const login = async (username, password) => {
  const res = await api.post(
    "/login",
    { username, password },
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return { token: res.headers["token"], userId: res.headers["id"] };
};

export const join = (form) => api.post("/join", form);
