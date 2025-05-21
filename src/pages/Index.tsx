
import React from 'react';
import Camera from '@/components/Camera';
import ThemeToggle from '@/components/ThemeToggle';
import { MapPin, Image, List, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center">RecycLens</h1>
        <p className="text-sm opacity-90 text-center mt-1">이미지 인식 기반 재활용 가이드</p>
      
        {/* 위치 정보 표시 */}
        <div className="mt-3 flex items-center justify-center text-sm opacity-90">
          <MapPin className="w-4 h-4 mr-1" />
          <span>화성시 병점동</span>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden p-4">
          <Camera />
        </div>
        
        {/* 갤러리에서 선택 버튼 */}
        <button 
          className="w-full max-w-md py-4 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-900/30"
        >
          <Image className="w-5 h-5" />
          <span>갤러리에서 선택</span>
        </button>
      </main>
      
      {/* 하단 네비게이션 바 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          <Link to="/" className="flex flex-col items-center text-green-600 dark:text-green-400">
            <List className="w-6 h-6" />
            <span className="text-xs mt-1">기록</span>
          </Link>
          
          <Link to="/" className="flex flex-col items-center">
            <div className="rounded-full bg-green-500 w-14 h-14 flex items-center justify-center -mt-6 border-4 border-white dark:border-gray-800">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">촬영</span>
          </Link>
          
          <Link to="/mypage" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">마이페이지</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
