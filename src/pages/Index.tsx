
import React from 'react';
import Camera from '@/components/Camera';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold text-center">AI 분리 배출 알림이</h1>
        <p className="text-sm opacity-80 text-center mt-1">환경을 생각하는 스마트한 선택</p>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 dark:bg-black/30 rounded-2xl border border-white/20 dark:border-white/5 shadow-xl overflow-hidden p-4">
          <Camera />
        </div>
      </main>
      
      <footer className="text-center p-5 text-sm dark:text-gray-400 text-gray-500 bg-gradient-to-t from-transparent to-transparent">
        <p>© 2025 AI 분리 배출 알림이</p>
        <p className="text-xs opacity-70 mt-1">환경 보호를 위한 스마트 솔루션</p>
      </footer>
    </div>
  );
};

export default Index;
