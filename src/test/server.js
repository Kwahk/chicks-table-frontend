import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 테스트 중 나가는 모든 요청을 네트워크 단계에서 가로챈다
export const server = setupServer(...handlers);
