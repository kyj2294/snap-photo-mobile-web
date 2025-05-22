
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MyPage from "./pages/MyPage";
import ActivityLog from "./pages/ActivityLog";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

// QueryClient 초기화 방식 개선
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 한 번 재시도
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
    }
  }
});

// 함수형 컴포넌트 명확하게 정의
const App: React.FC = () => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/activity" element={<ActivityLog />} />
                <Route path="/rewards" element={<Rewards />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default App;
