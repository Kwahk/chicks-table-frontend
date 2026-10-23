import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import { authStorage } from "@/common/authStorage";
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

export const loginAsTestUser = () =>
  authStorage.save("test-token", TEST_USER_ID);
