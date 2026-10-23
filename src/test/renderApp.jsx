import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { authStorage } from "@/common/authStorage";
import { TEST_USER_ID } from "./data";

// 실제 앱 전체를 원하는 주소에서 띄운다 (라우터, 헤더 포함)
export const renderApp = (route = "/") => {
  window.history.pushState({}, "", route);
  return { user: userEvent.setup(), ...render(<App />) };
};

export const loginAsTestUser = () =>
  authStorage.save("test-token", TEST_USER_ID);
