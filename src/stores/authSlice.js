import { authStorage } from "@/common/authStorage";

// 로그인 상태. localStorage는 새로고침 후 복원용으로만 쓰고, 화면은 이 상태를 구독한다
export const createAuthSlice = (set) => ({
  isLoggedIn: authStorage.isLoggedIn(),
  userId: authStorage.getUserId(),

  login: (token, userId) => {
    authStorage.save(token, userId);
    set({ isLoggedIn: true, userId });
  },

  logout: () => {
    authStorage.clear();
    set({ isLoggedIn: false, userId: null });
  },
});
