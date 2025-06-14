
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Index from "./pages/Index";
import MyPage from "./pages/MyPage";
import ActivityLog from "./pages/ActivityLog";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

// 쿼리 클라이언트 설정 - 로깅 활성화
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // 오류 발생 시 기본 로깅 활성화
      onError: (err) => console.error("Mutation error:", err)
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <div id="app-container" className="app-container">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/activity" element={<ActivityLog />} />
              <Route path="/rewards" element={<Rewards />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </HashRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
