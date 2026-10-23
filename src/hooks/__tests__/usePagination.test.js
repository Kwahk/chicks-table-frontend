import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

const items = Array.from({ length: 19 }, (_, i) => i + 1);

describe("usePagination", () => {
  it("현재 페이지에 해당하는 항목과 전체 페이지 수를 돌려준다", () => {
    const { result } = renderHook(() => usePagination(items, 2, 8));

    expect(result.current.pageItems).toEqual([9, 10, 11, 12, 13, 14, 15, 16]);
    expect(result.current.totalPages).toBe(3);
  });

  it("마지막 페이지는 남은 항목만 돌려준다", () => {
    const { result } = renderHook(() => usePagination(items, 3, 8));

    expect(result.current.pageItems).toEqual([17, 18, 19]);
  });

  it("항목이 없으면 페이지가 0개다", () => {
    const { result } = renderHook(() => usePagination([], 1, 8));

    expect(result.current).toEqual({ pageItems: [], totalPages: 0 });
  });

  // memo된 목록 컴포넌트가 다시 그려지지 않으려면 같은 배열 참조를 받아야 한다
  it("입력이 그대로면 다시 렌더링되어도 같은 배열을 돌려준다 (useMemo)", () => {
    const { result, rerender } = renderHook(() => usePagination(items, 1, 8));
    const first = result.current.pageItems;

    rerender();

    expect(result.current.pageItems).toBe(first);
  });
});
