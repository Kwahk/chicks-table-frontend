import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import axios from "axios";
import { Blob as NodeBlob, File as NodeFile } from "node:buffer";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "./server";
import { resetDb } from "./data";
import { resetRequests } from "./handlers";
import { useBoundStore } from "@/stores";

// jsdom의 Blob, FormData로 만든 multipart 요청(프로필 수정)은 MSW로 가로챌 때 응답이 오지 않는다
// 테스트에서만 Node 기본 Blob, File, FormData와 fetch를 쓰도록 바꾼다
const NodeFormData = (
  await new Response("", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).formData()
).constructor;
globalThis.Blob = NodeBlob;
globalThis.File = NodeFile;
globalThis.FormData = NodeFormData;
axios.defaults.adapter = "fetch"; // axios 1.7+ 기본 제공 adapter

// 처리하지 않은 요청이 있으면 테스트를 실패시켜 빠뜨린 API를 바로 알 수 있게 한다
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

beforeEach(() => {
  // jsdom에 없거나 테스트에서 띄우면 안 되는 브라우저 기능
  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(window, "confirm").mockReturnValue(true);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetDb();
  resetRequests();
  localStorage.clear();
  // 스토어는 앱 전체에서 하나라 테스트끼리 상태가 섞이지 않게 처음 상태로 되돌린다
  useBoundStore.setState(useBoundStore.getInitialState(), true);
  vi.restoreAllMocks();
});

afterAll(() => server.close());
