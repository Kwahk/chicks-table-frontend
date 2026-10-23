import "./mock";
//import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";

// 서버에서 받아 온 데이터(레시피, 사용자 정보 등)의 캐시와 요청 상태를 관리한다
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안은 캐시된 데이터를 그대로 사용
      retry: 1, // 실패 시 한 번만 다시 시도
      refetchOnWindowFocus: false, // 탭을 다시 볼 때마다 새로 요청하지 않음
    },
  },
});

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  //</StrictMode>,
);
