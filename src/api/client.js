import axios from "axios";
import { authStorage } from "@/common/authStorage";

// 백엔드 요청은 모두 이 인스턴스를 사용한다
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 로그인 토큰이 있으면 모든 요청에 자동으로 붙인다
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
