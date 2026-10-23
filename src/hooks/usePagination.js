import { useMemo } from "react";

// 전체 목록을 페이지 단위로 나눈다
// items, currentPage, perPage가 그대로면 이전 결과(같은 배열 참조)를 재사용한다
export const usePagination = (items, currentPage, perPage) =>
  useMemo(() => {
    const totalPages = Math.ceil(items.length / perPage);
    const start = (currentPage - 1) * perPage;
    return { pageItems: items.slice(start, start + perPage), totalPages };
  }, [items, currentPage, perPage]);
