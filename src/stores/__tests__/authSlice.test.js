import { describe, expect, it } from "vitest";
import { useBoundStore } from "@/stores";
import { authStorage } from "@/common/authStorage";

describe("auth slice", () => {
  it("login은 상태와 localStorage를 함께 갱신한다", () => {
    useBoundStore.getState().login("token-1", "chick");

    expect(useBoundStore.getState()).toMatchObject({
      isLoggedIn: true,
      userId: "chick",
    });
    expect(authStorage.getToken()).toBe("token-1");
    expect(authStorage.getUserId()).toBe("chick");
  });

  it("logout은 상태와 localStorage를 함께 비운다", () => {
    useBoundStore.getState().login("token-1", "chick");

    useBoundStore.getState().logout();

    expect(useBoundStore.getState()).toMatchObject({
      isLoggedIn: false,
      userId: null,
    });
    expect(authStorage.isLoggedIn()).toBe(false);
  });
});
