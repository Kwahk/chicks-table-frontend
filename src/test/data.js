// 테스트에서 쓰는 가짜 데이터. 테스트마다 resetDb()로 처음 상태로 되돌린다

export const TEST_USER_ID = "chick";

const step = (count, prefix) =>
  Object.fromEntries(
    Array.from({ length: count }, (_, i) => {
      const no = String(i + 1).padStart(2, "0");
      return [`MANUAL${no}`, `${prefix} ${i + 1}단계`];
    }),
  );

// 공공 레시피 API(COOKRCP01)의 row 형식
// 이름 부분 일치 검색에서 "두부조림 정식"이 "두부조림"보다 먼저 오도록 순서를 둔다
export const recipeRows = [
  {
    RCP_SEQ: "1",
    RCP_NM: "두부조림 정식",
    RCP_PAT2: "일품",
    ATT_FILE_NO_MAIN: "",
    ATT_FILE_NO_MK: "",
    RCP_PARTS_DTLS: "두부, 밥, 김치",
    INFO_ENG: "550",
    INFO_CAR: "70",
    INFO_PRO: "25",
    INFO_FAT: "15",
    ...step(3, "정식"),
  },
  {
    RCP_SEQ: "2",
    RCP_NM: "두부조림",
    RCP_PAT2: "반찬",
    ATT_FILE_NO_MAIN: "",
    ATT_FILE_NO_MK: "",
    RCP_PARTS_DTLS: "두부 1모, 저염 간장 2큰술",
    INFO_ENG: "180",
    INFO_CAR: "8",
    INFO_PRO: "14",
    INFO_FAT: "10",
    ...step(12, "조림"),
  },
  // 페이지네이션 확인용 (한 페이지 8개)
  ...Array.from({ length: 10 }, (_, i) => ({
    RCP_SEQ: String(100 + i),
    RCP_NM: `채소 샐러드 ${i + 1}`,
    RCP_PAT2: "일품",
    ATT_FILE_NO_MAIN: "",
    ATT_FILE_NO_MK: "",
    RCP_PARTS_DTLS: "채소",
    INFO_ENG: "100",
    INFO_CAR: "10",
    INFO_PRO: "3",
    INFO_FAT: "2",
    ...step(2, "샐러드"),
  })),
];

const initialDb = () => ({
  user: {
    id: TEST_USER_ID,
    email: "chick@example.com",
    nickname: "병아리",
    profilePath: "",
    diseases: [{ name: "고혈압", contents: "90/140" }],
  },
  scraps: [
    {
      id: 1,
      title: "저장한 두부 요리",
      contents: "## 두부 요리\n두부를 굽습니다.",
    },
    { id: 2, title: "저장한 샐러드", contents: "## 샐러드\n채소를 씻습니다." },
  ],
  nextScrapId: 3,
});

export let db = initialDb();

export const resetDb = () => {
  db = initialDb();
};
