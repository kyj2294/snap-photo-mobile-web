
import React from 'react';
import Camera from '@/components/Camera';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-500 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">모바일 카메라 앱</h1>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Camera />
      </main>
      
      <footer className="text-center p-4 text-sm text-gray-500">
        © 2025 카메라 앱
      </footer>
    </div>
  );
};

export default Index;
