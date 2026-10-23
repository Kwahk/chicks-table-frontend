import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import { useBoundStore } from "@/stores";
import { TEST_USER_ID } from "./data";

// 테스트마다 새 캐시를 쓰고, 실패한 요청은 다시 시도하지 않는다
const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

// 실제 앱 전체를 원하는 주소에서 띄운다 (라우터, 헤더 포함)
export const renderApp = (route = "/") => {
  window.history.pushState({}, "", route);
  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={createTestQueryClient()}>
        <App />
      </QueryClientProvider>,
    ),
  };
};

// 실제 로그인과 같은 경로(스토어의 login 액션)로 로그인 상태를 만든다
export const loginAsTestUser = () =>
  useBoundStore.getState().login("test-token", TEST_USER_ID);
