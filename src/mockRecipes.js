// mock 모드에서 쓰는 공공 레시피 API(COOKRCP01) 더미 응답
// 실제 API와 같은 JSON 구조를 돌려주므로 api/recipe.js 코드는 그대로 동작한다
const IMAGE = "/chick.png";

const steps = (...texts) =>
  Object.fromEntries(
    texts.flatMap((text, i) => {
      const no = String(i + 1).padStart(2, "0");
      return [
        [`MANUAL${no}`, text],
        [`MANUAL_IMG${no}`, IMAGE],
      ];
    }),
  );

const rows = [
  {
    RCP_SEQ: "1",
    RCP_NM: "두부조림",
    RCP_PAT2: "반찬",
    ATT_FILE_NO_MAIN: IMAGE,
    ATT_FILE_NO_MK: IMAGE,
    RCP_PARTS_DTLS:
      "두부 1모, 저염 간장 2큰술, 다진 마늘 1작은술, 대파 1/2대, 물 100ml",
    INFO_ENG: "180",
    INFO_CAR: "8",
    INFO_PRO: "14",
    INFO_FAT: "10",
    ...steps(
      "1. 두부는 1cm 두께로 썰어 키친타월로 물기를 뺍니다.",
      "2. 대파는 송송 썹니다.",
      "3. 간장, 다진 마늘, 물을 섞어 양념장을 만듭니다.",
      "4. 팬에 두부를 앞뒤로 노릇하게 굽습니다.",
      "5. 양념장을 붓고 약불에서 졸입니다.",
      "6. 대파를 올려 마무리합니다.",
    ),
  },
  {
    RCP_SEQ: "2",
    RCP_NM: "두부 채소 볶음",
    RCP_PAT2: "반찬",
    ATT_FILE_NO_MAIN: IMAGE,
    ATT_FILE_NO_MK: IMAGE,
    RCP_PARTS_DTLS:
      "두부 1/2모, 애호박 1/2개, 양파 1/2개, 당근 1/4개, 올리브유 1큰술",
    INFO_ENG: "150",
    INFO_CAR: "10",
    INFO_PRO: "9",
    INFO_FAT: "8",
    ...steps(
      "1. 두부는 깍둑썰기 합니다.",
      "2. 애호박을 반달 모양으로 썹니다.",
      "3. 양파를 채 썹니다.",
      "4. 당근을 얇게 채 썹니다.",
      "5. 팬에 올리브유를 두릅니다.",
      "6. 두부를 먼저 넣어 노릇하게 굽습니다.",
      "7. 당근과 양파를 넣고 볶습니다.",
      "8. 애호박을 넣고 숨이 죽을 때까지 볶습니다.",
      "9. 소금 약간으로 간을 합니다.",
      "10. 불을 끄고 참깨를 뿌립니다.",
      "11. 그릇에 담아 완성합니다.",
    ),
  },
  {
    RCP_SEQ: "3",
    RCP_NM: "현미 닭가슴살 샐러드",
    RCP_PAT2: "일품",
    ATT_FILE_NO_MAIN: IMAGE,
    ATT_FILE_NO_MK: IMAGE,
    RCP_PARTS_DTLS:
      "닭가슴살 100g, 현미밥 1/2공기, 양상추 50g, 방울토마토 5개, 올리브유 1큰술",
    INFO_ENG: "320",
    INFO_CAR: "35",
    INFO_PRO: "28",
    INFO_FAT: "7",
    ...steps(
      "1. 닭가슴살을 삶아 결대로 찢습니다.",
      "2. 양상추와 방울토마토를 씻어 먹기 좋게 자릅니다.",
      "3. 현미밥과 채소, 닭가슴살을 담고 올리브유를 뿌립니다.",
    ),
  },
  {
    RCP_SEQ: "4",
    RCP_NM: "저염 된장국",
    RCP_PAT2: "국&찌개",
    ATT_FILE_NO_MAIN: IMAGE,
    ATT_FILE_NO_MK: IMAGE,
    RCP_PARTS_DTLS:
      "저염 된장 1큰술, 두부 1/4모, 애호박 1/4개, 양파 1/4개, 멸치 육수 400ml",
    INFO_ENG: "90",
    INFO_CAR: "7",
    INFO_PRO: "6",
    INFO_FAT: "3",
    ...steps(
      "1. 멸치 육수를 끓입니다.",
      "2. 된장을 풀고 채소를 넣습니다.",
      "3. 두부를 넣고 한소끔 더 끓입니다.",
    ),
  },
];

// 요청 주소: /{시작}/{끝}/RCP_NM={검색어}
export const mockRecipeAdapter = async (config) => {
  const [, start, end, query = ""] = config.url.split("/");
  const keyword = decodeURIComponent(query.replace("RCP_NM=", ""));
  const matched = rows
    .filter((row) => row.RCP_NM.includes(keyword))
    .slice(Number(start) - 1, Number(end));

  const data = {
    COOKRCP01: {
      total_count: String(matched.length),
      ...(matched.length && { row: matched }),
      RESULT: matched.length
        ? { CODE: "INFO-000", MSG: "정상처리되었습니다." }
        : { CODE: "INFO-200", MSG: "해당하는 데이터가 없습니다." },
    },
  };
  console.log("[MOCK] RECIPE", keyword, matched.length);
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: {},
  };
};
