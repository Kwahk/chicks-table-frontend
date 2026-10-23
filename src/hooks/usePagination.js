// 전체 목록을 페이지 단위로 나눈다
export const usePagination = (items, currentPage, perPage) => {
  const totalPages = Math.ceil(items.length / perPage);
  const start = (currentPage - 1) * perPage;
  return { pageItems: items.slice(start, start + perPage), totalPages };
};
