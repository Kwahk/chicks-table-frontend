import { api } from "./client";
import { authStorage } from "@/common/authStorage";

export const getUser = () =>
  api.get(`/user/${authStorage.getUserId()}`).then((res) => res.data);

// 챗봇 프롬프트용 질병 문자열. 예: "고혈압(90/140), 당뇨"
export const getUserDisease = () =>
  getUser().then((user) => {
    if (!Array.isArray(user.diseases)) return "";
    return user.diseases
      .map((d) => `${d.name}${d.contents == "모름" ? "" : `(${d.contents})`}`)
      .join(", ");
  });

// 서버는 data(JSON) 와 file(프로필 사진) 을 multipart 로 받는다
export const updateUser = ({ nickname, diseases, file }) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify({ nickname, diseases })], {
      type: "application/json",
    }),
  );
  if (file) formData.append("file", file);
  return api.patch(`/user/${authStorage.getUserId()}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const changePassword = ({ email, password, newPassword }) =>
  api.patch(`/user/password/${authStorage.getUserId()}`, {
    email,
    password,
    newPassword,
  });
