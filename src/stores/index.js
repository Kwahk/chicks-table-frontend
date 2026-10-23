import { create } from "zustand";
import { createAuthSlice } from "./authSlice";

// 도메인별 slice를 하나의 스토어로 합친다
// 사용: const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
export const useBoundStore = create((...a) => ({
  ...createAuthSlice(...a),
}));
