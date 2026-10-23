# 병아리식탁 (Chick's Table) - Frontend

건강 상태(질병 정보)를 바탕으로 AI 영양사가 맞춤 레시피를 추천해 주는 웹 서비스입니다.
팀 프로젝트로 만든 프론트엔드를 실무 방식에 맞게 개인적으로 리팩터링한 저장소입니다.

## 주요 기능

| 기능                      | 설명                                                     | 로그인    |
| ------------------------- | -------------------------------------------------------- | --------- |
| 레시피 검색, 상세         | 식품안전나라 공공 API로 검색, 재료, 조리 과정, 영양 성분 | 필요 없음 |
| 나만의 영양사             | 내 질병 정보를 반영해 Gemini가 레시피 추천, 답변 저장    | 필요      |
| 저장한 레시피, 마이페이지 | 저장한 레시피 조회, 삭제, 프로필, 질병 정보 수정         | 필요      |

## 기술 스택

- **Frontend**: React 18, Vite 5, React Router 6
- **상태 관리**: TanStack Query 5 (서버 상태), Zustand 5 (클라이언트 상태)
- **HTTP**: axios
- **AI**: Google Gemini (`@google/genai`)
- **테스트**: Vitest 3, React Testing Library, MSW 2
- **CI**: GitHub Actions

## 리팩터링 결과

| 항목                              | 변경 전                            | 변경 후                                            |
| --------------------------------- | ---------------------------------- | -------------------------------------------------- |
| 테스트                            | 0개                                | 47개, PR마다 CI(lint, 테스트, 빌드) 통과해야 merge |
| 데이터 요청                       | 컴포넌트마다 `fetch` + `useEffect` | axios 모듈 + TanStack Query 커스텀 훅              |
| 상세 페이지 레시피 API 요청       | 2회                                | 1회                                                |
| 사용자 정보 요청 (여러 화면)      | 2회                                | 1회 (캐시 공유)                                    |
| 검색어 입력 시 카드 목록 리렌더링 | 2글자 입력에 4회                   | 0회                                                |
| 전역 상태                         | Context Provider, `storage` 이벤트 | Zustand slice                                      |
| 첫 화면 JS                        | 437KB                              | 411KB (Gemini SDK 지연 로딩)                       |

## 실행 방법

Node.js 22 기준입니다.

```bash
npm install
cp .env.example .env   # Windows cmd: copy .env.example .env
npm run dev
```

### 백엔드 없이 시연하기

`.env`를 아래처럼 설정하면 백엔드 서버 없이 모든 화면을 확인할 수 있습니다.

```
VITE_USE_MOCK=true
VITE_FOOD_API_KEY=식품안전나라_인증키
VITE_GEMINI_API_KEY=Gemini_API_키
```

- 로그인, 질병 정보, 저장한 레시피, 마이페이지는 더미 데이터(`src/mock.js`)로 동작하고 `chick` 계정으로 자동 로그인됩니다.
- 레시피는 실제 공공 API, 챗봇은 실제 Gemini를 호출합니다.
- 인증키 발급: [식품안전나라](https://www.foodsafetykorea.go.kr) (조리식품 레시피 DB, COOKRCP01), [Google AI Studio](https://aistudio.google.com)

## 테스트

```bash
npm test
```

- 구현 대신 화면에 보이는 결과와 사용자 동작으로 검증합니다.
- MSW로 백엔드, 공공 API, Gemini 요청을 네트워크 단계에서 가로채 실제 요청 코드를 그대로 테스트합니다.
- 리팩터링 전에 현재 동작을 특성 테스트로 고정하고, 알려진 버그는 `it.fails`로 기록한 뒤 고칠 때 일반 테스트로 바꿨습니다.

## 개선 내역

| PR                                                            | 내용                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [#2](https://github.com/Kwahk/chicks-table-frontend/pull/2)   | `fetch`를 axios 인스턴스로 통합, 토큰을 인터셉터로 자동 첨부                   |
| [#3](https://github.com/Kwahk/chicks-table-frontend/pull/3)   | 테스트 환경(Vitest, RTL, MSW), 특성 테스트, CI 구성                            |
| [#4](https://github.com/Kwahk/chicks-table-frontend/pull/4)   | 레시피 API 모듈화, XML → JSON, 조리 과정 누락, 중복 요청 버그 수정             |
| [#5](https://github.com/Kwahk/chicks-table-frontend/pull/5)   | TanStack Query 커스텀 훅, 검색어와 페이지를 URL에 저장, 상태별 화면            |
| [#6](https://github.com/Kwahk/chicks-table-frontend/pull/6)   | 컴포넌트 분리, 측정 후 `memo`, `useCallback`, `useMemo` 적용                   |
| [#8](https://github.com/Kwahk/chicks-table-frontend/pull/8)   | DOM 직접 접근을 `useRef`로 변경, 타이머, resize 리스너 메모리 누수 수정        |
| [#9](https://github.com/Kwahk/chicks-table-frontend/pull/9)   | Zustand slice로 전역 상태 관리, Context Provider 제거                          |
| [#11](https://github.com/Kwahk/chicks-table-frontend/pull/11) | 지원 종료된 Gemini SDK 마이그레이션, 지연 로딩으로 번들 824KB → 411KB          |
| [#12](https://github.com/Kwahk/chicks-table-frontend/pull/12) | 띄어쓰기가 있는 레시피 상세 조회 버그 수정, 테스트 대역을 실제 API와 같게 수정 |
| [#13](https://github.com/Kwahk/chicks-table-frontend/pull/13) | 레시피 검색은 로그인 없이 이용                                                 |

## 개선 예정

- **API 키 보호**: `VITE_` 환경 변수는 빌드 결과에 포함되므로, Gemini와 공공 API 호출을 서버에서 처리하도록 옮겨 키를 숨기기
- **https 배포 대응**: 공공 API가 `http://`라 https 사이트에서 막히는 문제(Mixed Content)를 같은 도메인의 프록시로 해결
- **백엔드 연동**: 팀 프로젝트 백엔드 서버가 내려가 있어 현재는 mock 모드로 시연 중
