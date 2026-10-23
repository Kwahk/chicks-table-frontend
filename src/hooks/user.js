import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "@/api/user";
import { authStorage } from "@/common/authStorage";

export const userKeys = {
  all: ["user"],
  detail: (userId) => [...userKeys.all, userId],
};

// 로그인한 사용자 정보. 여러 화면에서 호출해도 요청은 한 번만 간다
export const useUser = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: userKeys.detail(authStorage.getUserId()),
    queryFn: getUser,
    enabled: enabled && authStorage.isLoggedIn(),
  });

// 정보 수정 후 캐시를 무효화해 헤더, 마이페이지 등에 새 정보가 반영되게 한다
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
};
