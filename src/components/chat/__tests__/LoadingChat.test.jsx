import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import LoadingChat from "@/components/chat/LoadingChat";

describe("LoadingChat", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("1초마다 점 개수가 바뀐다", () => {
    render(<LoadingChat />);
    expect(screen.getByText("불러오는 중..")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("불러오는 중...")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText("불러오는 중....")).toBeInTheDocument();
  });

  it("화면에서 사라지면 타이머도 정리된다", () => {
    const { unmount } = render(<LoadingChat />);
    act(() => vi.advanceTimersByTime(1000));

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
