import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "@/api/user";
import { useShallow } from "zustand/react/shallow";
import { useBoundStore } from "@/stores";

export const userKeys = {
  all: ["user"],
  detail: (userId) => [...userKeys.all, userId],
};

// 로그인한 사용자 정보. 여러 화면에서 호출해도 요청은 한 번만 간다
export const useUser = ({ enabled = true } = {}) => {
  // 로그인 상태가 바뀌면 자동으로 다시 조회되도록 스토어를 구독한다
  const { isLoggedIn, userId } = useBoundStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
      userId: state.userId,
    })),
  );
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: getUser,
    enabled: enabled && isLoggedIn,
  });
};

// 정보 수정 후 캐시를 무효화해 헤더, 마이페이지 등에 새 정보가 반영되게 한다
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
};
