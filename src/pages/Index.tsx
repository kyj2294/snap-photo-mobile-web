import React from 'react';
import Camera from '@/components/Camera';
import ThemeToggle from '@/components/ThemeToggle';
import { MapPin, List, User, Camera as CameraIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/hooks/useLocation';
const Index = () => {
  const {
    location,
    loading
  } = useLocation();
  return <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center">RecycLens</h1>
        <p className="text-sm opacity-90 text-center mt-1">이미지 인식 기반 재활용 가이드</p>
      
        {/* 위치 정보 표시 */}
        
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden p-4">
          <Camera />
        </div>
        
        {/* 갤러리에서 선택 버튼 */}
        <button className="w-full max-w-md py-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-900/30">
          <ImageIcon size={20} />
          <span>갤러리에서 선택</span>
        </button>
      </main>
      
      {/* 하단 네비게이션 바 */}
      
    </div>;
};
export default Index;