// 로그인 정보(localStorage) 접근은 이 파일을 통해서만 한다
const TOKEN_KEY = "access_token";
const USER_ID_KEY = "userId";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUserId: () => localStorage.getItem(USER_ID_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  save: (token, userId) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};
