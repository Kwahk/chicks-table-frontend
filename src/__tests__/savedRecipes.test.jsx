import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { loginAsTestUser, renderApp } from "@/test/renderApp";

describe("저장한 레시피", () => {
  it("목록에서 레시피를 누르면 내용이 보인다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/saved-recipes");

    await user.click(await screen.findByText("저장한 두부 요리"));

    expect(await screen.findByText("두부를 굽습니다.")).toBeInTheDocument();
  });

  it("삭제하면 목록에서 사라진다", async () => {
    loginAsTestUser();
    const { user } = renderApp("/saved-recipes");

    await screen.findByText("저장한 두부 요리");
    await user.click(screen.getAllByAltText("x 아이콘")[0]);

    await waitFor(() =>
      expect(screen.queryByText("저장한 두부 요리")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("저장한 샐러드")).toBeInTheDocument();
  });
});
