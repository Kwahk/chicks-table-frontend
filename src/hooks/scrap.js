import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createScrap, deleteScrap, getScrap, getScraps } from "@/api/scrap";

export const scrapKeys = {
  all: ["scraps"],
  list: () => [...scrapKeys.all, "list"],
  detail: (id) => [...scrapKeys.all, "detail", id],
};

export const useScraps = () =>
  useQuery({ queryKey: scrapKeys.list(), queryFn: getScraps });

export const useScrap = (id) =>
  useQuery({
    queryKey: scrapKeys.detail(id),
    queryFn: () => getScrap(id),
    enabled: !!id,
  });

// 저장하면 목록 캐시를 무효화해 저장한 레시피 화면에 바로 반영되게 한다
export const useCreateScrap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, contents }) => createScrap(title, contents),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: scrapKeys.list() }),
  });
};

export const useDeleteScrap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScrap,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: scrapKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: scrapKeys.list() });
    },
  });
};
